import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 100,             // number of virtual users
    duration: '10m',      // test duration
    thresholds: {
        http_req_duration: ['p(90)<1000'],  // 90% requests under 1s
        'http_req_failed': ['rate<0.05'],  // allow up to 5% failures under stress
    },
};

export default function () {
    const res = http.get(`${__ENV.BOOKINFO_URL}/productpage`);
    check(res, {
        'productpage loaded': (r) => r.status === 200,
    });
    sleep(1);
}
