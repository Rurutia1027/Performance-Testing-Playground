#!/bin/bash

# -------------------------------
# Script: run_scenario1.sh
# Purpose: Run k6 performance test for Scenario 1
# -------------------------------

# Bookinfo service endpoint (docker-compose port mapping)
export BOOKINFO_URL="http://localhost:9083"

# Path to k6 scenario script
SCENARIO_SCRIPT="../src/scenario-1.js"

# Set output directory for metrics
OUTPUT_DIR="../results"
mkdir -p $OUTPUT_DIR

# Run k6 test
k6 run \
    --out json=$OUTPUT_DIR/scenario1_results.json \
    $SCENARIO_SCRIPT 
# Optional: Print summary
echo "Scenario 1 test finished. Results saved in $OUTPUT_DIR/scenario1_results.json"
