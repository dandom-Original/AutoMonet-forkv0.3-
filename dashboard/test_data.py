from datetime import datetime, timedelta
import random
from typing import List
from .app import Job, Proposal, EnhancedDataManager

PLATFORMS = ['Upwork', 'Freelancer', 'Toptal', 'Fiverr', 'PeoplePerHour']
SKILLS = ['Python', 'JavaScript', 'React', 'Django', 'Flask', 'Data Analysis']

def generate_job(i: int) -> Job:
    days_ago = random.randint(0, 30)
    return Job(
        id=f'job_{i}',
        title=f'Senior {random.choice(SKILLS)} Developer',
        platform=random.choice(PLATFORMS),
        budget=random.randint(500, 5000),
        currency='USD',
        description=f'We need an experienced {random.choice(SKILLS)} developer for a 3-month project...',
        posted_at=(datetime.now() - timedelta(days=days_ago)).isoformat(),
        relevance=random.uniform(0.5, 0.95),
        status=random.choice(['new', 'analyzed', 'applied', 'rejected'])
    )

def generate_proposal(job_id: str) -> Proposal:
    days_ago = random.randint(0, 14)
    status = random.choice(['submitted', 'accepted', 'rejected'])
    return Proposal(
        id=f'prop_{random.randint(1000, 9999)}',
        job_id=job_id,
        content=f'Dear Hiring Manager,\n\nI am excited to apply for this position...',
        submitted_at=(datetime.now() - timedelta(days=days_ago)).isoformat(),
        status=status,
        earnings=random.randint(500, 5000) if status == 'accepted' else None
    )

def load_test_data(manager: EnhancedDataManager):
    jobs = [generate_job(i) for i in range(1, 50)]
    for job in jobs:
        manager.add_job(asdict(job))
        if job.status in ['applied', 'accepted', 'rejected']:
            manager.add_proposal(asdict(generate_proposal(job.id)))
