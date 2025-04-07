# AutoMonet – Autonomous Multi-LLM Revenue Agent

AutoMonet ist eine hochmodulare, autonome AI-Plattform, die kontinuierlich Online-Jobs findet, bewertet, Proposal generiert & einreicht – mit dynamischer Multi-LLM-Orchestrierung, Budget-Optimierung, Supabase-Backend & React-Dashboard.

---

## Features

- **Autonomer Business-Zyklus:** Scraping, Analyse, Proposal, Submission, Budget-Tracking
- **Multi-LLM Orchestrierung:** GPT-4, Gemini, OpenRouter, lokale Modelle – dynamisch & budgetbewusst
- **Budget Enforcement:** Downgrade, Alerts, Limits
- **Supabase Backend:** Auth, Daten, RLS, Policies
- **FastAPI Backend:** REST-API für Jobs, Proposals, Settings, Analytics, LLM-Selection
- **React Frontend:** Dashboards, Proposal-Flow, Settings, Admin
- **Containerisiert:** Docker Compose für alle Komponenten
- **CI/CD:** Automatisierte Tests & Builds
- **Security:** API Keys via ENV, JWT-Auth, RLS, HTTPS

---

## Setup

### Voraussetzungen

- Node.js >=16
- Python >=3.8
- Supabase Projekt (URL, Anon Key, JWT Secret)
- API Keys: OpenRouter, OpenAI, Gemini

### .env Beispiel

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_JWT_SECRET=...
VITE_OPENROUTER_API_KEY=...
VITE_OPENAI_API_KEY=...
VITE_GEMINI_API_KEY=...
```

### Installation

```bash
npm install
pip install -r requirements.txt  # falls vorhanden
```

### Starten

- **Frontend:** `npm run dev` (http://localhost:5173)
- **Backend:** `python3 -m src.api_server` (http://localhost:8000)
- **Dashboard (Flask):** http://localhost:5174
- **Docker Compose:** `docker compose up -d`

---

## Architektur

```
[Scraper] → [Decision Engine] → [LLM Router] → [Proposal] → [Submit] → [Supabase] → [Dashboard]
```

- **Supabase:** User, Jobs, Proposals, Settings, Forecasts
- **FastAPI:** REST-API, Budget Enforcement, LLM Auswahl
- **LLM Router:** Dynamische Modellwahl, Downgrade, Budget
- **Frontend:** React, Tailwind, Echtzeit-Dashboards
- **Automation:** Shell, Python, Docker

---

## Status

- [x] Supabase Schema, Policies, Migrations
- [x] FastAPI Backend mit Auth, Budget, Endpoints
- [x] LLM Router mit Budget Enforcement & Downgrade
- [x] Frontend mit API-Integration
- [x] Dockerfiles & Compose
- [x] Tests (Pytest, Vitest), CI/CD
- [x] Global Rules, MCP Prompts, Architektur-Doku
- [ ] Supabase REST Calls final testen
- [ ] Frontend Proposal-Flow & Budget-Alerts verbessern
- [ ] Security-Hardening & Pen-Tests
- [ ] Monitoring & Alerts
- [ ] Finales Deployment & Doku

---

## Lizenz

Proprietär. Alle Rechte vorbehalten.
