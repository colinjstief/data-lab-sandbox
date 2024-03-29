import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import { Checkbox } from "semantic-ui-react";

interface LandmarkProps {
  theMap: mapboxgl.Map | null;
  setTextPanel: (text: string) => void;
}

const Landmark = ({ theMap, setTextPanel }: LandmarkProps) => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  // const [isoOptions, setIsoOptions] = useState<ListItem[]>([
  //   { key: "ARG", value: "ARG", text: "Argentina" },
  // ]);
  const [filters, setFilters] = useState<{}>({
    "land-rights": true,
    identity: true,
    "indigenous-peoples": true,
    "local-communities": true,
    "recognition-status": true,
    acknowledged: true,
    documented: true,
    "not-documented": true,
    "not-acknowledged": true,
    "claim-submitted": true,
    "customary-tenure": true,
    "resource-rights": true,
    "forest-rights": true,
    "hunting-fishing-wildlife-rights": true,
    "grazing-pasture-rights": true,
    "indicative-areas": true,
  });

  const loadSources = () => {
    if (!theMap) return;
    if (theMap.getSource("wri-landmark-indicative-source")) return;

    // Landmark Indicative Lands
    theMap.addSource("wri-landmark-indicative-source", {
      type: "vector",
      tiles: [
        "https://tiles.globalforestwatch.org/landmark_indicative_lands/v202312/default/{z}/{x}/{y}.pbf",
      ],
    });
    theMap.addLayer({
      id: "wri-landmark-indicative-layer", // Layer ID
      source: "wri-landmark-indicative-source",
      "source-layer": "landmark_indicative_lands",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": 0.25,
      },
      layout: {
        visibility: "visible",
      },
    });

    // Landmark Indicative Lands (points)
    theMap.addSource("wri-landmark-indicative-points-source", {
      type: "vector",
      tiles: [
        "https://tiles.globalforestwatch.org/landmark_indicative_lands_points/v202312/default/{z}/{x}/{y}.pbf",
      ],
    });
    theMap.addLayer({
      id: "wri-landmark-indicative-points-layer", // Layer ID
      source: "wri-landmark-indicative-points-source",
      "source-layer": "landmark_indicative_lands_points",
      type: "circle",
      layout: {
        visibility: "visible",
      },
    });

    // Indigenous and community lands
    theMap.addSource("wri-landmark-indigenous-and-community-lands-source", {
      type: "vector",
      tiles: [
        "https://tiles.globalforestwatch.org/landmark_indigenous_and_community_lands/v202312/default/{z}/{x}/{y}.pbf",
      ],
    });
    theMap.addLayer({
      id: "wri-landmark-indigenous-and-community-lands-layer", // Layer ID
      source: "wri-landmark-indigenous-and-community-lands-source",
      "source-layer": "landmark_indigenous_and_community_lands",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": 0.25,
      },
      layout: {
        visibility: "visible",
      },
    });

    // Landmark community lands (pts)
    theMap.addSource(
      "wri-landmark-indigenous-and-community-lands-points-source",
      {
        type: "vector",
        tiles: [
          "https://tiles.globalforestwatch.org/landmark_indigenous_and_community_lands_points/v202312/default/{z}/{x}/{y}.pbf",
        ],
      }
    );
    theMap.addLayer({
      id: "wri-landmark-indigenous-and-community-lands-points-layer", // Layer ID
      source: "wri-landmark-indigenous-and-community-lands-points-source",
      "source-layer": "landmark_indigenous_and_community_lands_points",
      type: "circle",
      layout: {
        visibility: "visible",
      },
    });

    // LandMark Natural Resource Rights
    theMap.addSource("wri-resource-rights-source", {
      type: "vector",
      tiles: [
        "https://tiles.globalforestwatch.org/landmark_natural_resource_rights/v202312/default/{z}/{x}/{y}.pbf",
      ],
    });
    theMap.addLayer({
      id: "wri-resource-rights-layer", // Layer ID
      source: "wri-resource-rights-source",
      "source-layer": "landmark_natural_resource_rights",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": 0.25,
      },
      layout: {
        visibility: "visible",
      },
    });
  };

  const setHoverEvents = () => {
    if (!theMap) return;
    theMap.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
      const features = theMap.queryRenderedFeatures(e.point);
      if (features.length) {
        for (const feature of features) {
          if (feature.layer.id.includes("wri-")) {
            theMap.getCanvas().style.cursor = "pointer";
            // console.log("feature.properties =>", feature.properties);
            setTextPanel(feature.properties?.ethncty_1);
          }
        }
      } else {
        theMap.getCanvas().style.cursor = "";
      }
    });
  };

  const handleFilterChange = ({
    filter,
    checked,
  }: {
    filter: string;
    checked: boolean;
  }) => {
    if (checked) {
      switch (filter) {
        case "land-rights":
          setFilters({
            ...filters,
            [filter]: true,
            "indigenous-peoples": true,
            "local-communities": true,
            acknowledged: true,
            "not-acknowledged": true,
            "not-documented": true,
            documented: true,
            "claim-submitted": true,
            "customary-tenure": true,
          });
          break;

        case "indigenous-peoples":
        case "local-communities":
          setFilters({
            ...filters,
            [filter]: true,
            "land-rights": true,
          });
          break;

        case "acknowledged":
          setFilters({
            ...filters,
            [filter]: true,
            "not-documented": true,
            documented: true,
            "land-rights": true,
          });
          break;

        case "not-acknowledged":
          setFilters({
            ...filters,
            [filter]: true,
            "claim-submitted": true,
            "customary-tenure": true,
            "land-rights": true,
          });
          break;

        case "not-documented":
        case "documented":
          setFilters({
            ...filters,
            [filter]: true,
            acknowledged: true,
            "land-rights": true,
          });
          break;

        case "claim-submitted":
        case "customary-tenure":
          setFilters({
            ...filters,
            [filter]: true,
            "not-acknowledged": true,
            "recognition-status": true,
            "land-rights": true,
          });
          break;

        case "resource-rights":
          setFilters({
            ...filters,
            [filter]: true,
            "forest-rights": true,
            "hunting-fishing-wildlife-rights": true,
            "grazing-pasture-rights": true,
          });
          break;

        case "forest-rights":
        case "hunting-fishing-wildlife-rights":
        case "grazing-pasture-rights":
          setFilters({
            ...filters,
            [filter]: true,
            "resource-rights": true,
          });
          break;

        default:
          setFilters({ ...filters, [filter]: true });
          break;
      }
    } else {
      if (
        filter === "indigenous-peoples" &&
        !!!(filters as any)["local-communities"]
      ) {
        return;
      }
      if (
        filter === "local-communities" &&
        !!!(filters as any)["indigenous-peoples"]
      ) {
        return;
      }
      if (
        filter === "acknowledged" &&
        !!!(filters as any)["not-acknowledged"]
      ) {
        return;
      }
      if (
        filter === "not-acknowledged" &&
        !!!(filters as any)["acknowledged"]
      ) {
        return;
      }
      if (filter === "documented" && !!!(filters as any)["not-documented"]) {
        return;
      }
      if (filter === "not-documented" && !!!(filters as any)["documented"]) {
        return;
      }
      if (
        filter === "claim-submitted" &&
        !!!(filters as any)["customary-tenure"]
      ) {
        return;
      }
      if (
        filter === "customary-tenure" &&
        !!!(filters as any)["claim-submitted"]
      ) {
        return;
      }

      switch (filter) {
        case "land-rights":
          setFilters({
            ...filters,
            [filter]: false,
            "indigenous-peoples": false,
            "local-communities": false,
            acknowledged: false,
            documented: false,
            "not-documented": false,
            "not-acknowledged": false,
            "claim-submitted": false,
            "customary-tenure": false,
          });
          break;

        case "resource-rights":
          setFilters({
            ...filters,
            [filter]: false,
            "forest-rights": false,
            "hunting-fishing-wildlife-rights": false,
            "grazing-pasture-rights": false,
          });
          break;

        case "acknowledged":
          setFilters({
            ...filters,
            [filter]: false,
            documented: false,
            "not-documented": false,
          });
          break;

        case "not-acknowledged":
          setFilters({
            ...filters,
            [filter]: false,
            "claim-submitted": false,
            "customary-tenure": false,
          });
          break;

        default:
          setFilters({ ...filters, [filter]: false });
          break;
      }
    }
  };

  /////////////////////
  //// On Map Load ////
  /////////////////////
  useEffect(() => {
    if (!theMap || mapLoaded) return;
    loadSources(); // Layers
    setHoverEvents(); // Set mouse hover events
    setMapLoaded(true); // Don't repeat these init steps
  }, [theMap]);

  useEffect(() => {
    if (!theMap) return;

    if ((filters as { [key: string]: boolean })["land-rights"] === true) {
      theMap.setLayoutProperty(
        "wri-landmark-indigenous-and-community-lands-layer",
        "visibility",
        "visible"
      );
      theMap.setLayoutProperty(
        "wri-landmark-indigenous-and-community-lands-points-layer",
        "visibility",
        "visible"
      );

      let currentFilters: any[] = ["all"];
      let identityFilters: any[] = ["any"];
      let recognitionFilters: any[] = ["any"];

      if (
        (filters as { [key: string]: boolean })["indigenous-peoples"] === true
      ) {
        identityFilters.push(["==", ["get", "identity"], "Indigenous"]);
      }
      if (
        (filters as { [key: string]: boolean })["local-communities"] === true
      ) {
        identityFilters.push(["==", ["get", "identity"], "Community"]);
      }

      if (identityFilters.length > 1) {
        currentFilters.push(identityFilters);
      }

      if ((filters as { [key: string]: boolean })["documented"] === true) {
        recognitionFilters.push(["==", ["get", "doc_status"], "Documented"]);
      }
      if ((filters as { [key: string]: boolean })["not-documented"] === true) {
        recognitionFilters.push([
          "==",
          ["get", "doc_status"],
          "Not documented",
        ]);
      }

      if ((filters as { [key: string]: boolean })["claim-submitted"] === true) {
        recognitionFilters.push([
          "==",
          ["get", "doc_status"],
          "Held or used with formal land claim submitted",
        ]);
      }
      if (
        (filters as { [key: string]: boolean })["customary-tenure"] === true
      ) {
        recognitionFilters.push([
          "==",
          ["get", "doc_status"],
          "Held or used under customary tenure",
        ]);
      }

      if (recognitionFilters.length > 1) {
        currentFilters.push(recognitionFilters);
      }

      if (currentFilters.length > 1) {
        theMap.setFilter(
          "wri-landmark-indigenous-and-community-lands-layer",
          currentFilters
        );
        theMap.setFilter(
          "wri-landmark-indigenous-and-community-lands-points-layer",
          currentFilters
        );
      } else {
        theMap.setFilter("wri-landmark-indigenous-and-community-lands-layer", [
          "==",
          ["literal", false],
          true,
        ]);
        theMap.setFilter(
          "wri-landmark-indigenous-and-community-lands-points-layer",
          ["==", ["literal", false], true]
        );
      }
    } else {
      theMap.setLayoutProperty(
        "wri-landmark-indigenous-and-community-lands-layer",
        "visibility",
        "none"
      );
      theMap.setLayoutProperty(
        "wri-landmark-indigenous-and-community-lands-points-layer",
        "visibility",
        "none"
      );
      theMap.setFilter(
        "wri-landmark-indigenous-and-community-lands-layer",
        null
      );
      theMap.setFilter(
        "wri-landmark-indigenous-and-community-lands-points-layer",
        null
      );
    }

    if ((filters as { [key: string]: boolean })["resource-rights"] === true) {
      theMap.setLayoutProperty(
        "wri-resource-rights-layer",
        "visibility",
        "visible"
      );

      let currentFilters: any[] = ["any"];

      if ((filters as { [key: string]: boolean })["forest-rights"] === true) {
        currentFilters.push([
          "==",
          ["get", "nat_resrc"],
          "Community forest rights",
        ]);
      }

      if (
        (filters as { [key: string]: boolean })[
          "hunting-fishing-wildlife-rights"
        ] === true
      ) {
        currentFilters.push([
          "==",
          ["get", "nat_resrc"],
          "Community hunting/wildlife rights",
        ]);
      }

      if (
        (filters as { [key: string]: boolean })["grazing-pasture-rights"] ===
        true
      ) {
        currentFilters.push([
          "==",
          ["get", "nat_resrc"],
          "Community grazing/pasture rights",
        ]);
      }

      if (currentFilters.length > 1)
        theMap.setFilter("wri-resource-rights-layer", currentFilters);
      else {
        theMap.setFilter("wri-resource-rights-layer", [
          "==",
          ["literal", false],
          true,
        ]);
      }
    } else {
      theMap.setLayoutProperty(
        "wri-resource-rights-layer",
        "visibility",
        "none"
      );
      theMap.setFilter("wri-resource-rights-layer", null);
    }

    if ((filters as { [key: string]: boolean })["indicative-areas"] === true) {
      theMap.setLayoutProperty(
        "wri-landmark-indicative-layer",
        "visibility",
        "visible"
      );
      theMap.setLayoutProperty(
        "wri-landmark-indicative-points-layer",
        "visibility",
        "visible"
      );
    } else {
      theMap.setLayoutProperty(
        "wri-landmark-indicative-layer",
        "visibility",
        "none"
      );
      theMap.setLayoutProperty(
        "wri-landmark-indicative-points-layer",
        "visibility",
        "none"
      );
    }
  }, [filters]);

  return (
    <div className="flex flex-col">
      <div className="mb-5">
        <Checkbox
          label="Indigenous and community land rights"
          value="land-rights"
          onChange={(e, data) => {
            handleFilterChange({
              filter: "land-rights",
              checked: data.checked as boolean,
            });
          }}
          checked={filters["land-rights" as keyof typeof filters] === true}
        />
        <div className="flex flex-col my-2 pl-[25px]">
          <p>
            <i>Identity</i>
          </p>
          <div className="flex flex-col my-2 pl-[25px]">
            <Checkbox
              label="Indigenous peoples"
              value="indigenous-peoples"
              onChange={(e, data) => {
                handleFilterChange({
                  filter: "indigenous-peoples",
                  checked: data.checked as boolean,
                });
              }}
              checked={
                filters["indigenous-peoples" as keyof typeof filters] === true
              }
            />
            <Checkbox
              label="Local communities"
              value="local-communities"
              onChange={(e, data) => {
                handleFilterChange({
                  filter: "local-communities",
                  checked: data.checked as boolean,
                });
              }}
              checked={
                filters["local-communities" as keyof typeof filters] === true
              }
            />
          </div>
          <p>
            <i>Recognition Status</i>
          </p>
          <div className="flex flex-col my-2 pl-[25px]">
            <Checkbox
              label="Acknowledged by government"
              value="acknowledged"
              onChange={(e, data) => {
                handleFilterChange({
                  filter: "acknowledged",
                  checked: data.checked as boolean,
                });
              }}
              checked={filters["acknowledged" as keyof typeof filters] === true}
            />
            <div className="flex flex-col my-2 pl-[25px]">
              <Checkbox
                label="Documented"
                value="documented"
                onChange={(e, data) => {
                  handleFilterChange({
                    filter: "documented",
                    checked: data.checked as boolean,
                  });
                }}
                checked={filters["documented" as keyof typeof filters] === true}
              />
              <Checkbox
                label="Not documented"
                value="not-documented"
                onChange={(e, data) => {
                  handleFilterChange({
                    filter: "not-documented",
                    checked: data.checked as boolean,
                  });
                }}
                checked={
                  filters["not-documented" as keyof typeof filters] === true
                }
              />
            </div>
            <Checkbox
              label="Not acknowledged by government"
              value="not-acknowledged"
              onChange={(e, data) => {
                handleFilterChange({
                  filter: "not-acknowledged",
                  checked: data.checked as boolean,
                });
              }}
              checked={
                filters["not-acknowledged" as keyof typeof filters] === true
              }
            />
            <div className="flex flex-col my-2 pl-[25px]">
              <Checkbox
                label="Held of used with formal land claim submitted"
                value="claim-submitted"
                onChange={(e, data) => {
                  handleFilterChange({
                    filter: "claim-submitted",
                    checked: data.checked as boolean,
                  });
                }}
                checked={
                  filters["claim-submitted" as keyof typeof filters] === true
                }
              />
              <Checkbox
                label="Held of used under customary tenure"
                value="customary-tenure"
                onChange={(e, data) => {
                  handleFilterChange({
                    filter: "customary-tenure",
                    checked: data.checked as boolean,
                  });
                }}
                checked={
                  filters["customary-tenure" as keyof typeof filters] === true
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5">
        <Checkbox
          label="Indigenous and community natural resource rights"
          value="resource-rights"
          onChange={(e, data) => {
            handleFilterChange({
              filter: "resource-rights",
              checked: data.checked as boolean,
            });
          }}
          checked={filters["resource-rights" as keyof typeof filters] === true}
        />
        <div className="flex flex-col my-2 pl-[25px]">
          <Checkbox
            label="Forest Rights"
            value="forest-rights"
            onChange={(e, data) => {
              handleFilterChange({
                filter: "forest-rights",
                checked: data.checked as boolean,
              });
            }}
            checked={filters["forest-rights" as keyof typeof filters] === true}
          />
          <Checkbox
            label="Hunting/fishing/wildlife rights"
            value="hunting-fishing-wildlife-rights"
            onChange={(e, data) => {
              handleFilterChange({
                filter: "hunting-fishing-wildlife-rights",
                checked: data.checked as boolean,
              });
            }}
            checked={
              filters[
                "hunting-fishing-wildlife-rights" as keyof typeof filters
              ] === true
            }
          />
          <Checkbox
            label="Grazing/pasture rights"
            value="grazing-pasture-rights"
            onChange={(e, data) => {
              handleFilterChange({
                filter: "grazing-pasture-rights",
                checked: data.checked as boolean,
              });
            }}
            checked={
              filters["grazing-pasture-rights" as keyof typeof filters] === true
            }
          />
        </div>
      </div>
      <div className="mb-5">
        <Checkbox
          label="Indicative areas of indigenous and community land rights"
          value="indicative-areas"
          onChange={(e, data) => {
            handleFilterChange({
              filter: "indicative-areas",
              checked: data.checked as boolean,
            });
          }}
          checked={filters["indicative-areas" as keyof typeof filters] === true}
        />
      </div>
    </div>
  );
};

export default Landmark;
