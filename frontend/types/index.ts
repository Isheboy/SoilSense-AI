// API Response Types
export interface DegradationData {
  overall_score: number;
  severity: string;
  ndvi: number;
  ndmi: number;
  bsi: number;
  vegetation_health: string;
  moisture_status: string;
  bare_soil_percentage: number;
}

export interface AnalysisResult {
  location_id: number;
  degradation_data: DegradationData;
  recommendations: string[];
  timestamp: string;
}

export interface TimeSeriesData {
  date: string;
  ndvi: number;
  ndmi?: number;
  bsi?: number;
}

export interface PredictionResult {
  predictions: Array<{
    month: number;
    predicted_score: number;
    confidence: number;
  }>;
  trend: string;
  risk_level: string;
}

// Map Types
export interface MapboxDrawEvent {
  features: Array<{
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }>;
}
