import http from 'k6/http'; 
import encoding from 'k6/encoding'; 
import { uuidv4 } from './util.js';

export const UIEndpoint = class UIEndpoint {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    login(username, pwd) {
        const payload = { user: username, password: pwd };
        return this.httpClient.post('/login', JSON.stringify(payload));
    }
}; 

export const DatasourcesEndpoint = class DatasourcesEndpoint { 
    constructor(httpClient) { 
        this.httpClient = httpClient; 
    }

    getAll() { 
        return this.httpClient.get('/datasources'); 
    }

    getById(id) { 
        return this.httpClient.get(`/datasources/${id}`); 
    }

    getByName(name) { 
        return this.httpClient.get(`/datasources/name/${name}`); 
    }

    create(payload) { 
        return this.httpClient.post(`/datasources/`, JSON.stringify(payload)); 
    }

    delete(id) { 
        return this.httpClient.delete(`/datasources/${id}`); 
    }
}; 

export const OrganizationEndpoint = class OrganizationEndpoint {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    getById(id) {
        return this.httpClient.get(`/orgs/${id}`);
    }

    getByName(name) {
        return this.httpClient.get(`/orgs/name/${name}`);
    }

    create(name) {
        let payload = {
            name: name,
        };
        
        return this.httpClient.post(`/orgs`, JSON.stringify(payload));
    }

    delete(id) {
        return this.httpClient.delete(`/orgs/${id}`);
    }
}; 

export const GrafanaClient = class GrafanaClient {
    constructor(httpClient) {
        httpClient.onBeforeRequest = this.onBeforeRequest;
        this.raw = httpClient;
        this.ui = new UIEndpoint(httpClient);
        this.orgs = new OrganizationEndpoint(httpClient.withUrl('/api'));
        this.datasources = new DatasourcesEndpoint(httpClient.withUrl('/api'));
    }

    batch(requests) {
        return this.raw.batch(requests);
    }

    withOrgId(orgId) {
        this.orgId = orgId;
    }

    onBeforeRequest(params) {
        params = params || {};
        params.headers = params.headers || {};
        if (this.orgId && this.orgId > 0) {
            params.headers['X-Grafana-Org-Id'] = this.orgId;
        }
    }
}; 


export const BaseClient = class BaseClient {
    constructor(url, subUrl) {
        if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
        }

        if (subUrl.endsWith('/')) {
        subUrl = subUrl.substring(0, subUrl.length - 1);
        }

        this.url = url + subUrl;
        this.onBeforeRequest = () => {};
    }

    withUrl(subUrl) {
        let c = new BaseClient(this.url, subUrl);
        c.onBeforeRequest = this.onBeforeRequest;
        return c;
    }

    beforeRequest(params) {}

    get(url, params) {
        params = params || {};
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.get(this.url + url, params);
    }

    formPost(url, body, params) {
        params = params || {};
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.post(this.url + url, body, params);
    }

    post(url, body, params) {
        params = params || {};
        params.headers = params.headers || {};
        params.headers['Content-Type'] = 'application/json';

        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.post(this.url + url, body, params);
    }

    delete(url, params) {
        params = params || {};
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.del(this.url + url, null, params);
    }

    batch(requests) {
        for (let n = 0; n < requests.length; n++) {
        let params = requests[n].params || {};
        params.headers = params.headers || {};
        params.headers['Content-Type'] = 'application/json';
        params.timeout = 120000;
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        requests[n].params = params;
        requests[n].url = this.url + requests[n].url;
        if (requests[n].body) {
            requests[n].body = JSON.stringify(requests[n].body);
        }
        }

        return http.batch(requests);
    }
};


// -- BasicAuthClient -- http client embedded username & password 
export class BasicAuthClient extends BaseClient {
    constructor(url, subUrl, username, password) {
        super(url, subUrl);
        this.username = username;
        this.password = password;
    }

    withUrl(subUrl) {
        let c = new BasicAuthClient(this.url, subUrl, this.username, this.password);
        c.onBeforeRequest = this.onBeforeRequest;
        return c;
    }

    beforeRequest(params) {
        params = params || {};
        params.headers = params.headers || {};
        let token = `${this.username}:${this.password}`;
        params.headers['Authorization'] = `Basic ${encoding.b64encode(token)}`;
    }
}; 

// -- BearerAuthClient -- http client embedded with bearer token 

export class BearerAuthClient extends BaseClient { 
    constructor(url, subUrl, token) { 
        super(url, subUrl); 
        this.token = token; 
    }

    withUrl(subUrl) { 
        let c = new BearerAuthClient(this.url, subUrl, this.token); 
        c.onBeforeRequest = this.onBeforeRequest; 
        return c; 
    }

    beforeRequest(params) { 
        params = params || {}; 
        params.header = params.header || {}; 
        params.headers['Authorization'] = `Bearer ${this.token}`; 
    }
}; 

// -- export functions --
export const createClient = (url) => {
    return new GrafanaClient(new BaseClient(url, ''));
};

export const createBasicAuthClient = (url, username, password) => {
    return new GrafanaClient(new BasicAuthClient(url, '', username, password));
};

export const createBearerAuthClient = (url, token) => {
    return new GrafanaClient(new BearerAuthClient(url, '', token));
};

export const createServiceAccountToken = (url, username, password) => {
    return () => {
        const basicClient = new BasicAuthClient(url, '', username, password);
        const saName = `k6-admin-sa-${uuidv4().slice(0, 6)}`;
        const saRes = basicClient.post('/api/serviceaccounts', JSON.stringify({
            name: saName,
            role: 'Admin'
        }));

        if (saRes.status !== 200 && saRes.status !== 201) { 
            throw new Error(`Failed to create service account, status: ${saRes.status}`); 
        }
        const saId = JSON.parse(saRes.body).id; 

        const tokenName = `k6-temp-token-${uuidv4().slice(0, 6)}`;
        const tokenRes = basicClient.post(`/api/serviceaccounts/${saId}/tokens`, JSON.stringify({
            name: tokenName,
            secondsToLive: 0, 
        })); 

        if (tokenRes.status != 200 && tokenRes.status != 201) { 
            throw new Error(`Failed to create service account token, status: ${tokenRes.status}`); 
        }

        const token = JSON.parse(tokenRes.body).key; 
        return new GrafanaClient(new BearerAuthClient(url, '', token));
    };
};