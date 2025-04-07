# AutoMonet – Global AI Coding Assistant Rules

Diese Regeln **müssen** in jedem AI IDE (Cursor, Windsurf, Cline, Roo Code) als **globale Projektregeln** gesetzt werden, um höchste Qualität, Sicherheit & Workflow-Konformität zu gewährleisten.

---

## 1. Projekt-Kontext & Awareness

- **Lese immer `PLANNING.md` zu Beginn einer Session.**  
- **Prüfe `TASK.md` vor jedem Task.**  
- **Halte dich an Architektur, Naming, Modularisierung aus `PLANNING.md`.**

---

## 2. Code-Struktur & Modularität

- **Keine Datei >500 Zeilen.**  
- **Splitte große Dateien in Module.**  
- **Organisiere nach Feature/Verantwortung.**  
- **Verwende klare, konsistente relative Imports.**

---

## 3. Testing & Zuverlässigkeit

- **Erstelle Pytest-Tests für jede neue Funktion/Klasse.**  
- **Tests in `/tests`-Ordner, spiegeln App-Struktur.**  
- **Mindestens: 1 Success, 1 Edge, 1 Failure Case.**  
- **Mocke externe Services (LLMs, DB, APIs).**

---

## 4. Task-Management

- **Markiere erledigte Tasks sofort in `TASK.md`.**  
- **Füge neue Subtasks oder TODOs in `TASK.md` hinzu.**

---

## 5. Style & Konventionen

- **Python:** PEP8, Type Hints, Google-Style Docstrings.  
- **JS/TS:** ESLint, Prettier, TypeScript wo möglich.  
- **Pydantic für Validation.**  
- **FastAPI für APIs (optional).**  
- **SQLAlchemy/SQLModel für ORM.**

---

## 6. Dokumentation & Explainability

- **Update `README.md` bei neuen Features.**  
- **Kommentiere komplexe Logik mit `# Reason:`.**  
- **Schreibe Docstrings für jede Funktion.**

---

## 7. AI Behavior

- **Frage explizit nach, wenn Kontext fehlt.**  
- **Keine Halluzinationen – nur bekannte Libraries.**  
- **Prüfe, ob Dateien/Module existieren, bevor du sie nutzt.**  
- **Überschreibe oder lösche Code nur, wenn explizit beauftragt.**

---

## 8. Security & ENV

- **API Keys nur via ENV, niemals hardcoded.**  
- **Keine destruktiven DB-Operationen.**  
- **Supabase RLS & Policies immer aktiv.**

---

## 9. MCP Nutzung

- **Nutze MCP-Server für:**
  - Filesystem (lesen, schreiben, refaktorieren)
  - Git (commit, branch, diff)
  - Websuche (z.B. Brave)
  - Memory & Tools (Qdrant etc.)

---

## 10. Iterativer Workflow

- **Ein Task pro Message.**  
- **Nach jedem Feature: Tests & Docs aktualisieren.**  
- **Starte neue Sessions oft, um Qualität zu sichern.**

---
