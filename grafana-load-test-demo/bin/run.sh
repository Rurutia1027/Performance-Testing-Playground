#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${ROOT_DIR}/src"

run() {
  # k6 execution options
  DURATION="15m"
  VUS="2"
  TESTCASE="annotations_by_tag_test.js"

  # environment options
  URL="http://localhost:3000"
  SLOW_QUERY=""
  K6_OUT=""
  API_KEY=""

  while getopts ":d:v:t:u:s:o:k:h" opt; do
    case "${opt}" in
      d) DURATION="${OPTARG}" ;;
      v) VUS="${OPTARG}" ;;
      t) TESTCASE="${OPTARG}" ;;
      u) URL="${OPTARG}" ;;
      s) SLOW_QUERY="${OPTARG}" ;;
      o) K6_OUT="${OPTARG}" ;;
      k) API_KEY="${OPTARG}" ;;
      h)
        echo "Usage: ./bin/run.sh [options]"
        echo ""
        echo "k6 options:"
        echo "  -d <duration>      Test duration (default: 15m)"
        echo "  -v <vus>           Number of virtual users (default: 2)"
        echo "  -t <testcase>      Test script filename (default: annotations_by_tag_test.js)"
        echo ""
        echo "environment:"
        echo "  -u <url>           Grafana URL"
        echo "  -s <slow_query>    Slow query threshold"
        echo "  -o <k6_out>        k6 output"
        echo "  -k <api_key>       Grafana API key"
        exit 0
        ;;
      *)
        echo "Invalid option: -${OPTARG}" >&2
        exit 1
        ;;
    esac
  done

  shift $((OPTIND - 1))

  TESTCASE_PATH="${SRC_DIR}/${TESTCASE}"
  if [[ ! -f "${TESTCASE_PATH}" ]]; then
    echo "Testcase not found: ${TESTCASE_PATH}"
    exit 1
  fi

  echo "Running k6 test:"
  echo "  Testcase : ${TESTCASE_PATH}"
  echo "  URL      : ${URL}"
  echo "  Duration : ${DURATION}"
  echo "  VUs      : ${VUS}"

  docker run --rm -i \
    --network=host \
    -v "${ROOT_DIR}:${ROOT_DIR}" \
    -w "${ROOT_DIR}" \
    -e URL="${URL}" \
    -e SLOW_QUERY="${SLOW_QUERY}" \
    -e K6_OUT="${K6_OUT}" \
    -e API_KEY="${API_KEY}" \
    grafana/k6:latest run \
      --vus "${VUS}" \
      --duration "${DURATION}" \
      "${TESTCASE_PATH}"
}

run "$@"