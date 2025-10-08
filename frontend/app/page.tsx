"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { apiClient, type AnalysisResult } from "@/lib/api";
import Dashboard from "@/components/Dashboard";

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

interface TimeSeriesDataPoint {
  date: string;
  ndvi: number;
}

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<number[][] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [timeSeries, setTimeSeries] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAreaSelect = async (polygon: number[][]) => {
    setSelectedArea(polygon);
    setLoading(true);
    setError(null);

    try {
      // Analyze the area
      const result = await apiClient.analyzeArea({
        polygon: polygon,
        location_name: "Selected Area",
      });
      setAnalysisResult(result);

      // Get time series data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const timeSeriesData = await apiClient.getTimeSeries(
        polygon,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      setTimeSeries(timeSeriesData);
    } catch (err) {
      setError("Failed to analyze area. Please check your backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">🌍 SoilSense AI</h1>
          <p className="text-sm text-green-100">
            AI-Powered Soil Degradation Monitoring & Analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapComponent
            onAreaSelect={handleAreaSelect}
            selectedArea={selectedArea}
          />

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-700 font-medium">
                  Analyzing soil health...
                </p>
                <p className="text-sm text-gray-500">
                  Processing satellite imagery
                </p>
              </div>
            </div>
          )}

          {/* Instructions Overlay */}
          {!selectedArea && !loading && (
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-white p-4 rounded-lg shadow-lg z-10">
              <h3 className="font-semibold text-gray-900 mb-2">
                📍 How to Use
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Draw a polygon on the map to select an area</li>
                <li>Wait for the analysis to complete</li>
                <li>View the results in the dashboard</li>
              </ol>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-red-50 border border-red-200 p-4 rounded-lg shadow-lg z-10">
              <h3 className="font-semibold text-red-900 mb-1">❌ Error</h3>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Section */}
        {analysisResult && (
          <div className="w-full md:w-96 lg:w-[28rem] border-l border-gray-200 bg-gray-50 overflow-hidden">
            <Dashboard analysisData={analysisResult} timeSeries={timeSeries} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-2 text-center text-sm">
        <p>
          SoilSense AI - Powered by Google Earth Engine, Anthropic Claude &
          Next.js
        </p>
      </footer>
    </div>
  );
}
