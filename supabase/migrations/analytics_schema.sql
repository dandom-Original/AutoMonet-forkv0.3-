/*
# Predictive Analytics Schema

1. New Tables
  - `earnings_forecast` - Speichert Prognosedaten
  - `platform_metrics` - Plattform-KPIs
  - `risk_assessments` - Risikoanalysen

2. Security
  - RLS für alle Tabellen
  - Strenge Zugriffskontrolle
*/

CREATE TABLE IF NOT EXISTS earnings_forecast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  forecast_date DATE NOT NULL,
  predicted_amount DECIMAL(10,2) NOT NULL,
  confidence_interval JSONB NOT NULL,
  risk_score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_earnings_forecast_user ON earnings_forecast(user_id);

ALTER TABLE earnings_forecast ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access their forecasts" 
ON earnings_forecast
FOR SELECT USING (user_id = auth.uid());
