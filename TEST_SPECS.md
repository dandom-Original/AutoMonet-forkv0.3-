# AutoMonet – Test-Spezifikationen (Pytest & Vitest)

---

## 1. Scraper (`src/scrapers/free_scraper.py`)

### `scrape_all_free_sources()`

- **Success:**  
  - Gibt Liste mit mindestens 1 Job zurück (Mock HTTP 200, valides HTML).  
- **Edge:**  
  - Quelle liefert leere Seite → Rückgabe: leere Liste.  
  - Teilweise ungültiges HTML → nur valide Jobs extrahiert.  
- **Failure:**  
  - HTTP Error (404, 500) → Exception gefangen, keine Jobs, Log-Eintrag.  
  - Timeout → Exception gefangen, keine Jobs.

---

## 2. AI Router (`src/ai_service/ai_router.py`)

### `analyze_job(job: dict) -> dict`

- **Success:**  
  - Gibt Dict mit `roi` (0–20) & `mode` ("highend"/"costefficient").  
- **Edge:**  
  - Leere Beschreibung → `mode` = "costefficient", `roi` im Bereich.  
  - Sehr lange Beschreibung → `mode` = "highend".  
- **Failure:**  
  - Job ohne "description" → Default-Werte, kein Crash.

### `generate_proposal(job, user_profile)`

- **Success:**  
  - Gibt String mit Proposal zurück, passend zum Modus.  
- **Edge:**  
  - User-Profile leer → trotzdem Proposal generiert.  
- **Failure:**  
  - Job dict fehlt → Exception gefangen, Fehler-String.

---

## 3. Decision Engine (`src/ai_service/decision_engine.py`)

### `evaluate_job(job: Job) -> float`

- **Success:**  
  - Score zwischen 0 und 1.  
- **Edge:**  
  - Wenig Skills-Overlap → niedriger Score.  
  - Sehr hohes Budget → Score capped bei 1.  
- **Failure:**  
  - Ungültiges Job-Objekt → Exception gefangen, Score 0.

---

## 4. LLM Router (`src/ai_service/llm_router.js`)

### `selectBestModel(taskType, tokenEstimate, forceHighQuality)`

- **Success:**  
  - Gibt Modell-ID, Provider, Cost, Fitness, TokenLimit.  
- **Edge:**  
  - Budget fast erschöpft → günstiges Modell gewählt.  
  - Force High Quality → High-End Modell trotz Kosten.  
- **Failure:**  
  - Keine Modelle verfügbar → Exception, Fallback auf local-llama3.

---

## 5. Proposal Submitter (`src/utils/proposal_submitter.py`)

### `submit_proposal(job, proposal)`

- **Success:**  
  - Gibt Bestätigung zurück, Proposal gespeichert.  
- **Edge:**  
  - Proposal leer → Warnung, kein Submit.  
- **Failure:**  
  - API Error → Exception gefangen, Retry oder Log.

---

## 6. Budget Tracker (`src/utils/budget_tracker.py`)

### `update_budget_tracker()`

- **Success:**  
  - Budget aktualisiert, keine Überschreitung.  
- **Edge:**  
  - Budget nahe Limit → Warnung ausgelöst.  
- **Failure:**  
  - Fehlerhafte Daten → Exception gefangen, keine Änderung.

---

## 7. Frontend (React, Vitest)

### Dashboard KPIs

- **Success:**  
  - Zeigt korrekte Werte (Mock Data).  
- **Edge:**  
  - API liefert leere Daten → Default-Anzeige.  
- **Failure:**  
  - API Error → Fehlermeldung sichtbar.

### Proposal Generation UI

- **Success:**  
  - Proposal wird angezeigt nach Klick.  
- **Edge:**  
  - Proposal leer → Hinweis.  
- **Failure:**  
  - API Error → Fehlermeldung.

### Settings

- **Success:**  
  - Speichern funktioniert, Daten aktualisiert.  
- **Edge:**  
  - Ungültige Eingaben → Validierungsfehler.  
- **Failure:**  
  - API Error → Fehlermeldung.

---

## 8. General

- **Coverage:**  
  - Mindestens 80% für Kernmodule.  
- **Mocking:**  
  - LLM Calls, HTTP, DB.  
- **CI:**  
  - Tests laufen bei jedem Commit.
