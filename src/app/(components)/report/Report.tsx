"use client";

import { useEffect, useState, useRef } from "react";

import MapboxGLMap from "@/app/(components)/(map)/MapboxGLMap";
import { AsyncStatus } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";

const Report = () => {
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });

  useEffect(() => {
    if (!theMap || mapLoaded) return;
    //loadSources();
    setMapLoaded(true);
  }, [theMap]);

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  return (
    <div className="grid grid-cols-1 grid-rows-4 sm:grid-cols-8 sm:grid-rows-1 h-[calc(100vh-50px)] sm:grid-rows-1 sm:h-[calc(100vh-90px)]">
      <div className="bg-slate-400 col-span-2 row-span-1 sm:row-span-1 p-5 overflow-auto">
        Controls
      </div>
      <div className="bg-slate-400 col-span-6 row-span-3 sm:row-span-1">
        <MapboxGLMap
          visible={true}
          setTheMap={setTheMap}
          basemap="light-v9"
          mapOptions={{
            zoom: 2,
          }}
        />
      </div>
    </div>
  );
};

export default Report;
