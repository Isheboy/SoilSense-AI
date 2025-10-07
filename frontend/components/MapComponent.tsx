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

    map.current.addControl(draw.current as any);

    // Handle polygon creation
    map.current.on("draw.create", (e: any) => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates[0];
        onAreaSelect(coordinates);
      }
    });

    // Handle polygon update
    map.current.on("draw.update", (e: any) => {
      const data = draw.current?.getAll();
      if (data && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates[0];
        onAreaSelect(coordinates);
      }
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
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
