#!/bin/sh
# Enterprise Launcher (WebContainer kompatibel)

# 1. Systeminitialisierung
echo "⚙️  Systemstart..."
export BUDGET_LIMIT=500
export EMERGENCY_RESERVE=100
rm -f *.pid *.log 2>/dev/null

# 2. Dienste starten
echo "🚀 Starte Services..."
python3 src/system/monitor_service.py > monitor.log 2>&1 &
echo $! > system_monitor.pid

python3 automonet.py > automonet.log 2>&1 &
echo $! > automonet.pid

# 3. Dashboard
echo "🌐 Starte Dashboard..."
npm run dev > dashboard.log 2>&1 &
echo $! > dashboard.pid

# 4. Status ohne sleep
echo "\n✅ SYSTEM BEREIT | Dashboard: http://localhost:5173"
echo "📊 Budget: \$ $BUDGET_LIMIT | Protokolle: ./automonet.log\n"

# 5. Simplifizierter Log-Monitor
echo "ℹ️  Log-Monitor deaktiviert (WebContainer Limit)"
