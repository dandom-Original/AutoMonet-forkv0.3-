#!/bin/sh
# Enterprise Log Viewer (POSIX compliant)
while :
do
  clear
  echo "=== AUTOMONET LIVE LOGS ==="
  echo "Last 15 lines (Updated: $(date))"
  echo "---------------------------"
  tail -n 15 automonet.log 2>/dev/null || echo "LOG_UNAVAILABLE"
  sleep 5
done
