const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export interface AnalysisRequest {
  polygon: number[][];
  location_name: string;
  start_date?: string;
  end_date?: string;
}

export interface AnalysisResult {
  degradation_score: number;
  severity: string;
  indicators: {
    vegetation_health: number;
    moisture_level: number;
    soil_exposure: number;
    erosion_risk: number;
  };
  recommendations: string[];
  primary_factors: string[];
  confidence: number;
  date: string;
  location_name: string;
}

export interface PredictionResult {
  risk_level: string;
  confidence: number;
  forecast: Array<{
    month: string;
    predicted_score: number;
    confidence_interval: [number, number];
  }>;
}

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async analyzeArea(data: AnalysisRequest): Promise<AnalysisResult> {
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        start_date: data.start_date || "2023-01-01",
        end_date: data.end_date || "2023-12-31",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || "Failed to analyze area";
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getRecommendations(
    polygon: number[][],
    degradationData: DegradationData
  ): Promise<{ recommendations: string[] }> {
    const response = await fetch(`${this.baseUrl}/api/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        polygon,
        degradation_data: degradationData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get recommendations");
    }

    return response.json();
  }

  async predictRisk(polygon: number[][]): Promise<PredictionResult> {
    const response = await fetch(`${this.baseUrl}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        polygon,
        months_ahead: 6,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to predict risk");
    }

    return response.json();
  }

  async getTimeSeries(
    polygon: number[][],
    startDate: string,
    endDate: string
  ): Promise<Array<{ date: string; ndvi: number }>> {
    const response = await fetch(`${this.baseUrl}/api/time-series`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        polygon,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get time series");
    }

    const data = await response.json();
    return data.time_series;
  }
}

export const apiClient = new APIClient();
