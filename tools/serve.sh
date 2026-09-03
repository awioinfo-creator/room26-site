#!/bin/bash
# Serves the project root on http://127.0.0.1:8126 (background). Idempotent.
cd "$(dirname "$0")/.."
if curl -s -o /dev/null http://127.0.0.1:8126/ ; then echo "already serving on 8126"; exit 0; fi
nohup python3 -m http.server 8126 --bind 127.0.0.1 >/tmp/room26-serve.log 2>&1 &
sleep 1; curl -s -o /dev/null -w "serving http://127.0.0.1:8126/ -> %{http_code}\n" http://127.0.0.1:8126/
