import http from 'k6/http';
import encoding from 'k6/encoding';

// -- Base HTTP Client --
export const BaseClient = class BaseClient {
    constructor(url, subUrl = '') {
        if (url.endsWith('/')) url = url.slice(0, -1);
        if (subUrl.endsWith('/')) subUrl = subUrl.slice(0, -1);
        this.url = url + subUrl;
        this.onBeforeRequest = () => {};
    }

    withUrl(subUrl) {
        const c = new BaseClient(this.url, subUrl);
        c.onBeforeRequest = this.onBeforeRequest;
        return c;
    }

    beforeRequest(params) {}
    
    get(url, params = {}) {
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.get(this.url + url, params);
    }

    post(url, body, params = {}) {
        params.headers = params.headers || {};
        params.headers['Content-Type'] = 'application/json';
        this.beforeRequest(params);
        this.onBeforeRequest(params);
        return http.post(this.url + url, body, params);
    }
};

// -- Basic Auth Client (for login if needed) --
export class BasicAuthClient extends BaseClient {
    constructor(url, subUrl = '', username, password) {
        super(url, subUrl);
        this.username = username;
        this.password = password;
    }

    beforeRequest(params) {
        params.headers = params.headers || {};
        const token = `${this.username}:${this.password}`;
        params.headers['Authorization'] = `Basic ${encoding.b64encode(token)}`;
    }
}

// -- Bookinfo Endpoints --
export const ProductpageEndpoint = class ProductpageEndpoint {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    visit() {
        return this.httpClient.get('/productpage');
    }
};

export const DetailsEndpoint = class DetailsEndpoint {
    constructor(httpClient) { this.httpClient = httpClient; }

    get(productId) {
        return this.httpClient.get(`/details/${productId}`);
    }
};

export const ReviewsEndpoint = class ReviewsEndpoint {
    constructor(httpClient) { this.httpClient = httpClient; }

    get(productId) {
        return this.httpClient.get(`/reviews/${productId}`);
    }
};

export const RatingsEndpoint = class RatingsEndpoint {
    constructor(httpClient) { this.httpClient = httpClient; }

    get(productId) {
        return this.httpClient.get(`/ratings/${productId}`);
    }
};

// -- Bookinfo Client --
export const BookinfoClient = class BookinfoClient {
    constructor(httpClient) {
        this.raw = httpClient;
        this.productpage = new ProductpageEndpoint(httpClient);
        this.details = new DetailsEndpoint(httpClient);
        this.reviews = new ReviewsEndpoint(httpClient);
        this.ratings = new RatingsEndpoint(httpClient);
    }

    batch(requests) {
        return this.raw.batch(requests);
    }
};

// -- Client Factory --
export const createClient = (url) => new BookinfoClient(new BaseClient(url));
export const createBasicAuthClient = (url, username, password) => new BookinfoClient(new BasicAuthClient(url, '', username, password));
