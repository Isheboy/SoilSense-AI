import numpy as np
from typing import Dict, List
from datetime import datetime, timedelta
import pickle
import os

class PredictionService:
    """Service for predicting future soil degradation trends"""
    
    def __init__(self):
        self.model = None
        self.model_path = 'models/degradation_model.pkl'
    
    def predict_degradation_risk(self, historical_data: List[Dict], current_indicators: Dict) -> Dict:
        """Predict 6-month degradation risk
        
        Args:
            historical_data: List of historical NDVI and indicator measurements
            current_indicators: Current soil health indicators
        
        Returns:
            Dict with prediction, confidence, and risk factors
        """
        try:
            # Extract features from historical data
            features = self._extract_features(historical_data, current_indicators)
            
            # Make prediction using simple rule-based model
            # In production, this would use the trained XGBoost model
            risk_score = self._calculate_risk_score(features)
            
            # Generate forecast
            forecast = self._generate_forecast(risk_score, current_indicators)
            
            return {
                'risk_level': self._classify_risk(risk_score),
                'risk_score': round(risk_score, 2),
                'confidence': 0.78,
                'forecast': forecast,
                'key_drivers': self._identify_drivers(features),
                'prediction_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': f'Prediction failed: {str(e)}',
                'risk_level': 'Unknown',
                'risk_score': 0
            }
    
    def _extract_features(self, historical_data: List[Dict], current: Dict) -> Dict:
        """Extract features for prediction"""
        if not historical_data:
            return current
        
        # Calculate trends
        ndvi_values = [d.get('ndvi', 0.5) for d in historical_data]
        ndvi_trend = self._calculate_trend(ndvi_values)
        
        # Feature engineering
        features = {
            'current_ndvi': current.get('ndvi', 0.5),
            'ndvi_trend': ndvi_trend,
            'ndvi_volatility': np.std(ndvi_values) if ndvi_values else 0,
            'moisture': current.get('ndmi', 0.3),
            'bare_soil': current.get('bare_soil_index', 0.2),
            'erosion_risk': current.get('erosion_risk', 0.3),
            'time_since_last': len(historical_data)
        }
        
        return features
    
    def _calculate_trend(self, values: List[float]) -> float:
        """Calculate linear trend in time series"""
        if len(values) < 2:
            return 0.0
        
        x = np.arange(len(values))
        y = np.array(values)
        
        # Simple linear regression
        coeffs = np.polyfit(x, y, 1)
        return coeffs[0]  # Slope
    
    def _calculate_risk_score(self, features: Dict) -> float:
        """Calculate risk score from features"""
        # Rule-based scoring (would be replaced by ML model)
        score = 0.0
        
        # NDVI indicators
        if features['current_ndvi'] < 0.3:
            score += 30
        elif features['current_ndvi'] < 0.5:
            score += 15
        
        # Negative trend
        if features['ndvi_trend'] < -0.01:
            score += 25
        
        # High volatility
        if features['ndvi_volatility'] > 0.1:
            score += 15
        
        # Moisture stress
        if features['moisture'] < 0.2:
            score += 20
        
        # Bare soil exposure
        if features['bare_soil'] > 0.5:
            score += 20
        
        # Erosion risk
        score += features['erosion_risk'] * 25
        
        return min(100, score)
    
    def _classify_risk(self, score: float) -> str:
        """Classify risk level"""
        if score < 25:
            return 'Low'
        elif score < 50:
            return 'Medium'
        elif score < 75:
            return 'High'
        else:
            return 'Critical'
    
    def _generate_forecast(self, risk_score: float, current: Dict) -> List[Dict]:
        """Generate 6-month forecast"""
        forecast = []
        base_date = datetime.now()
        
        # Simulate degradation progression
        for month in range(1, 7):
            forecast_date = base_date + timedelta(days=30 * month)
            
            # Simple degradation model
            degradation_rate = risk_score / 100
            projected_score = min(100, current.get('degradation_score', 50) + (degradation_rate * month * 10))
            
            forecast.append({
                'month': month,
                'date': forecast_date.strftime('%Y-%m-%d'),
                'projected_score': round(projected_score, 1),
                'confidence': max(0.5, 0.9 - (month * 0.05))
            })
        
        return forecast
    
    def _identify_drivers(self, features: Dict) -> List[str]:
        """Identify key risk drivers"""
        drivers = []
        
        if features['ndvi_trend'] < -0.01:
            drivers.append('Declining vegetation health')
        
        if features['moisture'] < 0.2:
            drivers.append('Moisture stress')
        
        if features['bare_soil'] > 0.5:
            drivers.append('High soil exposure')
        
        if features['erosion_risk'] > 0.5:
            drivers.append('Erosion susceptibility')
        
        if features['ndvi_volatility'] > 0.1:
            drivers.append('Unstable vegetation cover')
        
        return drivers[:3]  # Return top 3 drivers
