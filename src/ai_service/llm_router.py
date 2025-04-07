# ... (bestehender Code bleibt)

class LLMRouter:
    # ... (bestehender init)

    def selectBestModel(self, task_type, token_estimate, force_high_quality=False):
        # ... (bestehende Logik)
        budget = self.getBudgetStatus()
        available = min(budget['daily']['remaining'], budget['monthly']['remaining'])

        # Downgrade bei Budget-Engpass
        if available < 1.0 and not force_high_quality:
            cheaper_models = [m for m in self.models if self.models[m]['priority'] <= 1]
            for m in cheaper_models:
                est_cost = (token_estimate['input'] * self.models[m]['costPer1kTokens']['input'] / 1000 +
                            token_estimate['output'] * self.models[m]['costPer1kTokens']['output'] / 1000)
                if est_cost <= available:
                    return {
                        "modelId": m,
                        "provider": self.models[m]['provider'],
                        "estimatedCost": est_cost,
                        "fitness": 0.5,
                        "tokenLimit": self.models[m]['tokenLimit']
                    }
            # Fallback auf local
            return {
                "modelId": "local-llama3",
                "provider": "ollama",
                "estimatedCost": 0,
                "fitness": 0.3,
                "tokenLimit": 8000
            }

        # sonst bestes Modell
        return super().selectBestModel(task_type, token_estimate, force_high_quality)

    def getBudgetStatus(self):
        # Dummy Budget, ersetzen durch Supabase oder Config
        return {
            "daily": {"limit": 20, "used": 5, "remaining": 15},
            "monthly": {"limit": 300, "used": 50, "remaining": 250}
        }
