"use client";

import { useEffect, useState } from "react";

import { getUserAreas } from "@/lib/apis/rw";
import { AsyncStatus, RWAPIArea } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";

import LoadingScreen from "@/app/(components)/(other)/LoadingScreen";
import AreasTable from "@/app/(components)/aoi/AreasTable";
import AreasMap from "@/app/(components)/aoi/AreasMap";

const AOI = () => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [userAreas, setUserAreas] = useState<RWAPIArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<RWAPIArea | null>(null);

  useEffect(() => {
    const startGetUserAreas = async () => {
      setAsyncStatus({
        status: "loading",
        message: "Reticulating splines...",
      });
      const res = await getUserAreas({ withGeometry: true });
      const areasAll = res.data as RWAPIArea[];
      const areas = areasAll.filter((area) => !!area.geostore);

      if (areas) {
        setAsyncStatus({
          status: "success",
          message: "Loaded user areas",
        });
        setUserAreas(areas);
      } else {
        setAsyncStatus({
          status: "error",
          message: "Failed to load areas, please try reloading the page.",
        });
      }
    };
    startGetUserAreas();
  }, []);

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  return (
    <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-2 h-[calc(100vh-50px)] md:h-[calc(100vh-90px)]">
      <div className="p-4 sm:row-span-2 overflow-auto">
        {asyncStatus.status === "loading" && (
          <LoadingScreen stack={3} header={false} />
        )}
        {asyncStatus.status === "error" && <p>{asyncStatus.message}</p>}
        {asyncStatus.status === "success" && (
          <AreasTable
            userAreas={userAreas}
            setSelectedArea={setSelectedArea}
            selectedArea={selectedArea}
          />
        )}
      </div>
      <div className="sm:row-span-2">
        <AreasMap
          setTheMap={setTheMap}
          userAreas={userAreas}
          selectedArea={selectedArea}
        />
      </div>
    </div>
  );
};

export default AOI;
