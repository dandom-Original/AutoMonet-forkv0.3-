"""
Professionelle Prompt-Vorlagen für deutsche/englische Job-Proposals
"""

DE_PROMPTS = {
    "proposal": {
        "intro": "Sehr geehrter Auftraggeber,",
        "skills": "Meine besonderen Qualifikationen für dieses Projekt:",
        "approach": "Mein Lösungsansatz würde wie folgt aussehen:",
        "closing": "Über eine Rückmeldung würde ich mich sehr freuen."
    },
    "analysis": {
        "relevance": "Relevanz für mein Profil (1-10):",
        "budget": "Budgetfairness (1-10):",
        "roi": "Erwarteter ROI:"
    }
}

EN_PROMPTS = {
    "proposal": {
        "intro": "Dear Hiring Manager,",
        "skills": "My key qualifications for this project:",
        "approach": "My proposed approach would be:",
        "closing": "I look forward to your response."
    },
    "analysis": {
        "relevance": "Relevance to my profile (1-10):",
        "budget": "Budget fairness (1-10):",
        "roi": "Expected ROI:"
    }
}

def get_template(lang: str, template_type: str) -> Dict:
    """Hole lokalisiertes Prompt-Template"""
    templates = DE_PROMPTS if lang == 'de' else EN_PROMPTS
    return templates.get(template_type, {})
