import { useState, useEffect } from "react";
import Head from "next/head";
import MapComponent from "@/components/MapComponent";
import Dashboard from "@/components/Dashboard";
import { apiClient, AnalysisResult } from "@/lib/api";

export default function Home() {
  const [selectedArea, setSelectedArea] = useState<number[][] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>("checking");

  useEffect(() => {
    // Check API health
    apiClient
      .healthCheck()
      .then(() => setApiStatus("connected"))
      .catch(() => setApiStatus("disconnected"));
  }, []);

  const handleAreaSelect = async (polygon: number[][]) => {
    setSelectedArea(polygon);
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.analyzeArea({
        polygon: [polygon],
        location_name: "Selected Area",
      });
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to analyze area. Please check your backend connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedArea(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <>
      <Head>
        <title>SoilSense AI - Soil Degradation Monitoring</title>
        <meta name="description" content="AI-powered soil health monitoring" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🌍</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    SoilSense AI
                  </h1>
                  <p className="text-sm text-gray-500">
                    Intelligent Soil Health Monitoring
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apiStatus === "connected"
                      ? "bg-green-100 text-green-800"
                      : apiStatus === "disconnected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  API: {apiStatus}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Analysis Area
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Draw a polygon on the map to analyze soil health
                </p>
              </div>
              <div className="relative" style={{ height: "500px" }}>
                <MapComponent
                  onAreaSelect={handleAreaSelect}
                  selectedArea={selectedArea}
                />
                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-3 text-sm text-gray-600">
                        Analyzing area...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dashboard Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Analysis Results
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Soil health metrics and recommendations
                  </p>
                </div>
                {analysisResult && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div
                className="p-6"
                style={{ height: "500px", overflowY: "auto" }}
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                {!analysisResult && !error && !loading && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <p className="mt-2 text-sm">
                        Select an area on the map to begin analysis
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult && <Dashboard analysisData={analysisResult} />}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              📍 How to use SoilSense AI
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>
                Use the drawing tools on the map to select an area of interest
              </li>
              <li>Wait for the satellite data analysis to complete</li>
              <li>Review the degradation metrics and severity assessment</li>
              <li>Get AI-powered restoration recommendations</li>
              <li>View 6-month degradation risk predictions</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
