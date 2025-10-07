import os
from typing import Dict
from anthropic import Anthropic

class AIRecommendationService:
    """Service for generating AI-powered restoration recommendations using Claude"""
    
    def __init__(self):
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        self.client = Anthropic(api_key=api_key)
    
    def generate_recommendations(self, analysis_data: Dict) -> Dict:
        """Generate personalized restoration recommendations
        
        Args:
            analysis_data: Dict containing degradation analysis results
        
        Returns:
            Dict with recommendations, interventions, and timeline
        """
        prompt = self._build_prompt(analysis_data)
        
        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.7,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Extract text from response
            response_text = ""
            if message.content and len(message.content) > 0:
                content_block = message.content[0]
                if hasattr(content_block, 'text'):
                    response_text = content_block.text  # type: ignore
                else:
                    response_text = str(content_block)
            
            return self._parse_recommendations(response_text, analysis_data)
            
        except Exception as e:
            return {
                'error': f'Failed to generate recommendations: {str(e)}',
                'fallback_recommendations': self._get_fallback_recommendations(analysis_data)
            }
    
    def _build_prompt(self, data: Dict) -> str:
        """Build the prompt for Claude"""
        severity = data.get('severity', 'Unknown')
        score = data.get('degradation_score', 0)
        factors = data.get('primary_factors', [])
        indicators = data.get('indicators', {})
        
        prompt = f"""As a soil health expert, analyze the following soil degradation data and provide specific, actionable restoration recommendations.

Soil Health Assessment:
- Degradation Severity: {severity}
- Overall Score: {score}/100
- Primary Concerns: {', '.join(factors)}

Detailed Indicators:
- Vegetation Health: {indicators.get('vegetation_health', 0)}%
- Moisture Level: {indicators.get('moisture_level', 0)}%
- Soil Exposure: {indicators.get('soil_exposure', 0)}%
- Erosion Risk: {indicators.get('erosion_risk', 0)}%

Please provide:
1. Top 3-5 specific interventions (e.g., cover cropping, terracing, mulching)
2. Recommended implementation timeline (immediate, short-term, long-term)
3. Expected outcomes and monitoring metrics
4. Estimated cost category (low, medium, high)
5. Priority ranking of interventions

Format your response as clear, numbered recommendations with practical details."""
        
        return prompt
    
    def _parse_recommendations(self, response: str, data: Dict) -> Dict:
        """Parse Claude's response into structured format"""
        return {
            'recommendations': response,
            'severity': data.get('severity', 'Unknown'),
            'primary_focus': data.get('primary_factors', []),
            'generated_at': data.get('date', None),
            'confidence': 0.85
        }
    
    def _get_fallback_recommendations(self, data: Dict) -> Dict:
        """Provide fallback recommendations if AI fails"""
        severity = data.get('severity', 'Unknown')
        factors = data.get('primary_factors', [])
        
        recommendations = {
            'Severely Degraded': [
                'Implement erosion control measures (terracing, contour farming)',
                'Plant cover crops to restore soil structure',
                'Add organic matter and compost',
                'Consider agroforestry systems'
            ],
            'Degraded': [
                'Establish cover cropping rotation',
                'Implement conservation tillage',
                'Improve irrigation efficiency',
                'Plant deep-rooted vegetation'
            ],
            'At Risk': [
                'Monitor soil moisture regularly',
                'Apply mulch to reduce evaporation',
                'Introduce crop diversity',
                'Implement nutrient management plan'
            ],
            'Healthy': [
                'Maintain current practices',
                'Continue monitoring',
                'Rotate crops seasonally',
                'Preserve vegetation cover'
            ]
        }
        
        return {
            'recommendations': recommendations.get(severity, recommendations['At Risk']),
            'factors_addressed': factors,
            'note': 'Generic recommendations provided. Connect API for personalized analysis.'
        }
