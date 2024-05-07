"use client";

import { useState } from "react";
import { Map } from "react-map-gl";
import { MB_KEY } from "@/lib/keys";

import DeckGLOverlay from "@/app/components/map/DeckGLOverlay";
import { createDecodedLayer } from "@/lib/createDecodedLayer";

interface RasterLayerProps {}

const RasterLayer = ({}: RasterLayerProps) => {
  const [mapState, setMapState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
  });

  const [layerParams, setLayerParams] = useState({
    startYear: 2001,
    endYear: 2023,
  });

  const umd_tree_cover_loss = createDecodedLayer({
    id: "umd_tree_cover_loss",
    data: "https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.11/tcd_30/{z}/{x}/{y}.png",
    maxZoom: 12,
    minZoom: 0,
    zoom: mapState.zoom,
    zoomOffset: 1,
    uniformVariables: [
      { name: "zoom", type: "float", value: mapState.zoom },
      { name: "startYear", type: "float", value: layerParams.startYear },
      { name: "endYear", type: "float", value: layerParams.endYear },
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
      {...mapState}
      onMove={(evt) => setMapState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MB_KEY}
      minZoom={2}
    >
      <DeckGLOverlay layers={[umd_tree_cover_loss]} />
    </Map>
  );
};

export default RasterLayer;
