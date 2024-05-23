"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Map, MapRef } from "react-map-gl";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapViewState, WebMercatorViewport } from "@deck.gl/core";

import { MB_KEY } from "@/lib/keys";
import { RWAPIArea } from "@/lib/types";
import DeckGLOverlay from "@/app/(components)/(map)/DeckGLOverlay";
import { set } from "date-fns";

interface AreasMapProps {
  setTheMap: (map: any) => void;
  userAreas: RWAPIArea[];
  selectedArea: RWAPIArea | null;
}

const AreasMap = ({ setTheMap, userAreas, selectedArea }: AreasMapProps) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: 0,
    latitude: 0,
    zoom: 3,
  });

  const userAreasLayer = new GeoJsonLayer({
    id: "user-areas",
    data: {
      type: "FeatureCollection",
      features: userAreas.map((area) => {
        return { ...area.geostore.attributes.geojson.features[0] };
      }),
    },
    filled: false,
    stroked: true,
    lineWidthMinPixels: 2,
    getLineColor: [0, 0, 0, 255],
  });

  const selectedAreaLayer = new GeoJsonLayer({
    id: "selected-area",
    data: {
      type: "FeatureCollection",
      features: selectedArea
        ? selectedArea.geostore.attributes.geojson.features
        : [],
    },
    filled: false,
    stroked: true,
    lineWidthMinPixels: 4,
    getLineColor: [105, 148, 130, 255],
  });

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    setTheMap(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedArea) return;
    const bbox = selectedArea?.geostore.attributes.bbox;
    mapRef.current.fitBounds(bbox);
  }, [selectedArea]);

  return (
    <Map
      ref={mapRef}
      initialViewState={viewState}
      onLoad={onMapLoad}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={MB_KEY}
      minZoom={2}
    >
      <DeckGLOverlay layers={[userAreasLayer, selectedAreaLayer]} />
    </Map>
  );
};

export default AreasMap;

// useEffect(() => {
//   if (selectedArea) {
//   }
// }, [selectedArea]);

// if (userAreas.length > 0 && layers.length === 0) {
//   const userAreasLayer = new GeoJsonLayer({
//     id: "user-areas",
//     data: {
//       type: "FeatureCollection",
//       features: userAreas.map((area) => {
//         return { ...area.geostore.attributes.geojson.features[0] };
//       }),
//     },
//   });
//   const selectedLayer = new GeoJsonLayer({
//     id: "selected-area",
//     data: {
//       type: "FeatureCollection",
//       features: [],
//     },
//     getFillColor: [160, 160, 160, 200],
//   });
//   setLayers([userAreasLayer, selectedLayer]);
// }
