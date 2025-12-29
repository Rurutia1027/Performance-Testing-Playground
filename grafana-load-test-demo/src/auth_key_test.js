import { sleep, check, group } from 'k6';
import { createServiceAccountToken } from './modules/client.js';
import { createTestOrgIfNotExists, createTestdataDatasourceIfNotExists } from './modules/util.js';

export let options = {
    noCookiesReset: true,
};

const endpoint = __ENV.URL || 'http://localhost:3000';

export const setup = () => { 
    const saTokenFn = createServiceAccountToken(endpoint, 'admin', 'admin');
    const clientWithToken = saTokenFn();
    const orgId = createTestOrgIfNotExists(clientWithToken);
    clientWithToken.withOrgId(orgId);
    const datasourceId = createTestdataDatasourceIfNotExists(clientWithToken);

    return {
        orgId,
        datasourceId,
        client: clientWithToken,
    };
}; 

export default (data) => {
    client.withOrgId(data.orgId); 

    group('API key test', () => { 
        if (__ITER === 0) { 
            group('User can access Grafana instance with token', () => {
                const res = client.datasources.getAll();
                check(res, {
                    'response status is 200': (r) => r.status === 200,
                });
            }); 
        }

        if (__ITER !== 0) { 
            group('Batch TSDB requests', () => { 
                const batchCount = 20; 
                const requests = [];
                const payload = {
                    from: '1547765247624',
                    to: '1547768847624',
                    queries: [
                        {
                            refId: 'A',
                            scenarioId: 'random_walk',
                            intervalMs: 10000,
                            maxDataPoints: 433,
                            datasourceId: data.datasourceId,
                        },
                    ],
                };

                requests.push({ method: 'GET', url: '/api/annotations?dashboardId=2074&from=1548078832772&to=1548082432772' });

                for (let n = 0; n < batchCount; n++) {
                    requests.push({ method: 'POST', url: '/api/ds/query', body: payload });
                }

                const responses = client.batch(requests);
                responses.forEach((res, idx) => {
                    check(res, { [`request ${idx} status is 200`]: (r) => r.status === 200 });
                });
            }); 
        }
    }); 

    sleep(2);
};

export const teardown = (data) => {
    // TODO: token can be revoked here 
}