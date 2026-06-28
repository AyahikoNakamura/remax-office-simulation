#!/bin/zsh

# REMAX COMPASS（経営シミュレーター）起動
# 静的サーバ(8770)を起動 → 準備でき次第ブラウザを自動オープン
# ※ File System Access API（POLARISへ自動書き出し）のため localhost 必須

set -u

PROJECT_DIR="/Users/ayahiko/Projects/remax-office-simulation"
PORT="8770"
URL="http://localhost:$PORT/"
LOG_FILE="/tmp/remax_compass_server.log"
PID_FILE="/tmp/remax_compass_server.pid"

cd "$PROJECT_DIR" || exit 1

is_ready() {
  /usr/bin/curl -fsS "$URL" >/dev/null 2>&1
}

start_server() {
  if is_ready; then
    return 0
  fi

  if [ -f "$PID_FILE" ]; then
    old_pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [ -n "${old_pid:-}" ] && /bin/kill -0 "$old_pid" >/dev/null 2>&1; then
      return 0
    fi
  fi

  /usr/bin/python3 -m http.server "$PORT" --directory "$PROJECT_DIR" \
    > "$LOG_FILE" 2>&1 &

  echo "$!" > "$PID_FILE"
}

open_browser_when_ready() {
  for _ in {1..30}; do
    if is_ready; then
      /usr/bin/open "$URL"
      exit 0
    fi
    /bin/sleep 1
  done

  /usr/bin/open "$URL"
}

start_server
open_browser_when_ready
