import os
from supabase import create_client, Client  # type: ignore
from typing import Dict, List, Optional, Any
from datetime import datetime

class DatabaseService:
    """Service for interacting with Supabase database"""
    
    def __init__(self):
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
        
        self.client: Client = create_client(url, key)
    
    def save_analysis(self, location_data: Dict, analysis_result: Dict) -> Dict:
        """Save analysis result to database
        
        Args:
            location_data: Dict with location name and coordinates
            analysis_result: Dict with degradation analysis results
        
        Returns:
            Dict with saved record ID
        """
        try:
            # Insert or get location
            location = self._upsert_location(location_data)
            
            # Save analysis result
            result = self.client.table('analysis_results').insert({
                'location_id': location['id'],
                'result': analysis_result,
                'created_at': datetime.now().isoformat()
            }).execute()
            
            result_id = None
            if hasattr(result, 'data') and result.data and len(result.data) > 0:  # type: ignore
                result_id = result.data[0].get('id')  # type: ignore
            
            return {
                'success': True,
                'id': result_id
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_location_history(self, location_id: int, limit: int = 10) -> List[Dict]:
        """Get analysis history for a location
        
        Args:
            location_id: ID of the location
            limit: Maximum number of records to return
        
        Returns:
            List of analysis results
        """
        try:
            result = (self.client.table('analysis_results')
                     .select('*')
                     .eq('location_id', location_id)
                     .order('created_at', desc=True)
                     .limit(limit)
                     .execute())
            
            if hasattr(result, 'data') and result.data:  # type: ignore
                return result.data  # type: ignore
            return []
            
        except Exception as e:
            return []
    
    def _upsert_location(self, location_data: Dict) -> Dict:
        """Insert or update location"""
        name = location_data.get('name', 'Unnamed Location')
        lon = location_data.get('longitude', 0)
        lat = location_data.get('latitude', 0)
        
        # Check if location exists
        existing = (self.client.table('locations')
                   .select('*')
                   .eq('name', name)
                   .execute())
        
        if hasattr(existing, 'data') and existing.data and len(existing.data) > 0:  # type: ignore
            return existing.data[0]  # type: ignore
        
        # Create new location
        result = self.client.table('locations').insert({
            'name': name,
            'geom': f'POINT({lon} {lat})'
        }).execute()
        
        if hasattr(result, 'data') and result.data and len(result.data) > 0:  # type: ignore
            return result.data[0]  # type: ignore
        return {}
    
    def get_all_locations(self) -> List[Dict]:
        """Get all monitored locations"""
        try:
            result = self.client.table('locations').select('*').execute()
            if hasattr(result, 'data') and result.data:  # type: ignore
                return result.data  # type: ignore
            return []
        except Exception as e:
            return []
