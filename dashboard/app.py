# [Vorheriger Code bleibt bestehen...]

class EnhancedDataManager:
    # [Existierende Methoden...]

    def get_dashboard_data(self) -> Dict:
        jobs = list(self.jobs.values())
        recent_jobs = sorted(
            jobs, 
            key=lambda x: x.posted_at, 
            reverse=True
        )[:5]
        
        return {
            'jobs': {
                'total': len(self.jobs),
                'new': sum(1 for j in jobs if j.status == 'new'),
                'applied': sum(1 for j in jobs if j.status == 'applied')
            },
            'proposals': {
                'total': len(self.proposals),
                'submitted': sum(1 for p in self.proposals.values() 
                               if p.status == 'submitted'),
                'accepted': sum(1 for p in self.proposals.values() 
                               if p.status == 'accepted')
            },
            'earnings': self.analytics['earnings'],
            'recentJobs': [asdict(j) for j in recent_jobs],
            'updated_at': datetime.now().isoformat()
        }
