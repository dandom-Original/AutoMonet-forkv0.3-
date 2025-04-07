# AutoMonet Project Documentation

## Original Goals & Intent

Develop an autonomous income generation system that:
- Scrapes freelance jobs from free sources without requiring paid APIs
- Automatically generates and submits professional proposals
- Manages the entire business cycle from job discovery to payment processing
- Operates with zero budget using a "Kleinunternehmer" (small business) tax model
- Provides comprehensive visual monitoring through dashboards

## Project Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Job Scraping | ✅ Operational | Using free web scraping methods |
| Business Cycle | ✅ Operational | Running every 5-10 minutes |
| Dashboard | ✅ Operational | Running on port 5174 |
| Proposal Generation | ⏳ Basic Implementation | Templates without personalization |
| Payment Processing | 📝 Pending | Theoretical implementation only |

## System Architecture

### Core Components
1. **Job Scraper** (`/root/AutoMonet/src/scrapers/free_scraper.py`)
   - HTML scraping of Freelancer.com without API access
   - RSS feed processing from remote job boards
   - Reddit job post extraction

2. **Business Cycle** (`/root/AutoMonet/automonet.py`)
   - Orchestrates the entire job acquisition, proposal, and submission flow
   - Manages system health checks and dashboard updates
   - Implements configurable job filtering based on user preferences

3. **Dashboard** (`/root/AutoMonet/dashboard/app.py`)
   - Flask-based web interface with real-time updates
   - Interactive visualizations of key performance metrics
   - System logs and proposal tracking
   - Running on port 5174 (recently changed from 5173)

4. **Continuous Operation** (`/root/AutoMonet/automonet_5min.sh`)
   - Ensures continuous operation with randomized 5-10 minute intervals
   - Includes error handling and logging for reliability

### Configuration

The system is configured via `/root/AutoMonet/config.json` with the following key settings:

- **Job Preferences**: Keywords, budget range, categories, technology priorities
- **Job Sources**: Currently using scraping, RSS feeds, and Reddit (no paid APIs)
- **Model Preferences**: Configured for OpenRouter integration
- **System Settings**: Scrape interval, data directories, logging level
- **Wallet Configuration**: Ethereum wallet for payments with auto-sweep threshold
- **User Details**: Name, email, Kleinunternehmer status

## Access Information

- **Dashboard URL**: http://localhost:5174
- **Log Files**: `/root/AutoMonet/data/logs/`
- **Configuration**: `/root/AutoMonet/config.json`

## Current Limitations

- Reliance on HTML scraping (fragile if websites change their structure)
- Basic proposal templates without advanced AI personalization
- Limited error handling for edge cases
- No real payment processing integration yet
- Dashboard in config.json still references port 5173 (though app runs on 5174)

## Next Development Steps

1. Integrate OpenRouter API for AI-powered proposal generation
2. Implement proper tracking of submitted proposals and responses
3. Develop invoice generation system for completed projects
4. Add notification system for important events (new jobs, responses, etc.)
5. Update config.json to reflect the new dashboard port (5174)

## Backup and Recovery

A complete backup has been created at:
- `/root/AutoMonet_backup.tar.gz`

To restore the system from backup:
```bash
tar -xzf /root/AutoMonet_backup.tar.gz -C /destination/directory
```

After restoring, start the services:
```bash
# Start dashboard
nohup /root/AutoMonet/start_dashboard.sh > /root/AutoMonet/data/logs/dashboard.log 2>&1 &

# Start business cycle
nohup /root/AutoMonet/automonet_5min.sh > /root/AutoMonet/data/logs/automonet_daemon.log 2>&1 &
```

## Troubleshooting

- **Dashboard not accessible**: Verify processes are running with `ps aux | grep "python3.*app.py"`
- **No jobs found**: Check scraper logs at `/root/AutoMonet/data/logs/scraper.log`
- **System crashes**: Check memory usage and API rate limits
- **Port conflicts**: If port 5174 is in use, modify the port in `/root/AutoMonet/dashboard/app.py`

This documentation serves as a comprehensive project overview and roadmap for future development.
