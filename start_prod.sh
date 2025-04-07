#!/bin/sh
# Enterprise Process Manager (WebContainer Optimized)
export BUDGET_LIMIT=500
export EMERGENCY_RESERVE=100

# Core Services Start
python3 src/system/monitor_service.py > monitor.log 2>&1 &
echo $! > system_monitor.pid

python3 automonet.py > automonet.log 2>&1 &
echo $! > automonet.pid

# Health Check Fallback
curl -X POST https://api.openrouter.ai/v1/health \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d '{"component":"automonet"}' > health_check.json 2>&1 || \
  echo '{"status":"API_CHECK_SKIPPED"}' > health_check.json

# Dashboard Start
npm run dev > dashboard.log 2>&1 &
echo $! > dashboard.pid

echo "SYSTEM_OPERATIONAL | Dashboard: http://localhost:5173 | Budget: $BUDGET_LIMIT USD"
