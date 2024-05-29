"use client";

import { useRef, useCallback, useState } from "react";
import { Map, MapRef } from "react-map-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { MapViewState } from "@deck.gl/core";

import { MB_KEY } from "@/lib/keys";
import DeckGLOverlay from "@/app/(components)/(map)/DeckGLOverlay";
import { createDecodedLayer } from "@/lib/createDecodedLayer";

interface ReportMapProps {
  setTheMap: (map: any) => void;
}

const ReportMap = ({ setTheMap }: ReportMapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: 0,
    latitude: 0,
    zoom: 3,
  });
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const onMapLoad = useCallback(() => {
    if (!mapRef.current || mapLoaded) return;
    setTheMap(mapRef.current);
    addDrawtools();
    setMapLoaded(true);
  }, []);

  const addDrawtools = () => {
    const drawTools = new MapboxDraw({
      controls: {
        combine_features: false,
        uncombine_features: false,
      },
    });
    mapRef.current?.addControl(drawTools, "top-left");
  };

  const umd_tree_cover_loss = createDecodedLayer({
    id: "umd_tree_cover_loss",
    data: `https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.11/tcd_30/{z}/{x}/{y}.png`,
    maxZoom: 12,
    minZoom: 0,
    zoom: viewState.zoom,
    zoomOffset: 1,
    uniformVariables: [
      { name: "zoom", type: "float", value: viewState.zoom },
      { name: "startYear", type: "float", value: 2001 },
      { name: "endYear", type: "float", value: 2023 },
    ],
    shaderInjections: {
      "fs:#decl": `
        uniform float zoom;
        uniform float startYear;
        uniform float endYear;
    `,
      "fs:DECKGL_FILTER_COLOR": `
        float domainMin = 0.0;
        float domainMax = 255.0;
        float rangeMin = 0.0;
        float rangeMax = 255.0;
        float exponent = zoom < 13.0 ? 0.3 + (zoom - 3.0) / 20.0 : 1.0;
        float intensity = color.r * 255.0;

        float minPow = pow(domainMin, exponent - domainMin);
        float maxPow = pow(domainMax, exponent);
        float currentPow = pow(intensity, exponent);
        float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
        float year = 2000.0 + (color.b * 255.0);

        if (year >= startYear && year <= endYear && year >= 2001.) {
            color.a = scaleIntensity / 255.;
            color.r = 220.0 / 255.0;
            color.g = (72.0 - zoom + 102.0 - 3.0 * scaleIntensity / zoom) / 255.0;
            color.b = (33.0 - zoom + 153.0 - intensity / zoom) / 255.0;  
        } else {
            discard;
        }
    `,
    },
  });

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      onLoad={onMapLoad}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MB_KEY}
      minZoom={2}
      preserveDrawingBuffer={true}
    >
      <DeckGLOverlay layers={[umd_tree_cover_loss]} />
    </Map>
  );
};

export default ReportMap;
