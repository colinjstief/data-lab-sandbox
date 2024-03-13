"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { Icon, Segment, SegmentGroup } from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";
import { Location } from "@/lib/types";
import { set } from "zod";

const Compare = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [theMaps, setTheMaps] = useState<{
    [key: string]: { id: string; theMap: mapboxgl.Map; mapLoaded: boolean };
  }>({});
  const [locations, setLocations] = useState<{ [key: string]: Location }>(
    startingLocations
  );

  useEffect(() => {
    Object.values(theMaps).forEach((map) => {
      map.theMap.resize();
    });
  }, [locations]);

  const handleAddLocation = () => {
    const id = Object.keys(locations).length + 1;
    setLocations({
      ...locations,
      [id]: {
        id: id.toString(),
        latitude: 0,
        longitude: 0,
        zoom: 1,
      },
    });
  };

  const handleMapMove = ({ mapID }: { mapID: string }) => {
    const locationID = mapID.split("-")[1];

    setTheMaps((currentMaps) => {
      const newMaps = { ...currentMaps };
      Object.keys(newMaps).forEach((key) => {
        if (key.includes(locationID) && key !== mapID) {
          newMaps[key].theMap.setCenter(newMaps[mapID].theMap.getCenter());
          newMaps[key].theMap.setZoom(newMaps[mapID].theMap.getZoom());
        }
      });
      return newMaps;
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
    setTheMaps((currentMaps) => {
      const newMaps = { ...currentMaps };
      Object.keys(newMaps).forEach((key) => {
        if (key.includes(locationID)) {
          currentMaps[key].theMap.remove();
          delete newMaps[key];
        }
      });
      return newMaps;
    });
  };

  const handleSetTheMap = ({ id, map }: { id: string; map: mapboxgl.Map }) => {
    setTheMaps((currentMaps) => {
      return {
        ...currentMaps,
        [id]: { id: id, theMap: map, mapLoaded: false },
      };
    });
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

  // Set events and layers for all maps
  useEffect(() => {
    Object.values(theMaps).forEach((map) => {
      if (map.mapLoaded) return;
      map.theMap.on("drag", () => {
        handleMapMove({ mapID: map.id });
      });
      map.theMap.on("zoomend", () => {
        handleMapMove({ mapID: map.id });
      });

      let tileURL = "";

      if (map.id.includes("umd")) {
        tileURL =
          "https://tiles.globalforestwatch.org/umd_regional_primary_forest_2001/v201901/uint16/{z}/{x}/{y}.png";
      } else if (map.id.includes("wri")) {
        tileURL =
          "https://tiles.globalforestwatch.org/wri_tropical_tree_cover/v2020/ttcd_10/{z}/{x}/{y}.png";
      } else if (map.id.includes("wcs")) {
        tileURL =
          "https://tiles.globalforestwatch.org/wcs_forest_landscape_integrity_index/v20190824/default/{z}/{x}/{y}.png";
      }

      if (tileURL === "") return;

      map.theMap.addLayer({
        id: map.id,
        type: "raster",
        source: {
          type: "raster",
          tiles: [tileURL],
          tileSize: 256,
        },
      });

      setTheMaps((currentMaps) => {
        return {
          ...currentMaps,
          [map.id]: { ...currentMaps[map.id], mapLoaded: true },
        };
      });
    });
  }, [theMaps]);

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
            <h3 className="font-bold mb-3">WRI Tropical Tree Cover</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "wri" });
            })}
          </div>
        </Segment>
        <Segment className="flex gap-5">
          <div className="w-[250px] p-3">
            <h3 className="font-bold mb-3">WCS Forest Landscape Integrity</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              aliquet dui sit amet venenatis sagittis.
            </p>
          </div>
          <div className="flex w-full gap-4">
            {Object.values(locations).map((location) => {
              return addMap({ location: location, dataset: "wcs" });
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
        disabled={Object.keys(locations).length >= 4}
      >
        <Icon name="plus" />
        <h4>New location</h4>
      </button>
    </div>
  );
};

export default Compare;

const startingLocations = {
  "1": {
    id: "1",
    latitude: 0,
    longitude: 0,
    zoom: 1,
  },
  "2": {
    id: "2",
    latitude: 0,
    longitude: 0,
    zoom: 1,
  },
};
