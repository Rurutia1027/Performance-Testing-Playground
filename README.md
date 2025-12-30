# Bookinfo Performance & Load Testing Playground

This repository provides a **hands-on performance and load testing playground** based on the classic **Istio Bookinfo** microservices application.

The goal is to **understand**, **compare**, and **practice performance testing strategies** across different runtime environments and load generators, rather than to build a production-grade benchmarking system.

## Objectives

This repository is designed to:

* Build a **clear mental model of performance testing** for microservices
* Compare **Docker Compose** vs. **Kubernetes(Kind)** runtime behavior
* Practice **load and performance testing** using:

> **k6** (code-driven, modern load testing)

* Create **reproducible**, **CI-friendly performance experiments**
* Serve as a **learning** and **referencing project** for performance testing fundamentals.

## System Under Test (SUT)

**Application: [BookInfo](https://istio.io/latest/docs/examples/bookinfo/)**
Bookinfo is a simple microservices application consisting of:

* Frontend (Product Page)
* Backend services:

> Details
> Reviews
> Ratings

It is intentionally chosen because it includes:

* Service-to-service calls
* Frontend + backend interactions
* Clear HTTP endpoints
* Common Istio demo scenarios (A/B testing, traffic splitting)

## Deployment Modes

This repository supports **two execution environments**:

### Docker Compose

### Kubernetes (Kind)

## Load & Performance Tools

### k6 (Primary Tool)

* JavaScript-based test scripts
* CLI-first, CI-friendly → **ideal for cloud-native environments and automation**
* Native integration with Grafana ecosystem
* Focused on:

> Code readability
> Scenario-driven testing
> Modern DevOps workflows

Typical use cases in this repo:

* Endpoint load generation
* Parallel request simulation
* Scenario-based traffic patterns

---

## k6 vs. JMeter: Scenario Comparison

| Aspect               | k6 Strengths                                            | Scenarios k6 Cannot Fully Cover (JMeter Advantage)                    |
| -------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Script Style         | Modern JavaScript, easily versioned in Git, CI-friendly | XML-based GUI test plans with UI recording for legacy workflows       |
| Parallel Requests    | Handles VUs and batch requests programmatically         | Visual thread groups for complex UI flows                             |
| Automation           | Native CLI, GitHub Actions, Docker integration          | GUI-driven load tests, may require extra scripting for CI             |
| Real-time Metrics    | Integrates with Prometheus & Grafana dynamically        | Some older JMeter listeners not real-time by default                  |
| Scenario Flexibility | Custom logic and dynamic data handling                  | Easier to design complex recorded user journeys with GUI              |
| Cloud-native         | Works well in containerized microservices setups        | GUI-heavy, less convenient for CI/CD pipelines                        |
| Protocols            | HTTP, WebSocket, gRPC (with extensions)                 | Supports additional legacy protocols out-of-the-box (JDBC, FTP, SOAP) |
| Replay & Scaling     | Code-driven VU scaling                                  | Prebuilt JMeter GUI workflows can replay sequences without coding     |

> **Note:** This repo focuses primarily on **k6 scenarios**, but the table illustrates where JMeter still has advantages for legacy or highly GUI-driven test flows.

---

## Repository Structure (Proposed)

```
.
├── LICENSE
├── README.md
├── bin // load testing setup shell script 
├── bookinfo // src codes copied from Istio Bookinfo folder 
├── conf // config files for grafana & promethus -> locally display k6 test reports 
├── docker-compose.yml // docker compose setup test objects of Istio BookInfo 
├── docs  // docs surrounding load test 
├── examples // examples take from Grafana k6 load testing cases
├── results // k6 test reports in json 
└── src // k6 load test cases for Istio Bookinfo project
```

## Performance Testing Concepts Covered

This project focuses on **practical and essential concepts**, including:

### Traffic Generation

* Sequential vs parallel requests
* Fixed VUs vs ramp-up strategies
* Request rate vs concurrency

### Service Interaction Awareness

* Frontend-driven traffic
* Backend fan-out patterns
* Cascading latency effects

### Metrics You Should Actually Care About

* Response time (p50/p90/p95)
* Error rate
* Throughput(RPS)
* Stability under sustained load

### What This Project Does Not Focus On

* Synthetic enterprise-scale benchmarks
* Hardware-level tuning
* Vendor-specific performance claims

## CI / Automation (Future Scope)

This repository is designed to be **CI-compatible**, especially with **GitHub Actions**, but without assuming large compute resources.
Typically, CI use cases:

* Smoke performance tests
* Regression detection
* Basic latency threshold checks

## Disclaimer

This repository is a **learning and experimentation project**.
Results should be interpreted **comparatively**, not as absolute performance benchmarks.

## LICENSE

[LICENSE](./LICENSE)
