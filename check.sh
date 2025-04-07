#!/bin/sh
# Kompatible Systemdiagnose
echo "=== SYSTEMDIAGNOSE ==="
echo "Prozesse:"
command ps
echo "\nPorts:"
command curl -s http://localhost:5173 | head -1
