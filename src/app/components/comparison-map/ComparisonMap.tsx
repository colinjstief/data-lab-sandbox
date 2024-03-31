"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { Icon, Segment, SegmentGroup } from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";
import { Location } from "@/lib/types";

interface ComparisonMapProps {}

const ComparisonMap = ({}: ComparisonMapProps) => {
  const theMaps = useRef<{
    [key: string]: { id: string; theMap: mapboxgl.Map };
  }>({});
  const [locations, setLocations] = useState<{ [key: string]: Location }>(
    startingLocations
  );

  useEffect(() => {
    Object.values(theMaps).forEach((map) => {
      console.log("Resizing map", map);
      if (!map.theMap) return;
      map.theMap.resize();
    });
  }, [locations]);

  const handleAddLocation = () => {
    const id = Object.keys(locations).length + 1;
    setLocations((currentLocations) => {
      return {
        ...currentLocations,
        [id]: {
          id: id.toString(),
          latitude: 0,
          longitude: 0,
          zoom: 1,
        },
      };
    });
  };

  const handleMapMove = ({ mapID }: { mapID: string }) => {
    const locationID = mapID.split("-")[1];

    Object.keys(theMaps.current).forEach((key) => {
      if (key.includes(locationID) && key !== mapID) {
        theMaps.current[key].theMap.setCenter(
          theMaps.current[mapID].theMap.getCenter()
        );
        theMaps.current[key].theMap.setZoom(
          theMaps.current[mapID].theMap.getZoom()
        );
      }
    });
  };

  const handleRemoveLocationByMapId = ({ mapID }: { mapID: string }) => {
    const locationID = mapID.split("-")[1];

    // Remove this location
    setLocations((currentLocations) => {
      const newLocations = { ...currentLocations };
      delete newLocations[locationID];
      return newLocations;
    });

    // Remove maps associated with this location
    Object.keys(theMaps.current).forEach((key) => {
      if (key.includes(locationID)) {
        theMaps.current[key].theMap.remove();
        delete theMaps.current[key];
      }
    });
  };

  const handleSetTheMap = ({ id, map }: { id: string; map: mapboxgl.Map }) => {
    map.on("drag", () => {
      handleMapMove({ mapID: id });
    });
    map.on("zoomend", () => {
      handleMapMove({ mapID: id });
    });

    let tileURL = "";

    if (id.includes("umd")) {
      // Primary forest
      tileURL =
        "https://tiles.globalforestwatch.org/umd_regional_primary_forest_2001/v201901/uint16/{z}/{x}/{y}.png";
    } else if (id.includes("ttcfive")) {
      // TTC 0.5 ha
      tileURL =
        "https://tiles.globalforestwatch.org/wri_tropical_tree_cover/v2020/ttcd_10/{z}/{x}/{y}.png";
    } else if (id.includes("ttcten")) {
      // TTC 10m
      tileURL =
        "https://tiles.globalforestwatch.org/wri_trees_in_mosaic_landscapes/v20220922/tcd_40/{z}/{x}/{y}.png";
    }

    if (tileURL === "") return;

    map.addLayer({
      id,
      type: "raster",
      source: {
        type: "raster",
        tiles: [tileURL],
        tileSize: 256,
      },
    });
    theMaps.current[id] = { id, theMap: map };
  };

  const addMap = ({
    dataset,
    location,
  }: {
    dataset: string;
    location: Location;
  }) => {
    const mapID = `${dataset}-${location.id}`;
    const basemap = dataset === "" ? "satellite-v9" : "light-v9";
    return (
      <div key={mapID} className="w-full relative">
        <button
          className="absolute top-1 right-1 z-10 cursor-pointer"
          onClick={() => handleRemoveLocationByMapId({ mapID: mapID })}
        >
          <Icon name="x" />
        </button>
        <TheMap
          id={mapID}
          visible={true}
          setTheMap={handleSetTheMap}
          latitude={location.latitude}
          longitude={location.longitude}
          zoom={location.zoom}
          basemap={basemap}
        />
      </div>
    );
  };

  return (
    <div className="flex w-full h-full gap-4">
      <SegmentGroup className="w-full h-full">
        <Segment className="flex gap-5">
          <div className="w-[250px] p-3">
            <h3 className="font-bold mb-3">UMD primary tree cover</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "umd" });
            })}
          </div>
        </Segment>
        <Segment className="flex gap-5">
          <div className="w-[250px] p-3">
            <h3 className="font-bold mb-3">WRI Tropical Tree Cover (0.5 ha)</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "ttcfive" });
            })}
          </div>
        </Segment>
        <Segment className="flex gap-5">
          <div className="w-[250px] p-3">
            <h3 className="font-bold mb-3">WRI Tropical Tree Cover (10m)</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "ttcten" });
            })}
          </div>
        </Segment>
        <Segment className="flex gap-5">
          <div className="w-[250px] p-3">
            <h3 className="font-bold mb-3">The World</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "" });
            })}
          </div>
        </Segment>
      </SegmentGroup>
      <button
        className="bg-gray-200 px-5 h-full rounded-[10px] shadow hover:shadow-lg hover:bg-gray-300"
        onClick={handleAddLocation}
        disabled={Object.keys(locations).length >= 3}
      >
        <Icon name="plus" />
        <h4>New location</h4>
      </button>
    </div>
  );
};

export default ComparisonMap;

const startingLocations = {
  "1": {
    id: "1",
    latitude: 0,
    longitude: 0,
    zoom: 1,
  },
};
