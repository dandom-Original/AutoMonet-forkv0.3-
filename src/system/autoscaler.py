"""
Intelligenter Auto-Scaler mit:
- Kostenoptimierung
- Lastprognose
- Multi-Cloud Support
"""
import time
from typing import Dict, List
import numpy as np
from .predictive_engine import PredictiveEngine

class AutoScaler:
    def __init__(self, config: Dict):
        self.config = config
        self.metrics_window = []
        self.scaling_history = []
        self.predictor = PredictiveEngine()

    def monitor_and_scale(self) -> None:
        """Haupt-Control-Loop für Skalierung"""
        while True:
            metrics = self._collect_metrics()
            self.metrics_window.append(metrics)
            
            if len(self.metrics_window) > 5:
                self.metrics_window.pop(0)
                
            scaling_decision = self._make_scaling_decision()
            self._execute_scaling(scaling_decision)
            
            time.sleep(self.config['interval'])

    def _collect_metrics(self) -> Dict:
        """Sammle Systemmetriken von allen Komponenten"""
        return {
            'cpu': self._get_cpu_usage(),
            'memory': self._get_memory_usage(),
            'api_calls': self._get_api_throughput(),
            'cost': self._get_current_cost()
        }

    def _make_scaling_decision(self) -> Dict:
        """Treffe Skalierungsentscheidung mit Predictive Analytics"""
        forecast = self.predictor.forecast_load(self.metrics_window)
        
        # Kostenoptimierte Entscheidung
        if forecast['load'] > self.config['max_threshold']:
            return {'action': 'scale_out', 'amount': 1}
        elif forecast['load'] < self.config['min_threshold']:
            return {'action': 'scale_in', 'amount': 1}
        else:
            return {'action': 'maintain'}

    def _execute_scaling(self, decision: Dict) -> None:
        """Führe Skalierung auf Infrastrukturebene durch"""
        if decision['action'] == 'scale_out':
            self._provision_resources(decision['amount'])
        elif decision['action'] == 'scale_in':
            self._release_resources(decision['amount'])
        
        self.scaling_history.append({
            'timestamp': time.time(),
            'decision': decision
        })
