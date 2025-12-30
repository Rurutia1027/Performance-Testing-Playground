import http from 'k6/http'; 
import { check, sleep } from 'k6'; 

export let options = {
    vus: 20,
    duration: '5m',
    thresholds: {
        http_req_duration: ['p(90) < 500'], // 90% of requests should be under 500ms 
        'http_req_failed': ['rate<0.01'], // less than 1% failure rate 
    },
}; 

export default function () { 
    const res = http.get(`${__ENV.BOOKINFO_URL}/productpage`); 
    check(res, {
        'productpage loaded': (r) => r.status === 200,
    }); 
    sleep(1); 
}