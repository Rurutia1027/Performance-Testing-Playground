#!/bin/bash

# -------------------------------
# Script: run_all_scenarios.sh
# Purpose: Sequentially run k6 performance test scenarios
# -------------------------------

# Bookinfo service endpoint
export BOOKINFO_URL="http://localhost:9083"

# Path to k6 scenario scripts
SCENARIOS=(
    "../src/scenario-1.js"
    "../src/scenario-2.js"
    "../src/scenario-3.js"
)

# Set output directory for metrics
OUTPUT_DIR="../results"
mkdir -p $OUTPUT_DIR

# Loop through each scenario
for SCENARIO_SCRIPT in "${SCENARIOS[@]}"; do
    SCRIPT_NAME=$(basename "$SCENARIO_SCRIPT" .js)
    OUTPUT_FILE="$OUTPUT_DIR/${SCRIPT_NAME}_results.json"

    echo "Running $SCRIPT_NAME..."
    k6 run --out json="$OUTPUT_FILE" "$SCENARIO_SCRIPT"

    echo "$SCRIPT_NAME finished. Results saved in $OUTPUT_FILE"
    echo "Sleeping 10 seconds before next scenario..."
    sleep 10
done

echo "All scenarios completed."