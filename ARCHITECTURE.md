# AutoMonet – Architekturdiagramme & Beschreibung

---

## 1. Gesamtarchitektur

```
+------------------+
|   Free Scraper   |
| (Reddit, Indeed) |
+--------+---------+
         |
         v
+---------------------+
|   AI Decision       |
|   Engine (ML)       |
+--------+------------+
         |
         v
+---------------------+
|     LLM Router      |
| (Highend/CostEff)   |
+--------+------------+
         |
         v
+---------------------+
| Proposal Generation |
+--------+------------+
         |
         v
+---------------------+
|   Proposal Submit   |
+--------+------------+
         |
         v
+---------------------+
|   Supabase DB       |
| (Jobs, Proposals)   |
+--------+------------+
         |
         v
+---------------------+
|   React Dashboard   |
+---------------------+
```

---

## 2. LLM Routing & Budget Flow

```
+---------------------+
|   LLM Router        |
+---------------------+
| Inputs:             |
| - Task Type         |
| - Token Estimate    |
| - Budget Status     |
| - Quality Threshold |
+---------------------+
         |
         v
+---------------------+
| Model Selection     |
| (GPT-4, Gemini,     |
|  OpenRouter, Local) |
+---------------------+
         |
         v
+---------------------+
| Budget Tracker      |
| - Update Usage      |
| - Enforce Limits    |
+---------------------+
```

---

## 3. Datenfluss (vereinfacht)

```
[Scraper] → [Decision Engine] → [LLM Router] → [Proposal] → [Submit] → [Supabase] → [Dashboard]
```

---

## 4. Komponentenbeschreibung

- **Scraper:** Kostenlos, HTML-basiert, erweiterbar.
- **Decision Engine:** ML-Modelle, Skills, Budget, ROI.
- **LLM Router:** Dynamische Modellwahl, Budget-bewusst.
- **Proposal Generator:** Multi-LLM, Templates, mehrsprachig.
- **Submitter:** API/HTML, Plattform-Agenten.
- **Supabase:** Auth, Daten, RLS, Policies.
- **Dashboard:** React, Echtzeit, Admin, Analytics.
- **Automation:** Shell, Python, Docker.
