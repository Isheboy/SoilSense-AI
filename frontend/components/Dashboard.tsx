import React, { useState, useEffect } from "react";
import { AnalysisResult, apiClient } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface DashboardProps {
  analysisData: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData }) => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [loadingPred, setLoadingPred] = useState(false);

  useEffect(() => {
    // Fetch recommendations
    setLoadingRec(true);
    apiClient
      .getRecommendations(analysisData)
      .then((data) => setRecommendations(data))
      .catch((err) => console.error("Failed to get recommendations:", err))
      .finally(() => setLoadingRec(false));
  }, [analysisData]);

  // Prepare radar chart data
  const radarData = [
    {
      indicator: "Vegetation",
      value: analysisData.indicators.vegetation_health,
      fullMark: 100,
    },
    {
      indicator: "Moisture",
      value: analysisData.indicators.moisture_level,
      fullMark: 100,
    },
    {
      indicator: "Soil Cover",
      value: 100 - analysisData.indicators.soil_exposure,
      fullMark: 100,
    },
    {
      indicator: "Stability",
      value: 100 - analysisData.indicators.erosion_risk,
      fullMark: 100,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Healthy":
        return "text-green-600 bg-green-100";
      case "At Risk":
        return "text-yellow-600 bg-yellow-100";
      case "Degraded":
        return "text-orange-600 bg-orange-100";
      case "Severely Degraded":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 25) return "text-green-600";
    if (score < 50) return "text-yellow-600";
    if (score < 75) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center">
          <div
            className={`text-5xl font-bold ${getScoreColor(
              analysisData.degradation_score
            )}`}
          >
            {analysisData.degradation_score}
          </div>
          <div className="text-sm text-gray-500 mt-1">Degradation Score</div>
          <div
            className={`mt-3 px-4 py-2 rounded-full text-sm font-semibold ${getSeverityColor(
              analysisData.severity
            )}`}
          >
            {analysisData.severity}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-xs text-green-700 font-medium">
            Vegetation Health
          </div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {analysisData.indicators.vegetation_health}%
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700 font-medium">
            Moisture Level
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {analysisData.indicators.moisture_level}%
          </div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="text-xs text-orange-700 font-medium">
            Soil Exposure
          </div>
          <div className="text-2xl font-bold text-orange-900 mt-1">
            {analysisData.indicators.soil_exposure}%
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-xs text-red-700 font-medium">Erosion Risk</div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            {analysisData.indicators.erosion_risk}%
          </div>
        </div>
      </div>

      {/* Primary Factors */}
      {analysisData.primary_factors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            🚨 Primary Concerns
          </h3>
          <ul className="space-y-1">
            {analysisData.primary_factors.map((factor, idx) => (
              <li
                key={idx}
                className="text-sm text-yellow-800 flex items-start"
              >
                <span className="mr-2">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Radar Chart */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Soil Health Indicators
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Health Score"
              dataKey="value"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          AI Recommendations
        </h3>
        {loadingRec ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : recommendations ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {recommendations.recommendations}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Recommendations unavailable. Check API connection.
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 border-t pt-3">
        <div className="flex justify-between">
          <span>Analysis Date: {analysisData.date}</span>
          <span>Confidence: {(analysisData.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
