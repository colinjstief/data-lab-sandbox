"use client";

import { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { Segment } from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";
import Landmark from "@/app/components/vector-layer/Landmark";

interface VectorLayerProps {}

const VectorLayer = ({}: VectorLayerProps) => {
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [textPanel, setTextPanel] = useState<string>("");

  return (
    <div className="flex flex-1 h-full">
      <Segment className="w-[400px] border mb-0">
        <Landmark theMap={theMap} setTextPanel={setTextPanel} />
      </Segment>
      <Segment className="flex-1 border mt-0 ml-3">
        <TheMap
          visible={true}
          setTheMap={setTheMap}
          basemap="light-v9"
          mapOptions={{
            zoom: 1,
          }}
          textPanel={textPanel}
        />
      </Segment>
    </div>
  );
};

export default VectorLayer;
