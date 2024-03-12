import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MB_KEY } from "@/lib/keys";

import { Segment } from "semantic-ui-react";

mapboxgl.accessToken = MB_KEY;

interface TheMapProps {
  id: string;
  setTheMap: (map: any) => void;
  visible?: boolean;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  basemap?: string;
  textPanel?: string;
}

const TheMap = ({
  id,
  setTheMap,
  visible = true,
  latitude = 0,
  longitude = 0,
  zoom = 5,
  basemap = "light-v9",
  textPanel,
}: TheMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as any,
      style: `mapbox://styles/mapbox/${basemap}`,
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-left"
    );

    map.current.on("load", () => {
      setTheMap({ id, map: map.current });
    });
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.resize();
  }, [visible]);

  return (
    <div className="h-full w-full">
      {textPanel && (
        <Segment className="absolute z-10 p-3 top-5 right-5">
          {textPanel}
        </Segment>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default TheMap;
