# Core Parameters for Performance Testing with K6
When designing a performance test, particularly in a modern microservices environment, the proper configuration of test parameters is ciritical. K6 provides a flexible framework for laod and stress testing, and understanding the key parameters ensures accurate simulation of real-world traffic. 

## Virtual Users (VUs)
Virtual Users (VUs) are the simulated users that perform requests against your system under test. Each VU operates independently, executing the test script logic as if it were a real user interacting with the system. 

- **Role**: The number of VUs directly controls the concurrency of requests. A higher number of VUs simulates more users simultaneously, stressing the system more heavily. 
- **Impact**: If VUs are set too low, performance issues may remain hidden. Conversely, too many VUs can overwhelm your test environment or generate unrealistic scenarios. 

In K6, VUs are typically declare in the script or provided as a runtime parameter: 
```javascript 
export let options = {
    vus: 5, // 5 virtual users 
    duration: '10m'
}; 
```

Or dynamically via environment variables: 

```bash 
docker run -e VUS=10 grafana/k6 run test.js 
```

## Duration 
The `duration` parameter defines how long the test will run. Combined with VUs, it allows you to simulate different usage patterns over time. 
- **Role**: Duration determines the exposure time of the system to load. Long-running tests reveal issues like memory leaks or gradual degradation.
- **Impact**: Short durations can only capture immediate performance bottlenecks, while extended durations provide a better view of system stability under sustained load. 

Example in K6 script: 
```javascript
export let options = {
    duration: '15m' // run for 15 minutes 
}; 
```

## Iterations 
Iterations define how many times a particular script scenario should be executed. Unlike VUs, which define concurrency, iterations defines repetition of actions. 
- **Role**: Useful for tests where each user performs a fixed set of actions multiple times, helping to validate data consistency and system response. 
- **Impact**: High iteration counts with a low number of VUs can emulate many sequential users without overwhelming concurrency. 

In K6, iterations can be declared with the `iterations` executor: 
```javascript
export let options = {
    iterations = 50, // total script executions 
    vus: 1
}; 
```

## Ramp-Up and Ramp-Down 
Ramp-up and ramp-down define how the number of virtual users changes over time, instead of starting all users at once. 
- **Ramp-Up**: 
- **Ramp-Down**: 
- **Role**:
- **Impact**: