import time
from src.scrapers.free_scraper import scrape_all_free_sources
from src.ai_service import AIRouter
from src.utils.proposal_submitter import submit_proposal
from src.utils.budget_tracker import update_budget_tracker

def main_cycle():
  # 1. Job-Akquisition (Kostenlos)
  jobs = scrape_all_free_sources()
  
  # 2. AI-basierte Filterung
  router = AIRouter("config.json")
  filtered_jobs = [
    job for job in jobs 
    if router.analyze_job(job).get("roi", 0) > 7
  ]
  
  # 3. Proposal-Generierung (Gezielte Investition)
  for job in filtered_jobs[:5]:  # Maximal 5 pro Zyklus
    proposal = router.generate_proposal(job, {
      "name": "AI Freelancer Pro",
      "skills": ["Python", "AI", "Web Development"]
    })
    submit_proposal(job, proposal)
  
  # 4. Aktualisierung des Budget-Trackers
  update_budget_tracker()

if __name__ == "__main__":
  while True:
    main_cycle()
    time.sleep(3600 * 6)  # Wiederholung alle 6 Stunden
