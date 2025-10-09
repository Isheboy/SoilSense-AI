"use client";

import React from "react";
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

interface AnalysisResult {
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

interface DashboardProps {
  analysisData: AnalysisResult;
  timeSeries?: Array<{ date: string; ndvi: number }>;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisData, timeSeries }) => {
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
    <div className="h-full overflow-y-auto bg-white">
      <div className="space-y-4 p-4">
        {/* Overall Score */}
        <div className="text-center py-4 bg-gradient-to-b from-gray-50 to-white rounded-lg">
          <div className="inline-flex flex-col items-center">
            <div
              className={`text-4xl md:text-5xl font-bold ${getScoreColor(
                analysisData.degradation_score
              )}`}
            >
              {analysisData.degradation_score.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Degradation Score</div>
            <div
              className={`mt-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getSeverityColor(
                analysisData.severity
              )}`}
            >
              {analysisData.severity}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 p-2.5 rounded-lg border border-green-200">
            <div className="text-xs text-green-700 font-medium">
              Vegetation Health
            </div>
            <div className="text-xl font-bold text-green-900 mt-0.5">
              {analysisData.indicators.vegetation_health.toFixed(1)}%
            </div>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-medium">
              Moisture Level
            </div>
            <div className="text-xl font-bold text-blue-900 mt-0.5">
              {analysisData.indicators.moisture_level.toFixed(1)}%
            </div>
          </div>
          <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-700 font-medium">
              Soil Exposure
            </div>
            <div className="text-xl font-bold text-orange-900 mt-0.5">
              {analysisData.indicators.soil_exposure.toFixed(1)}%
            </div>
          </div>
          <div className="bg-red-50 p-2.5 rounded-lg border border-red-200">
            <div className="text-xs text-red-700 font-medium">Erosion Risk</div>
            <div className="text-xl font-bold text-red-900 mt-0.5">
              {analysisData.indicators.erosion_risk.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Recommendations Section (replacing Primary Factors) */}
        {analysisData.recommendations &&
          analysisData.recommendations.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-yellow-900 mb-2">
                💡 Key Recommendations
              </h3>
              <ul className="space-y-1">
                {analysisData.recommendations
                  .slice(0, 3)
                  .map((rec: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-xs text-yellow-800 flex items-start"
                    >
                      <span className="mr-1.5 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

        {/* Radar Chart */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h3 className="text-xs font-semibold text-gray-900 mb-2">
            Soil Health Indicators
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="indicator" tick={{ fontSize: 10 }} />
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

        {/* Time Series Chart */}
        {timeSeries && timeSeries.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">
              NDVI Time Series
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis domain={[-1, 1]} tick={{ fontSize: 9 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="ndvi"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Recommendations */}
        {analysisData.recommendations &&
          analysisData.recommendations.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                <span className="mr-1.5">🤖</span>
                AI Recommendations
              </h3>
              <ul className="space-y-1.5">
                {analysisData.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-gray-700 flex items-start"
                  >
                    <span className="mr-1.5 text-green-600 mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <div className="flex justify-between">
            <span>Date: {analysisData.date}</span>
            <span>
              Confidence: {(analysisData.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
