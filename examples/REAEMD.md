# Grafana Performance Test Demo
This folder, `grafana-load-test-demo`, is part of the **Parallel** performance testing workspace. It is intended for **reference and leanring purposes** only.

## Purpose 
The JavaScript files in this fodler are **copied and adapted** from the original [Grafana Load Test source codes](https://github.com/grafana/grafana/tree/main/devenv/docker/loadtest) from Grafana Repository. 
They are included here to help understand:
- How **performance testing scripts** are organized in the K6 framework.
- How **[K6](https://k6.io/) executes performance scenarios** and manages virtual users.
- How to structure performance testing scripts for **learning and experimentation**

These scripts are **not meant for production benchmarking**. They serve purely as a **learning aid** to familiarize with K6 concepts. 

## Context
This folder complements our **BookInfo microservices performance tests**, which are based on the Istio repository. Our performance testing solutions gonna be introduced into Istio classical traffic scenes. The focus of this project remains on **practical performance testing** of a simple microservices application, using **K6** as the primary tool. 

## References
The original Grafana Load Test Examples can be found here: 
[Grafana Load Test Examples](https://github.com/grafana/grafana/tree/main/devenv/docker/loadtest).