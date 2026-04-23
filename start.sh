#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PORT=8765
URL="http://localhost:$PORT"

if ss -ltn 2>/dev/null | awk '{print $4}' | grep -q ":$PORT\$"; then
  echo "🟢 Server is already running on port $PORT"
  xdg-open "$URL" >/dev/null 2>&1 &
  echo "   Opened $URL in your browser."
  read -rp "Press Enter to close this window..."
  exit 0
fi

python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/mysandbox-server.log 2>&1 &
SERVER_PID=$!

sleep 1
xdg-open "$URL" >/dev/null 2>&1 &

cat <<EOF

🚀 MySandbox is running
   URL:  $URL
   PID:  $SERVER_PID
   Logs: /tmp/mysandbox-server.log

Press Ctrl+C (or close this window) to stop.

EOF

trap 'echo; echo "Stopping server..."; kill $SERVER_PID 2>/dev/null; exit 0' INT TERM
wait $SERVER_PID
