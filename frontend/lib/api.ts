const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AnalysisRequest {
  polygon: number[][];
  location_name?: string;
  start_date?: string;
  end_date?: string;
}

export interface AnalysisResult {
  degradation_score: number;
  severity: string;
  confidence: number;
  primary_factors: string[];
  indicators: {
    vegetation_health: number;
    moisture_level: number;
    soil_exposure: number;
    erosion_risk: number;
  };
  date: string;
  location_name: string;
}

export interface PredictionResult {
  risk_level: string;
  risk_score: number;
  confidence: number;
  forecast: Array<{
    month: number;
    date: string;
    projected_score: number;
    confidence: number;
  }>;
  key_drivers: string[];
  prediction_date: string;
}

export interface RecommendationResult {
  recommendations: string;
  severity: string;
  primary_focus: string[];
  generated_at: string;
  confidence: number;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  async analyzeArea(data: AnalysisRequest): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseURL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    return response.json();
  }

  async getRecommendations(analysisData: any): Promise<RecommendationResult> {
    const response = await fetch(`${this.baseURL}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      throw new Error("Failed to get recommendations");
    }

    return response.json();
  }

  async getPrediction(data: AnalysisRequest): Promise<PredictionResult> {
    const response = await fetch(`${this.baseURL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Prediction failed");
    }

    return response.json();
  }

  async getTimeSeries(data: AnalysisRequest) {
    const response = await fetch(`${this.baseURL}/api/time-series`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to get time series");
    }

    return response.json();
  }

  async getLocations() {
    const response = await fetch(`${this.baseURL}/api/locations`);

    if (!response.ok) {
      throw new Error("Failed to get locations");
    }

    return response.json();
  }

  async getLocationHistory(locationId: number, limit: number = 10) {
    const response = await fetch(
      `${this.baseURL}/api/location/${locationId}/history?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to get location history");
    }

    return response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseURL}/api/health`);
    return response.json();
  }
}

export const apiClient = new APIClient();
