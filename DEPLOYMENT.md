# AutoMonet – Deployment Guide

---

## 1. Build Docker Images

```bash
docker build -t automonet-backend -f Dockerfile.backend .
docker build -t automonet-frontend -f Dockerfile.frontend .
```

---

## 2. Docker Compose (Beispiel)

```yaml
version: '3.8'

services:
  backend:
    image: automonet-backend
    env_file: .env
    restart: always

  frontend:
    image: automonet-frontend
    env_file: .env
    ports:
      - "5173:5173"
    restart: always

  mlflow:
    image: mlflow/mlflow
    ports:
      - "5000:5000"
    volumes:
      - ./mlruns:/mlruns

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

---

## 3. Starten

```bash
docker compose up -d
```

---

## 4. Zugriff

- **Frontend:** http://localhost:5173  
- **Backend:** läuft im Container, automatisiert  
- **MLflow:** http://localhost:5000  
- **Prometheus:** http://localhost:9090  
- **Grafana:** http://localhost:3000

---

## 5. Hinweise

- **ENV-Variablen** in `.env` setzen.  
- **Supabase** vorher einrichten.  
- **API Keys** sicher verwalten.  
- **Budget Limits** konfigurieren.  
- **HTTPS** für Produktion aktivieren.  
- **Monitoring** anpassen.
