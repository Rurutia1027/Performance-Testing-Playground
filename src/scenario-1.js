import { sleep, check } from "k6";
import { createClient } from "./modules/client.js";

export let options = {
    vus: 10,
    duration: '2m', 
}; 

const endpoint = __ENV.BOOKINFO_URL || 'http://localhost:9083'; 
const client = createClient(endpoint); 
export default function () { 
    let res = client.productpage.visit(); 

    check(res, {
        'status is 200': (r) => r.status === 200, 
        'body contains product': (r) => r.body.includes('productpage'), 
    }); 

    sleep(1); 
}; 
