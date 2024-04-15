"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import {
  Button,
  Segment,
  Message,
  MessageContent,
  Icon,
  Dropdown,
} from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";

import { AsyncStatus } from "@/lib/types";
import { asyncStatuses } from "@/lib/asyncStatuses";
import { wait } from "@/lib/utils";
import grid_10_40000 from "@/lib/grids/grid_10_40000";
import grid_10_100000 from "@/lib/grids/grid_10_100000";

interface TileExportProps {}

const TileExport = ({}: TileExportProps) => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });

  const [dataset, setDataset] = useState<string>(tileDatasets[0].value);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);

  const theMap = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (theMap.current) {
      const grid = getGridLayer(dataset);
      setVisibleLayers([grid]);
    }
  }, [dataset]);

  const handleSetTheMap = ({ map }: { map: mapboxgl.Map }) => {
    theMap.current = map;
    if (map.isStyleLoaded()) {
      initializeMap();
    } else {
      map.on("load", () => initializeMap());
    }
  };

  const initializeMap = () => {
    if (!theMap.current) return;
    addMapLayers();
    const grid = getGridLayer(dataset);
    setVisibleLayers([grid]);
    setHoverEvents();
    theMap.current.on("click", (e) => handleMapClick(e));
  };

  const getGridLayer = (dataset: string) => {
    const grid = tileDatasets.find((d) => d.value === dataset)?.grid;
    const layerId = `wri-${grid}-layer`;
    return layerId;
  };

  const addMapLayers = () => {
    if (!theMap.current) return;
    if (!theMap.current.getSource("wri-grid_10_40000")) {
      theMap.current.addSource("wri-grid_10_40000", {
        type: "geojson",
        data: grid_10_40000 as FeatureCollection,
        promoteId: "tile_id",
      });
      theMap.current.addLayer({
        id: "wri-grid_10_40000-layer",
        type: "fill",
        source: "wri-grid_10_40000",
        paint: {
          "fill-color": "#b100cd",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.75,
            0.25,
          ],
        },
        layout: {
          visibility: "none",
        },
      });
    }
    if (!theMap.current.getSource("wri-grid_10_100000")) {
      theMap.current.addSource("wri-grid_10_100000", {
        type: "geojson",
        data: grid_10_100000 as FeatureCollection,
        promoteId: "tile_id",
      });
      theMap.current.addLayer({
        id: "wri-grid_10_100000-layer",
        type: "fill",
        source: "wri-grid_10_100000",
        paint: {
          "fill-color": "#b100cd",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5,
          ],
        },
        layout: {
          visibility: "none",
        },
      });
    }
  };

  const setVisibleLayers = (layers: string[]) => {
    if (!theMap.current) return;
    const mapLayers = theMap.current.getStyle().layers;
    for (const layer of mapLayers) {
      if (layer.id.includes("wri-")) {
        if (layers.includes(layer.id)) {
          theMap.current.setLayoutProperty(layer.id, "visibility", "visible");
        } else {
          theMap.current.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
    }
  };

  const setHoverEvents = () => {
    if (!theMap.current) return;
    theMap.current.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
      if (!theMap.current) return;
      const features = theMap.current.queryRenderedFeatures(e.point);
      if (features.length) {
        for (const feature of features) {
          if (feature.layer.id.includes("wri-")) {
            theMap.current.getCanvas().style.cursor = "pointer";
          }
        }
      } else {
        theMap.current.getCanvas().style.cursor = "";
      }
    });
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!theMap.current) return;
    const features = theMap.current.queryRenderedFeatures(e.point);
    if (features.length) {
      for (const feature of features) {
        if (feature.layer.id.includes("wri-")) {
          const tileId = feature.properties?.tile_id;
          if (tileId) {
            const grid = getGridLayer(dataset).replace("-layer", "");
            setSelectedTiles((currentlySelected) => {
              if (currentlySelected.includes(tileId)) {
                toggleHighlight({ source: grid, id: tileId, highlight: false });
                return currentlySelected.filter((tile) => tile !== tileId);
              } else {
                toggleHighlight({ source: grid, id: tileId, highlight: true });
                return [...currentlySelected, tileId];
              }
            });
          }
        }
      }
    }
  };

  const toggleHighlight = ({
    source,
    id,
    highlight,
  }: {
    source: string;
    id: string | number;
    highlight: boolean;
  }) => {
    if (!theMap.current) return;
    theMap.current.setFeatureState({ source, id }, { hover: highlight });
  };

  const fetchZip = async () => {
    setAsyncStatus((oldState) => {
      return { status: "loading", message: "Reticulating splines..." };
    });
    try {
      // const zip = await fetch("/api/zipTiles", {
      //   method: "POST",
      //   body: JSON.stringify({ dataset, selectedTiles }),
      // });

      throw new Error("Not implemented");

      setAsyncStatus((oldState) => {
        return { status: "success", message: "Zip file delivered." };
      });
      await wait(2000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    } catch (error) {
      setAsyncStatus((oldState) => {
        return {
          status: "error",
          message:
            "Sorry this doesn't work yet! But if you know how to receive and zip a bunch of .tiff files on a server then pass it to the client, let's talk!",
        };
      });
      await wait(5000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  const currentAsyncStatus =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  return (
    <div className="flex w-full h-full gap-3">
      <Segment className="w-[350px] flex flex-col m-0 space-between">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-bold">Dataset</h2>
              <Dropdown
                fluid
                selection
                options={tileDatasets}
                value={dataset}
                onChange={(e, selection) => {
                  setDataset(selection.value as string);
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-bold">Tiles to download</h2>
              <div className="flex flex-wrap gap-2 overflow-auto max-h-[50vh] pb-3">
                {selectedTiles.length > 0 ? (
                  selectedTiles.map((tile) => {
                    return (
                      <div
                        key={tile}
                        className="px-3 py-2 border border-gray-400"
                      >
                        {tile}
                      </div>
                    );
                  })
                ) : (
                  <p>Select one or more tiles on the map.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {asyncStatus.status && (
            <Message
              data-component="chatAsync"
              icon
              size="mini"
              color={currentAsyncStatus.color}
            >
              <Icon
                size="mini"
                name={currentAsyncStatus.iconName}
                loading={currentAsyncStatus.loading}
              />
              <MessageContent>{asyncStatus.message}</MessageContent>
            </Message>
          )}
          <Button
            icon="cog"
            labelPosition="left"
            content="Generate zip file"
            onClick={fetchZip}
            disabled={
              asyncStatus.status === "loading" || selectedTiles.length === 0
            }
          />
        </div>
      </Segment>
      <Segment className="flex-1 m-0">
        <TheMap
          id="TileExportMap"
          visible={true}
          setTheMap={handleSetTheMap}
          basemap="light-v9"
          zoom={1}
          doubleClickZoom={false}
        />
      </Segment>
    </div>
  );
};

export default TileExport;

const tileDatasets = [
  {
    key: "gfw_forest_carbon_gross_removals_ha",
    value: "gfw_forest_carbon_gross_removals_ha",
    text: "gfw_forest_carbon_gross_removals (ha)",
    version: "v20230407",
    grid: "grid_10_40000",
  },
  {
    key: "gfw_forest_carbon_gross_removals_px",
    value: "gfw_forest_carbon_gross_removals_px",
    text: "gfw_forest_carbon_gross_removals (px)",
    version: "v20230407",
    grid: "grid_10_40000",
  },
];
