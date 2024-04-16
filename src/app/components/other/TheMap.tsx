import { useRef, useEffect, MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import { MB_KEY } from "@/lib/keys";

import { Segment } from "semantic-ui-react";

mapboxgl.accessToken = MB_KEY;

interface TheMapProps {
  setTheMap: (map: any) => void;
  id?: string;
  basemap?: string;
  mapOptions?: {
    center?: [number, number];
    zoom?: number;
    doubleClickZoom?: boolean;
  };

  visible?: boolean;
  textPanel?: string;
}

const TheMap = ({
  setTheMap,
  id,
  basemap = "light-v9",
  mapOptions = {
    center: [0, 0],
    zoom: 5,
    doubleClickZoom: true,
  },
  visible = true,
  textPanel,
}: TheMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as any,
      style: `mapbox://styles/mapbox/${basemap}`,
      center: mapOptions.center,
      zoom: mapOptions.zoom,
      doubleClickZoom: mapOptions.doubleClickZoom,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-left"
    );

    map.current.on("load", () => {
      if (id) {
        setTheMap({ id, map: map.current });
      } else {
        setTheMap(map.current);
      }
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
