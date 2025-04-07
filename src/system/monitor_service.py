import time
from src.utils.budget_tracker import BudgetTracker

class EnterpriseMonitor:
    def __init__(self):
        self.budget = BudgetTracker(limit=500)
        self.safety_net = 100
        
    def run(self):
        while True:
            self.check_apis()
            self.audit_transactions()
            time.sleep(300)  # 5 Min Interval

    def check_apis(self):
        # OpenRouter Status
        try:
            response = requests.get('https://openrouter.ai/api/status')
            if response.status_code != 200:
                self.trigger_alert("API_DEGRADED")
        except:
            self.trigger_alert("API_FAILURE")

    def audit_transactions(self):
        metrics = self.budget.get_metrics()
        if metrics['spent'] > (metrics['limit'] - self.safety_net):
            self.trigger_alert("BUDGET_WARNING")

if __name__ == "__main__":
    monitor = EnterpriseMonitor()
    monitor.run()
