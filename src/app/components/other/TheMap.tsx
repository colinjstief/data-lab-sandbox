import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MB_KEY } from "@/lib/keys";

import { Segment } from "semantic-ui-react";

mapboxgl.accessToken = MB_KEY;

interface TheMapProps {
  setTheMap: (map: any) => void;
  visible: boolean;
  textPanel: string;
}

const TheMap = ({ setTheMap, visible, textPanel }: TheMapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as any,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [20, 10],
      zoom: 3.25,
    });
    map.current.on("load", () => {
      setTheMap(map.current);
    });
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.resize();
  }, [visible]);

  return (
    <div className="h-full">
      {textPanel && (
        <Segment className="absolute z-10 p-3 top-5 right-5">
          {textPanel}
        </Segment>
      )}
      <div ref={mapContainer} className="h-full" />
    </div>
  );
};

export default TheMap;
