# Bookinfo Performance & Load Testing Playground 

This repository provides a **hands-on performance and load testing playground** based on the classic **Istio Bookinfo** microservices application. 

The goal is to **understand**, **compare**, and **practice performance testing strategies** across different runtime environments and load generators, rather than to build a production-grade benchmarking system. 

## Objectives 
This repository is designed to:
- Build a **clear mental model of performance testing** for microservices
- Compare **Docker Compose** vs. **Kubernetes(Kind)** runtime behavior
- Practice **load and performance testing** using: 
> **k6** (code driven, modern load testing)
> **JMeter** (traditional, XML-based load testing)
- Create **reproducible**, **CI-friendly performance experiments**
- Serve as a **learning** and **referencing project** for performance testing fundamentals. 


## System Under Test (SUT)

**Application: [BookInfo](https://istio.io/latest/docs/examples/bookinfo/)**
Bookinfo is a simple microservices application consisting of: 
- Frontend (Product Page)
- Backend services:
> Details
> Reviews
> Ratings 

It is intentionally chosen because it includes:
- Service-to-service calls
- Frontend + backend interactions 
- Clear HTTP endpoints 
- Common Istio demo scenarios (A/B testing, traffic splitting)

## Deployment Modes 
This repository supports **two execution environemnts**:

### Docker Compose 
### Kubernetes (Kind)

## Load & Performance Tools 
### k6 (Primary Tool)
- JavaScript-based test scripts
- CLI-first, CI-friendly --> **ideal for cloud native env, also friendly for script based automation!!**
- Native integration with Grafana ecosystem
- Focused on:
> Code readability
> Scenario-driven testing 
> Modern DevOps workflows 

Typical use cases in this repo: 
- Endpoint load generation 
- Parallel request simulation 
- Scenario-based traffic patterns

### JMeter (Secondary / Comparative Tool)
- XML-based test plans 
- Industry-standard legacy tool 
- Useful for:
> Understanding traditional performance testing approaches
> Comparing scripting vs UI-driven models

## Repository Structure (Proposed)
```
.
├── bookinfo/
│   ├── docker-compose/
│   └── kubernetes/
│
├── k6/
│   ├── scenarios/
│   │   ├── smoke_test.js
│   │   ├── load_test.js
│   │   ├── stress_test.js
│   │   └── spike_test.js
│   ├── utils/
│   └── README.md
│
├── jmeter/
│   ├── test-plans/
│   └── README.md
│
├── docs/
│   ├── performance-testing-basics.md
│   ├── k6-vs-jmeter.md
│   └── metrics-explained.md
│
└── README.md
```

## Performance Testing Concepts Covered 
This project focuses on **practical and essential concpets**, including: 
### Traffic Generation 
- Sequential vs parallel requests
- Fixed VUs vs ramp-up strategies 
- Request rate vs concurrency 

### Service Interaction Awareness 
- Frontend-driven traffic 
- Backend fan-out patterns 
- Cascading latency effects 

### Metrics You Should Actually Care About 
- Response time (p50/p90/p95)
- Error rate 
- Throughput(RPS)
- Stability under sustained load 

### What This Project Does Not Focus On
- Synthetic enterprise-scale benchmarks 
- Hardware-level tuning
- Vendor-specific performance claims 

## CI / Automation (Future Scope)
This repository is designed to be **CI-compatible**, especially with **GitHub Actions**, but without assuming large compute resources.
Typically CI use cases: 
- Smoke performance tests
- Regression detection 
- Basic latency threshold checks 


## Intended Audience 
- Backend / Platform Engineers
- Cloud-native learners
- Engineers preparing for: 
> Kubernetes 
> Service Mesh 
> Performance testing interviews 
- Engineers transitioning from functional testing to performance testing 

## Disclaimer 
This repository is a **learning and experimentation project**.
Results should be interpreted **comparatively**, not as absolute performance benchmarks. 


## Next Steps 
- Add Istio traffic management scenarios
- Integrate Playwright for frontend validation 
- **Export k6 result into Grafana dashboards**
- Add GitHub Action pipelines 

## LICENSE 
[LICENSE](./LICENSE)