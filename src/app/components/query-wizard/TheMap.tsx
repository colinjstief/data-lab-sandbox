import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZHVuY2FucmFnZXIiLCJhIjoiY2xhd3RieXpkMDFjdDN1cWxhbnNwbG1vMiJ9.yh3R3aZ4Zk0o_hM2Fjm3cg";

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
        <span className="absolute top-25 right-25 p-10 bg-white z-10">
          {textPanel}
        </span>
      )}
      <div ref={mapContainer} className="h-full" />
    </div>
  );
};

export default TheMap;
