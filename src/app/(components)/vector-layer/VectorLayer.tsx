"use client";

import { useState } from "react";
import mapboxgl from "mapbox-gl";

import MapboxGLMap from "@/app/(components)/(map)/MapboxGLMap";
import Landmark from "@/app/(components)/vector-layer/Landmark";

interface VectorLayerProps {}

const VectorLayer = ({}: VectorLayerProps) => {
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [textPanel, setTextPanel] = useState<string>("");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-10 h-[calc(100vh-50px)] sm:h-[calc(100vh-90px)]">
      <div className="h-[200px] sm:col-span-4 sm:h-auto overflow-auto p-5">
        <Landmark theMap={theMap} setTextPanel={setTextPanel} />
      </div>
      <div className="h-[calc(100vh-260px)] sm:col-span-6 sm:h-auto relative">
        <MapboxGLMap
          visible={true}
          setTheMap={setTheMap}
          basemap="light-v9"
          mapOptions={{
            zoom: 1,
          }}
          textPanel={textPanel}
        />
      </div>
    </div>
  );
};

export default VectorLayer;
