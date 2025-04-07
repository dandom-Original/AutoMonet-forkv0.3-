import json
import random

class AIRouter:
  def __init__(self, config_path):
    with open(config_path, 'r') as f:
      self.config = json.load(f)
    
    self.openrouter_key = self.config.get("openrouter_api_key")
    self.openai_key = self.config.get("openai_api_key")
    self.gemini_key = self.config.get("gemini_api_key")
    self.token_budget = self.config.get("token_budget", 500)
    self.highend_threshold = self.config.get("highend_threshold", 100)
  
  def analyze_job(self, job):
    # Simulierte Analyse: Je nach Länge der Jobbeschreibung wird zwischen high-end und kosteneffizient gewählt.
    description = job.get("description", "")
    mode = "highend" if len(description) > self.highend_threshold else "costefficient"
    roi = random.uniform(0, 20)  # Simulierter ROI-Wert
    return {"roi": roi, "mode": mode}
  
  def generate_proposal(self, job, user_profile):
    # Wählt anhand der Analyse den geeigneten LLM-Modus zur Proposal-Erzeugung.
    analysis = self.analyze_job(job)
    mode = analysis.get("mode", "costefficient")
    if mode == "highend":
      return self.call_highend_llm(job, user_profile)
    else:
      return self.call_costefficient_llm(job, user_profile)
  
  def call_highend_llm(self, job, user_profile):
    # Simulierter Aufruf eines High-End-LLMs (z. B. Gemini, Sonnet)
    return f"High-end proposal for job '{job.get('title', 'N/A')}' tailored for {user_profile.get('name', '')}."
  
  def call_costefficient_llm(self, job, user_profile):
    # Simulierter Aufruf eines kosten-effizienten LLM-Modells (z. B. OpenRouter)
    return f"Cost-efficient proposal for job '{job.get('title', 'N/A')}' tailored for {user_profile.get('name', '')}."

# Exponiere AIRouter für den Import in anderen Modulen.
