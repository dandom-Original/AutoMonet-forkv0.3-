#!/bin/bash

# AutoMonet - Continuous operation with 5-10 minute intervals
# This script runs AutoMonet in an infinite loop with randomized intervals

LOG_FILE="/root/AutoMonet/data/logs/daemon.log"
CYCLE_COUNT=1

# Ensure log directory exists
mkdir -p /root/AutoMonet/data/logs

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting AutoMonet daemon with 5-10 minute intervals"
log "Press Ctrl+C to stop the daemon"

# Trap for clean shutdown
trap 'log "Shutting down AutoMonet daemon"; exit 0' SIGINT SIGTERM

# Main loop
while true; do
    log "Starting business cycle #$CYCLE_COUNT"
    
    # Run the AutoMonet business cycle
    python3 /root/AutoMonet/automonet.py --action run
    
    if [ $? -eq 0 ]; then
        log "Business cycle #$CYCLE_COUNT completed successfully"
    else
        log "WARNING: Business cycle #$CYCLE_COUNT encountered errors"
    fi
    
    # Calculate a random delay between 5-10 minutes (300-600 seconds)
    DELAY=$((300 + RANDOM % 301))
    
    log "Next business cycle #$((CYCLE_COUNT+1)) scheduled in $DELAY seconds"
    log "Sleeping for $DELAY seconds..."
    
    # Increment cycle counter
    CYCLE_COUNT=$((CYCLE_COUNT+1))
    
    # Sleep for the calculated delay
    sleep $DELAY
done
