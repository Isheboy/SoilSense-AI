from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import services
from services.earth_engine_service import (
    initialize_earth_engine,
    calculate_ndvi_time_series,
    calculate_degradation_indicators
)
from services.degradation_service import DegradationAnalyzer
from services.ai_service import AIRecommendationService
from services.prediction_service import PredictionService
from services.database_service import DatabaseService

app = FastAPI(
    title="SoilSense AI API",
    version="1.0.0",
    description="AI-powered soil degradation monitoring and restoration recommendations"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
degradation_analyzer = DegradationAnalyzer()
ai_service = None
prediction_service = PredictionService()
db_service = None

# Initialize Earth Engine on startup
@app.on_event("startup")
async def startup_event():
    global ai_service, db_service
    
    # Initialize Earth Engine
    ee_initialized = initialize_earth_engine()
    if ee_initialized:
        print("✓ Earth Engine initialized successfully")
    else:
        print("✗ Earth Engine initialization failed")
    
    # Initialize AI service
    try:
        ai_service = AIRecommendationService()
        print("✓ AI Recommendation Service initialized")
    except Exception as e:
        print(f"✗ AI Service initialization failed: {e}")
    
    # Initialize Database service
    try:
        db_service = DatabaseService()
        print("✓ Database Service initialized")
    except Exception as e:
        print(f"✗ Database Service initialization failed: {e}")

# Pydantic models
class AnalysisRequest(BaseModel):
    polygon: List[List[float]]
    location_name: Optional[str] = "Unnamed Location"
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class LocationData(BaseModel):
    name: str
    longitude: float
    latitude: float

@app.get("/")
async def root():
    return {
        "message": "Welcome to SoilSense AI API",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": [
            "/api/health",
            "/api/analyze",
            "/api/recommendations",
            "/api/predict",
            "/api/time-series",
            "/api/locations"
        ]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SoilSense AI",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/analyze")
async def analyze_soil_degradation(request: AnalysisRequest):
    """Analyze soil degradation for a given area"""
    try:
        # Set default date if not provided
        end_date = request.end_date or datetime.now().strftime('%Y-%m-%d')
        
        print(f"Analyzing area: {request.location_name}")
        print(f"Polygon: {request.polygon}")
        print(f"End date: {end_date}")
        
        # Calculate indicators using Earth Engine
        indicators = calculate_degradation_indicators(
            request.polygon,
            end_date
        )
        
        print(f"Indicators calculated: {indicators}")
        
        # Add erosion risk estimate (simplified)
        indicators['erosion_risk'] = 0.3
        
        # Calculate degradation score
        analysis = degradation_analyzer.calculate_score(indicators)
        analysis['date'] = end_date
        analysis['location_name'] = request.location_name
        
        # Save to database if available
        if db_service:
            try:
                # Calculate center point of polygon
                polygon_coords = request.polygon[0] if isinstance(request.polygon[0], list) else request.polygon
                lons = [float(p[0]) for p in polygon_coords if isinstance(p, (list, tuple))]
                lats = [float(p[1]) for p in polygon_coords if isinstance(p, (list, tuple))]
                location_data = {
                    'name': request.location_name,
                    'longitude': sum(lons) / len(lons),
                    'latitude': sum(lats) / len(lats)
                }
                db_service.save_analysis(location_data, analysis)
            except Exception as e:
                print(f"Database save failed: {e}")
        
        print(f"Analysis completed successfully: {analysis}")
        return analysis
        
    except Exception as e:
        import traceback
        print(f"ERROR in analyze_soil_degradation: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/recommendations")
async def get_recommendations(analysis_data: Dict):
    """Get AI-powered restoration recommendations"""
    try:
        if not ai_service:
            raise HTTPException(
                status_code=503,
                detail="AI service not available. Check ANTHROPIC_API_KEY."
            )
        
        recommendations = ai_service.generate_recommendations(analysis_data)
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation generation failed: {str(e)}")

@app.post("/api/predict")
async def predict_degradation(request: AnalysisRequest):
    """Predict future degradation risk"""
    try:
        # Get historical data
        end_date = request.end_date or datetime.now().strftime('%Y-%m-%d')
        start_date = request.start_date or (
            datetime.now() - timedelta(days=180)
        ).strftime('%Y-%m-%d')
        
        historical = calculate_ndvi_time_series(
            request.polygon,
            start_date,
            end_date
        )
        
        # Get current indicators
        current = calculate_degradation_indicators(
            request.polygon,
            end_date
        )
        current['erosion_risk'] = 0.3
        current['degradation_score'] = degradation_analyzer.calculate_score(current)['degradation_score']
        
        # Make prediction
        prediction = prediction_service.predict_degradation_risk(
            historical,
            current
        )
        
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/time-series")
async def get_time_series(request: AnalysisRequest):
    """Get NDVI time series for an area"""
    try:
        end_date = request.end_date or datetime.now().strftime('%Y-%m-%d')
        start_date = request.start_date or (
            datetime.now() - timedelta(days=365)
        ).strftime('%Y-%m-%d')
        
        time_series = calculate_ndvi_time_series(
            request.polygon,
            start_date,
            end_date
        )
        
        return {
            'location': request.location_name,
            'start_date': start_date,
            'end_date': end_date,
            'data': time_series
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Time series calculation failed: {str(e)}")

@app.get("/api/locations")
async def get_locations():
    """Get all monitored locations"""
    try:
        if not db_service:
            return {"locations": [], "note": "Database service not available"}
        
        locations = db_service.get_all_locations()
        return {"locations": locations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch locations: {str(e)}")

@app.get("/api/location/{location_id}/history")
async def get_location_history(location_id: int, limit: int = 10):
    """Get analysis history for a location"""
    try:
        if not db_service:
            return {"history": [], "note": "Database service not available"}
        
        history = db_service.get_location_history(location_id, limit)
        return {"location_id": location_id, "history": history}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")