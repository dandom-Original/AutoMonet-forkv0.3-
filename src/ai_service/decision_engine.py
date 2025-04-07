"""
Enterprise-Grade AI Decision Engine für Job Matching
"""
from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Dict, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class JobCategory(Enum):
    WEB_DEV = auto()
    DATA_SCIENCE = auto()
    DESIGN = auto()
    MARKETING = auto()

@dataclass
class Skill:
    name: str
    proficiency: float  # 0-1
    years_experience: int

@dataclass
class Job:
    title: str
    description: str
    budget: float
    category: JobCategory
    required_skills: List[Skill]

class AIDecisionEngine:
    def __init__(self, profile: Dict):
        self.profile = profile
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self._init_models()

    def _init_models(self):
        """Initialisiere ML-Modelle mit Transfer Learning"""
        self.skill_matcher = SkillMatcher()
        self.budget_analyzer = BudgetAnalyzer()
        self.job_classifier = JobClassifier()

    def evaluate_job(self, job: Job) -> float:
        """
        Ganzheitliche Job-Bewertung (0-1)
        Kombiniert: 
        - Skill Match (50%)
        - Budget Score (30%) 
        - Category Fit (20%)
        """
        skill_score = self._calculate_skill_match(job)
        budget_score = self._analyze_budget(job)
        category_score = self._classify_category(job)
        
        return 0.5*skill_score + 0.3*budget_score + 0.2*category_score

    def _calculate_skill_match(self, job: Job) -> float:
        """Berechne Skill-Übereinstimmung mit TF-IDF + Cosine Similarity"""
        job_desc = job.description
        profile_skills = " ".join([s.name for s in self.profile['skills']])
        
        vectors = self.vectorizer.fit_transform([job_desc, profile_skills])
        return cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    def _analyze_budget(self, job: Job) -> float:
        """Analysiere Budget-Attraktivität basierend auf Profildaten"""
        avg_rate = self.profile['hourly_rate']
        expected_hours = len(job.description.split()) / 50  # Heuristik
        return min(job.budget / (expected_hours * avg_rate), 1.0)

    def _classify_category(self, job: Job) -> float:
        """Klassifiziere Job-Kategorie vs. Profil-Präferenzen"""
        preferred = self.profile['preferred_categories']
        return 1.0 if job.category in preferred else 0.5
