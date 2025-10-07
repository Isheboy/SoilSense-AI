import ee
from datetime import datetime, timedelta
from typing import Dict, List

# Initialize Earth Engine (requires authentication)
# Run: earthengine authenticate

def initialize_earth_engine():
    """Initialize Earth Engine API"""
    try:
        ee.Initialize()
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
    aoi = ee.Geometry.Polygon(polygon)
    
    collection = (ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterBounds(aoi)
                  .filterDate(start_date, end_date)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)))
    
def compute_ndvi(image):
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        return image.addBands(ndvi)
    
    ndvi_collection = collection.map(compute_ndvi)
    
def extract_ndvi(image):
        stats = image.select('NDVI').reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=aoi,
            scale=10,
            maxPixels=1e9
        )
        return ee.Feature(None, {
            'date': image.date().format('YYYY-MM-dd'),
            'ndvi': stats.get('NDVI')
        })
    
    ndvi_time_series = ndvi_collection.map(extract_ndvi)
    return ndvi_time_series.getInfo()['features']

def calculate_degradation_indicators(polygon: List[List[float]], date: str) -> Dict:
    """Calculate multiple soil health indicators for a given date
    
    Args:
        polygon: List of [lon, lat] coordinates
        date: Date in YYYY-MM-DD format
    
    Returns:
        Dictionary with NDVI, NDMI, and BSI values
    """
    aoi = ee.Geometry.Polygon(polygon)
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    
    image = (ee.ImageCollection('COPERNICUS/S2_SR')
             .filterBounds(aoi)
             .filterDate(date_obj - timedelta(days=30), date_obj)
             .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
             .sort('CLOUDY_PIXEL_PERCENTAGE')
             .first())
    
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
    
    stats = ee.Image.cat([ndvi, ndmi, bsi]).reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9
    )
    
    result = stats.getInfo()
    return {
        'ndvi': result.get('nd', 0.5),
        'ndmi': result.get('nd_1', 0.3),
        'bare_soil_index': result.get('constant', 0.2)
    }
