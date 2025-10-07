from typing import Dict, List

class DegradationAnalyzer:
    """Analyzes soil degradation from multiple indicators"""
    
    def calculate_score(self, indicators: Dict) -> Dict:
        """Calculate composite degradation score
        
        Args:
            indicators: Dict with ndvi, ndmi, bare_soil_index, erosion_risk
        
        Returns:
            Dict with degradation score, severity, and breakdown
        """
        ndvi = indicators.get('ndvi', 0.5)
        ndmi = indicators.get('ndmi', 0.3)
        bsi = indicators.get('bare_soil_index', 0.2)
        erosion_risk = indicators.get('erosion_risk', 0.3)
        
        # Convert to degradation signals (0 = healthy, 1 = degraded)
        ndvi_signal = max(0, (0.6 - ndvi) / 0.6)
        ndmi_signal = max(0, (0.4 - ndmi) / 0.4)
        bsi_signal = min(1, bsi * 2)
        erosion_signal = erosion_risk
        
        # Weighted composite score
        weights = {
            'vegetation': 0.30,
            'moisture': 0.25,
            'soil_exposure': 0.25,
            'erosion': 0.20
        }
        
        composite_score = (
            ndvi_signal * weights['vegetation'] +
            ndmi_signal * weights['moisture'] +
            bsi_signal * weights['soil_exposure'] +
            erosion_signal * weights['erosion']
        ) * 100
        
        severity = self._classify_severity(composite_score)
        primary_factors = self._identify_factors(
            ndvi_signal, ndmi_signal, bsi_signal, erosion_signal
        )
        
        return {
            'degradation_score': round(composite_score, 2),
            'severity': severity,
            'confidence': 0.85,
            'primary_factors': primary_factors,
            'indicators': {
                'vegetation_health': round((1 - ndvi_signal) * 100, 1),
                'moisture_level': round((1 - ndmi_signal) * 100, 1),
                'soil_exposure': round(bsi_signal * 100, 1),
                'erosion_risk': round(erosion_signal * 100, 1)
            }
        }
    
    def _classify_severity(self, score: float) -> str:
        if score < 25:
            return 'Healthy'
        elif score < 50:
            return 'At Risk'
        elif score < 75:
            return 'Degraded'
        else:
            return 'Severely Degraded'
    
    def _identify_factors(self, ndvi_s, ndmi_s, bsi_s, erosion_s) -> List[str]:
        factors = []
        signals = {
            'Low vegetation cover': ndvi_s,
            'Soil moisture deficit': ndmi_s,
            'High bare soil exposure': bsi_s,
            'Erosion risk': erosion_s
        }
        
        sorted_factors = sorted(signals.items(), key=lambda x: x[1], reverse=True)
        return [factor[0] for factor in sorted_factors[:2] if factor[1] > 0.3]
