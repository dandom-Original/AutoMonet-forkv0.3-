# AutoMonet – API & Datenmodell Dokumentation

---

## 1. Supabase Tabellen

### `user_settings`

| Feld             | Typ        | Beschreibung                     |
|------------------|------------|---------------------------------|
| user_id (PK)     | UUID       | User ID (auth.users)            |
| profile          | JSONB      | Name, Email, Skills             |
| job_preferences  | JSONB      | Budget, Keywords, Prioritäten   |
| ai_settings      | JSONB      | LLM-Config, Budget, Modelle     |
| platform_settings| JSONB      | Plattformen, Limits             |
| system_settings  | JSONB      | Intervalle, Debug, Budget       |
| created_at       | TIMESTAMPTZ| Erstellt                        |
| updated_at       | TIMESTAMPTZ| Letzte Änderung                 |

**RLS:** Nur User selbst.  
**Policies:** CRUD für eigenen Datensatz.

---

### `ai_models`

| id (PK)          | UUID       | Modell-ID                       |
| name             | TEXT       | Modellname                      |
| version          | TEXT       | Version                         |
| cost_per_call    | DECIMAL    | Kosten                          |
| accuracy         | DECIMAL    | Genauigkeit                     |

---

### `job_analysis`

| job_id (PK)      | UUID       | Job ID                          |
| model_id (PK)    | UUID       | AI Modell ID                    |
| score            | DECIMAL    | Bewertung                       |
| metrics          | JSONB      | Details                         |
| created_at       | TIMESTAMPTZ| Zeitstempel                     |

---

### `earnings_forecast`

| id (PK)          | UUID       | Forecast ID                     |
| user_id          | UUID       | User                            |
| forecast_date    | DATE       | Datum                           |
| predicted_amount | DECIMAL    | Prognose                        |
| confidence_interval| JSONB    | Unsicherheitsbereich            |
| risk_score       | DECIMAL    | Risiko                          |
| created_at       | TIMESTAMPTZ| Zeitstempel                     |

---

## 2. Auth & Security

- **Supabase Auth:** Email/Passwort, keine Magic Links.
- **RLS:** Immer aktiv.
- **Policies:** User-spezifisch, keine Fremdzugriffe.

---

## 3. Geplante REST-APIs (FastAPI optional)

| Endpoint                 | Methode | Beschreibung                     |
|--------------------------|---------|---------------------------------|
| `/api/jobs`              | GET     | Liste Jobs                      |
| `/api/proposals`         | GET     | Liste Proposals                 |
| `/api/proposals`         | POST    | Proposal erstellen              |
| `/api/analytics`         | GET     | KPIs, Forecasts                 |
| `/api/settings`          | GET/PUT | User Settings                   |
| `/api/llm/select`        | POST    | LLM Auswahl (optional)          |

---

## 4. Frontend API Calls

- **Supabase Client:** Auth, CRUD, Echtzeit.
- **Axios/Fetch:** Für eigene Endpunkte.
- **Socket.IO:** Für Logs, Status, Echtzeit-Updates.

---

## 5. Datenmodelle (Frontend/Backend)

- **Job:** id, title, description, budget, skills, source, status.
- **Proposal:** id, job_id, content, status, submitted_at, earnings.
- **UserSettings:** Profile, JobPrefs, AISettings, Platform, System.
- **Forecast:** Date, predicted, confidence, risk.

---

## 6. Security Notes

- **Keine API Keys im Code.**  
- **RLS & Policies strikt.**  
- **Budget Limits enforced.**
