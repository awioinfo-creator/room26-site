#!/bin/bash
# Usage: tools/shot.sh <url-or-file> <width> <height> <out.png> [scrollY]
# Headless Chromium screenshot. For a "full page" view pass a tall height (e.g. 1440 6000).
# scrollY (optional) scrolls the window before capture (uses a tiny injected script via --virtual-time-budget).
URL="$1"; W="${2:-1440}"; H="${3:-900}"; OUT="${4:-shot.png}"; SY="${5:-0}"
CH=/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome
if [ "$SY" != "0" ]; then
  # wrap the page in a scrolled iframe-less approach: use a data-url page that scrolls to Y — simpler: use hash param handled by page? Fallback: use CDP-less trick via window-size tall.
  URL="$URL#__scroll=$SY"
fi
timeout 90 "$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size="$W,$H" --virtual-time-budget=6000 --run-all-compositor-stages-before-draw \
  --screenshot="$OUT" "$URL" >/dev/null 2>&1
echo "$OUT $(identify -format '%wx%h' "$OUT" 2>/dev/null)"
