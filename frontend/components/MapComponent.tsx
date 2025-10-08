import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapComponentProps {
  onAreaSelect: (polygon: number[][]) => void;
  selectedArea: number[][] | null;
}

interface SearchResult {
  id: string;
  place_name: string;
  text: string;
  center: [number, number];
  place_type: string[];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startDrawing = () => {
    if (draw.current) {
      draw.current.changeMode("draw_polygon");
      setIsDrawing(true);
    }
  };

  const searchPlace = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${
          mapboxgl.accessToken
        }&limit=5&country=TZ,KE,UG,RW,BI&types=place,locality,neighborhood,address`
      );
      const data = await response.json();
      setSearchResults(data.features || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectPlace = (place: SearchResult) => {
    if (map.current && place.center) {
      const [lng, lat] = place.center;
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 2000,
      });

      // Add a marker at the location
      new mapboxgl.Marker({ color: "#10b981" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="p-2"><strong>${place.place_name}</strong></div>`
          )
        )
        .addTo(map.current)
        .togglePopup();

      setShowResults(false);
      setSearchQuery(place.place_name);
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

      {/* Search Bar */}
      {mapLoaded && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4">
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg shadow-xl border-2 border-green-500">
              <svg
                className="w-5 h-5 text-gray-400 ml-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for a place (e.g., Chamazi, Nairobi)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchPlace(e.target.value);
                }}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full px-4 py-3 text-gray-700 focus:outline-none rounded-r-lg"
              />
              {isSearching && (
                <div className="mr-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-40">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => selectPlace(result)}
                    className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {result.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.place_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults &&
              searchQuery &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-center text-gray-500">
                  No places found. Try another search.
                </div>
              )}
          </div>
        </div>
      )}

      {/* Large Drawing Button */}
      {mapLoaded && !selectedArea && !searchQuery && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <button
            onClick={startDrawing}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center gap-3 border-4 border-white"
          >
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <div className="text-center">
              <p className="text-2xl">Click Here to Draw Area</p>
              <p className="text-sm text-green-100 mt-1">
                Select a polygon on the map
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Drawing Instructions - Top */}
      {mapLoaded && isDrawing && !selectedArea && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg shadow-xl z-20 font-semibold text-center max-w-md">
          <p className="text-lg">
            👆 Click points on the map to draw your area
          </p>
          <p className="text-sm mt-1">
            Double-click or click the first point again to finish
          </p>
        </div>
      )}

      {/* Drawing Tools Indicator - Shows Mapbox Controls */}
      {mapLoaded && !selectedArea && !isDrawing && searchQuery && (
        <div className="absolute top-24 left-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <p className="text-sm font-bold">👈 Use polygon tool to draw area</p>
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
