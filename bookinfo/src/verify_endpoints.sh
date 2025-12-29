#!/usr/bin/env bash
endpoints=(
  "http://details:9080/products/1"
  "http://reviews:9080/reviews/1"
  "http://ratings:9080/ratings/1"
)

for url in "${endpoints[@]}"; do
  echo "Checking $url ..."
  status=$(curl -s -o /dev/null -w "%{http_code}" $url)
  if [ "$status" -ne 200 ]; then
    echo "ERROR: $url returned status $status"
    exit 1
  else
    echo "$url is OK"
  fi
done