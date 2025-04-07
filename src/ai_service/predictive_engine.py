"""
High-Performance Predictive Engine mit:
- Zeitreihenprognose
- Markov Decision Processes
- Monte Carlo Simulation
"""
import numpy as np
import pandas as pd
from prophet import Prophet
from scipy.stats import norm
from typing import List, Dict

class PredictiveEngine:
    def __init__(self, historical_data: pd.DataFrame):
        self.data = self._preprocess_data(historical_data)
        self.models = self._init_models()

    def _preprocess_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """Data Cleansing mit Outlier Detection"""
        data = data.copy()
        # Remove outliers using IQR
        q1 = data['earnings'].quantile(0.25)
        q3 = data['earnings'].quantile(0.75)
        iqr = q3 - q1
        data = data[(data['earnings'] > (q1 - 1.5*iqr)) & 
                   (data['earnings'] < (q3 + 1.5*iqr))]
        return data

    def _init_models(self) -> Dict:
        """Initialisiere Ensemble von Prognosemodellen"""
        return {
            'prophet': Prophet(seasonality_mode='multiplicative'),
            'monte_carlo': MonteCarloSampler(),
            'markov': MarkovDecisionModel()
        }

    def forecast_earnings(self, periods: int = 30) -> Dict:
        """
        Generiere mehrstufige Prognose mit:
        - 80% Konfidenzintervall
        - Saisonalitätsanalyse
        - Risikoabschätzung
        """
        # Prophet für Trendprognose
        self.models['prophet'].fit(self.data)
        future = self.models['prophet'].make_future_dataframe(periods=periods)
        forecast = self.models['prophet'].predict(future)
        
        # Monte Carlo Simulation für Unsicherheit
        mc_results = self.models['monte_carlo'].simulate(
            self.data['earnings'].values, 
            n_simulations=1000,
            periods=periods
        )
        
        return {
            'forecast': forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']],
            'confidence_interval': {
                'lower': np.percentile(mc_results, 10),
                'upper': np.percentile(mc_results, 90)
            },
            'risk_score': self._calculate_risk(mc_results)
        }

    def _calculate_risk(self, simulations: np.ndarray) -> float:
        """Berechne Value-at-Risk (95% Confidence)"""
        return norm.ppf(0.95, loc=np.mean(simulations), scale=np.std(simulations))
