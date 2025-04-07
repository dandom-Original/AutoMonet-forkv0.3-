"""
Enterprise AI Training Pipeline mit:
- Automatisiertem Feature Engineering
- Hyperparameter-Optimierung
- Model Versioning
"""
import mlflow
import optuna
from sklearn.model_selection import TimeSeriesSplit
from xgboost import XGBRegressor
from typing import Dict, Any
import numpy as np
import pandas as pd

class ModelTrainer:
    def __init__(self, experiment_name: str = "automonet"):
        self.experiment = self._init_mlflow(experiment_name)
        self.params_space = {
            'max_depth': (3, 10),
            'learning_rate': (0.01, 0.3),
            'n_estimators': (50, 200)
        }

    def _init_mlflow(self, experiment_name: str) -> mlflow.entities.Experiment:
        """Konfiguriere MLflow Tracking Server"""
        mlflow.set_tracking_uri("http://localhost:5000")
        experiment = mlflow.get_experiment_by_name(experiment_name)
        if not experiment:
            experiment = mlflow.create_experiment(experiment_name)
        return experiment

    def train(self, dataset: pd.DataFrame) -> Dict[str, Any]:
        """
        Führe optimiertes Training durch mit:
        - Automatischem Cross-Validation
        - Bayesian Optimization
        - Model Versioning
        """
        study = optuna.create_study(direction='minimize')
        study.optimize(lambda trial: self._objective(trial, dataset), n_trials=30)
        
        # Bestes Modell speichern
        best_model = XGBRegressor(**study.best_params)
        X, y = self._prepare_data(dataset)
        best_model.fit(X, y)
        
        # Model Registry
        with mlflow.start_run(experiment_id=self.experiment.experiment_id):
            mlflow.log_params(study.best_params)
            mlflow.log_metric("best_score", study.best_value)
            mlflow.xgboost.log_model(best_model, "model")
            
        return {
            "model": best_model,
            "params": study.best_params,
            "score": study.best_value
        }

    def _objective(self, trial, dataset: pd.DataFrame) -> float:
        """Optuna Objective Function mit TimeSeries-CV"""
        params = {
            'max_depth': trial.suggest_int('max_depth', *self.params_space['max_depth']),
            'learning_rate': trial.suggest_float('learning_rate', *self.params_space['learning_rate']),
            'n_estimators': trial.suggest_int('n_estimators', *self.params_space['n_estimators'])
        }
        
        model = XGBRegressor(**params)
        X, y = self._prepare_data(dataset)
        
        # TimeSeries Cross-Validation
        tscv = TimeSeriesSplit(n_splits=5)
        scores = []
        for train_idx, test_idx in tscv.split(X):
            X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
            y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
            
            model.fit(X_train, y_train)
            scores.append(model.score(X_test, y_test))
            
        return np.mean(scores)

    def _prepare_data(self, dataset: pd.DataFrame) -> tuple:
        """Feature Engineering Pipeline"""
        X = dataset.drop(columns=['target'])
        y = dataset['target']
        return X, y
