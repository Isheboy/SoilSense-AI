import ee  # type: ignore
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any

# Initialize Earth Engine (requires authentication)
# Run: earthengine authenticate

def initialize_earth_engine() -> bool:
    """Initialize Earth Engine API"""
    try:
        project_id = os.getenv("EARTHENGINE_PROJECT")
        if project_id:
            ee.Initialize(project=project_id)  # type: ignore
        else:
            ee.Initialize()  # type: ignore
        return True
    except Exception as e:
        print(f"Earth Engine initialization failed: {e}")
        return False

def calculate_ndvi_time_series(polygon: List[List[float]], start_date: str, end_date: str) -> List[Dict]:
    """Calculate NDVI time series for a given polygon using Sentinel-2
    
    Args:
        polygon: List of [lon, lat] coordinates
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
    
    Returns:
        List of dicts with date and ndvi values
    """
    aoi = ee.Geometry.Polygon(polygon)  # type: ignore
    
    # Use the updated Sentinel-2 Harmonized collection
    collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')  # type: ignore
                  .filterBounds(aoi)  # type: ignore
                  .filterDate(start_date, end_date)  # type: ignore
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)))  # type: ignore
    
    def compute_ndvi(image):
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        return image.addBands(ndvi)
    
    ndvi_collection = collection.map(compute_ndvi)
    
    def extract_ndvi(image):
        stats = image.select('NDVI').reduceRegion(  # type: ignore
            reducer=ee.Reducer.mean(),  # type: ignore
            geometry=aoi,
            scale=10,
            maxPixels=int(1e9)
        )
        return ee.Feature(None, {  # type: ignore
            'date': image.date().format('YYYY-MM-dd'),  # type: ignore
            'ndvi': stats.get('NDVI')  # type: ignore
        })
    
    ndvi_time_series = ndvi_collection.map(extract_ndvi)
    result = ndvi_time_series.getInfo()
    return result.get('features', []) if result else []

def calculate_degradation_indicators(polygon: List[List[float]], date: str) -> Dict:
    """Calculate multiple soil health indicators for a given date
    
    Args:
        polygon: List of [lon, lat] coordinates
        date: Date in YYYY-MM-DD format
    
    Returns:
        Dictionary with NDVI, NDMI, and BSI values
    """
    aoi = ee.Geometry.Polygon(polygon)  # type: ignore
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    
    # Use the updated Sentinel-2 Harmonized collection
    image = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')  # type: ignore
             .filterBounds(aoi)  # type: ignore
             .filterDate(date_obj - timedelta(days=30), date_obj)  # type: ignore
             .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))  # type: ignore
             .sort('CLOUDY_PIXEL_PERCENTAGE')  # type: ignore
             .first())  # type: ignore
    
    # Check if we have valid imagery
    image_info = image.getInfo()  # type: ignore
    if image_info is None:
        print(f"WARNING: No satellite imagery available for this area and date range")
        return {
            'ndvi': 0.5,
            'ndmi': 0.3,
            'bare_soil_index': 0.2
        }
    
    # Calculate indices
    ndvi = image.normalizedDifference(['B8', 'B4'])
    ndmi = image.normalizedDifference(['B8', 'B11'])
    bsi = image.expression(
        '((RED + SWIR) - (NIR + BLUE)) / ((RED + SWIR) + (NIR + BLUE))',
        {
            'RED': image.select('B4'),
            'BLUE': image.select('B2'),
            'NIR': image.select('B8'),
            'SWIR': image.select('B11')
        }
    )
    
    stats = ee.Image.cat([ndvi, ndmi, bsi]).reduceRegion(  # type: ignore
        reducer=ee.Reducer.mean(),  # type: ignore
        geometry=aoi,
        scale=10,
        maxPixels=int(1e9)
    )
    
    result = stats.getInfo()  # type: ignore
    if result:
        return {
            'ndvi': result.get('nd', 0.5),
            'ndmi': result.get('nd_1', 0.3),
            'bare_soil_index': result.get('constant', 0.2)
        }
    return {
        'ndvi': 0.5,
        'ndmi': 0.3,
        'bare_soil_index': 0.2
    }
