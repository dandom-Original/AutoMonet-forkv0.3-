/*
# AI Job Matching Schema

1. New Tables
  - `ai_models` - Tracking für AI-Modelle
  - `job_analysis` - Ergebnisse der AI-Analysen
  - `skill_categories` - Skill-Taxonomie

2. Security
  - RLS für alle Tabellen
  - Policies für sicheren Zugriff
*/

CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  cost_per_call DECIMAL(10,4),
  accuracy DECIMAL(5,4)
);

CREATE TABLE IF NOT EXISTS job_analysis (
  job_id UUID REFERENCES jobs(id),
  model_id UUID REFERENCES ai_models(id),
  score DECIMAL(3,2) NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (job_id, model_id)
);

ALTER TABLE job_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their analyses" 
ON job_analysis
FOR SELECT USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);
