# AutoMonet – Projektplanung (Stand: 2024-07-26)

---

## Vision

- Vollautonomer AI-Agent, der online Geld verdient
- Multi-LLM Orchestrierung, Budget-optimiert
- Minimaler manueller Aufwand, maximaler Automatisierungsgrad
- Sicher, modular, skalierbar, transparent

---

## Architektur

- **Scraper:** Reddit, Indeed, erweiterbar
- **Decision Engine:** ML-gestützt, Skills, Budget, ROI
- **LLM Router:** Dynamische Modellwahl, Budget Enforcement, Downgrade
- **Proposal Generator:** Multi-LLM, Templates, mehrsprachig
- **Submitter:** API/HTML, Plattform-Agenten
- **Supabase:** User, Jobs, Proposals, Settings, Forecasts, RLS
- **FastAPI:** REST-API, Auth, Budget, LLM Auswahl
- **Frontend:** React, Tailwind, Echtzeit-Dashboards
- **Automation:** Shell, Python, Docker, CI/CD

---

## Tech Stack & Standards

- Python 3.8+, FastAPI, SQLAlchemy/SQLModel, Pydantic
- React 18, Vite, TailwindCSS
- Supabase (Postgres, Auth, RLS)
- Docker Compose
- PEP8, Type Hints, Google-Style Docstrings
- <500 Zeilen pro Datei, Modularisierung
- Pytest, Vitest, Coverage >80%
- ENV-Variablen für Secrets
- Global Rules, MCP Prompts, AI Coding Workflow

---

## Roadmap (aktualisiert)

### Phase 1: MVP (abgeschlossen)

- [x] Supabase Schema, Policies
- [x] Scraper, AI Filter, Proposal Generator
- [x] FastAPI Grundgerüst
- [x] Frontend Grundgerüst
- [x] Docker, CI/CD, Tests

### Phase 2: Multi-LLM & Budget (abgeschlossen)

- [x] LLM Router mit Budget Enforcement
- [x] Proposal Pipeline mit Downgrade
- [x] API-Integration Frontend <-> Backend

### Phase 3: Finalisierung (laufend)

- [ ] Supabase REST Calls final testen
- [ ] Frontend Proposal-Flow & Budget-Alerts verbessern
- [ ] Security-Hardening (JWT, RLS, API Keys)
- [ ] Monitoring & Alerts (Prometheus, Grafana)
- [ ] End-to-End-Tests
- [ ] Deployment-Skripte & Docs

---

## Offene Punkte

- Supabase REST Calls stabilisieren
- Budget-Alerts ins Dashboard
- Pen-Tests für RLS & Auth
- HTTPS & Secrets Management
- User-Onboarding & Admin-Tools
- Developer-Doku & API-Specs

---

## Zusammenfassung

AutoMonet ist zu 80% fertig. Fokus jetzt: **Security, Budget, Monitoring, UX, Deployment.**
