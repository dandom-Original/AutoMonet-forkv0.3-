def submit_proposal(job, proposal):
    """Simuliert das Einreichen von Proposals"""
    print(f"Bewerbung eingereicht für: {job['title']}")
    print(f"Proposal Text: {proposal[:200]}...")
    return {"status": "submitted", "job_id": job.get('id')}
