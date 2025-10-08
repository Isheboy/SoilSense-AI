import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapComponentProps {
  onAreaSelect: (polygon: number[][]) => void;
  selectedArea: number[][] | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onAreaSelect,
  selectedArea,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = () => {
    if (draw.current) {
      draw.current.changeMode('draw_polygon');
      setIsDrawing(true);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [36.8219, -1.2921], // Nairobi, Kenya
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize drawing tools
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });

    map.current.addControl(draw.current);

    // Handle polygon creation
    map.current.on("draw.create", () => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry.type === "Polygon") {
          const coordinates = feature.geometry.coordinates[0];
          onAreaSelect(coordinates);
        }
      }
    });

    // Handle polygon update
    map.current.on("draw.update", () => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const feature = data.features[0];
        if (feature.geometry.type === "Polygon") {
          const coordinates = feature.geometry.coordinates[0];
          onAreaSelect(coordinates);
        }
      }
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear drawing when selectedArea is null
  useEffect(() => {
    if (selectedArea === null && draw.current) {
      draw.current.deleteAll();
    }
  }, [selectedArea]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Large Drawing Button */}
      {mapLoaded && !selectedArea && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <button
            onClick={startDrawing}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center gap-3 border-4 border-white"
          >
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <div className="text-center">
              <p className="text-2xl">Click Here to Draw Area</p>
              <p className="text-sm text-green-100 mt-1">Select a polygon on the map</p>
            </div>
          </button>
        </div>
      )}

      {/* Drawing Instructions - Top */}
      {mapLoaded && isDrawing && !selectedArea && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg shadow-xl z-20 font-semibold text-center">
          <p className="text-lg">👆 Click points on the map to draw your area</p>
          <p className="text-sm mt-1">Double-click or click the first point again to finish</p>
        </div>
      )}

      {/* Drawing Tools Indicator - Shows Mapbox Controls */}
      {mapLoaded && !selectedArea && !isDrawing && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10 animate-bounce">
          <p className="text-sm font-bold">👈 Or use these tools</p>
        </div>
      )}
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
