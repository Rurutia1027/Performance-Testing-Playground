# Performance Test Plan: Bookinfo Application 
## Objective 
The purpose of this performance test is to support **istio traffic automated integration tests** by: 
- Identifying high-fidelity traffic triggers (entrypoints) for load generation.
- Understanding the function of each microservice and the data flow between them.
- Collecting performance metrics to inform automated testing of traffic management, routing rules, and service resilience. 


## System Under Test (SUT)
### productpage
The `productpage` service serves as the user-interface entry point, aggregating data from `details`, `reviews`, and `ratings`.

**Endpoints**
```
http://<BOOKINFO_HOST>/productpage
```
- HTTP Method: GET
- Request Body: None 
- Sample Response: HTML page containing aggregated product data.

**Curl Example**:
```bash 
curl -X GET http://<BOOKINFO_HOST>/productpage
```

**Flow Notes**:
- Acts as the main **load trigger**(entrypoint) for downstream calls: `details -> reviews -> ratings`. 
- Useful for testing end-to-end response times and chain latency.

### details
The `details` service provides detailed information for each product. 
- Endpoint: `/details/<product_id>`
- HTTP Method: GET 
- Sample Response: 
```json
{
  "id": "0",
  "name": "Book 0",
  "description": "A fascinating story."
}
```

**Curl Example**
```bash 
curl -X GET http://<BOOKINFO_HOST>/details/0
```

**Flow Notes**:
- Typically called by `productpage`
- Can be load-tested independently to validate standalone service performance. 

### reviews 
The `reviews` service returns product reviews, optionally including ratings. 
- Endpoint: `/reviews/<product_id>`
- HTTP Method: GET
- Sample Response: 
```json 
[
  { "reviewer": "Alice", "text": "Great book!", "rating": 5 },
  { "reviewer": "Bob", "text": "Interesting read.", "rating": 4 }
]
```

**Curl Example**
```bash
curl -X GET http://<BOOKINFO_HOST>/reviews/0
```

**Flow Notes**:
- Called by `productpage` to display review data. 
- Independent load tests can measure review service capacity under stress. 

## ratings 
The `ratings` service provides rating information and is usually called by `reviews`.
- Endpoint: `/ratings/<product_id>`
- HTTP Method: GET 
- Sample Response: 
```json 
{ "ratings": [5, 4, 3] }
```

**Curl Example**
```bash
curl -X GET http://<BOOKINFO_HOST>/ratings/0
```

**Flow Notes**
- Typically invoked downstream from `reviews`
- Independent testing identifies the impact of accumulated traffic on performance. 

## Test Scenarios & Parameters
### Scenario 1: Entrypoint Load Test
- Description: Load test productpage to trigger downstream services.
- Duration: 2 minutes
- Virtual Users (VUs): 10
- Metrics: Response time (P50/P90/P99), throughput, error rate

### Scenario 2: Full Request Path Test
- Description: Simulate user visits triggering the full path: productpage → details → reviews → ratings.
- Duration: 5 minutes
- VUs: 20
- Metrics: End-to-end latency, individual service latency, error rate

## Scenario 3: Stress Test
- Description: High-concurrency stress test to identify system bottlenecks.
- Duration: 5–10 minutes
- VUs: 50–100
- Metrics: Response time, error rate, CPU/memory utilization, per-service throughput

## Metrics to Collect
- Response Time: P50, P90, P99
- Throughput: Requests per second (RPS)
- Error Rate: Failed requests percentage
- Resource Utilization: CPU, memory (via Prometheus/Grafana if available)