"use client";

import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import {
  Button,
  Message,
  MessageContent,
  Icon,
  Dropdown,
} from "semantic-ui-react";

import MapboxGLMap from "@/app/(components)/(map)/MapboxGLMap";

import { AsyncStatus } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";
import { wait } from "@/lib/utils";
import grid_10_40000 from "@/lib/constants/grid_10_40000";
import grid_10_100000 from "@/lib/constants/grid_10_100000";

interface TileExportProps {}

const TileExport = ({}: TileExportProps) => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });

  const [dataset, setDataset] = useState<string>(tileDatasets[0].value);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);

  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!theMap || mapLoaded) return;
    loadSources();
    setGrid();
    setHoverEvents();
    setClickEvents();
    setMapLoaded(true);
  }, [theMap]);

  useEffect(() => {
    if (theMap) {
      const grid = getGridLayer(dataset);
      setVisibleLayers([grid]);
    }
  }, [dataset]);

  const setGrid = () => {
    const grid = getGridLayer(dataset);
    setVisibleLayers([grid]);
  };

  const getGridLayer = (dataset: string) => {
    const grid = tileDatasets.find((d) => d.value === dataset)?.grid;
    const layerId = `wri-${grid}-layer`;
    return layerId;
  };

  const loadSources = () => {
    if (!theMap) return;
    if (!theMap.getSource("wri-grid_10_40000")) {
      theMap.addSource("wri-grid_10_40000", {
        type: "geojson",
        data: grid_10_40000 as FeatureCollection,
        promoteId: "tile_id",
      });
      theMap.addLayer({
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
    if (!theMap.getSource("wri-grid_10_100000")) {
      theMap.addSource("wri-grid_10_100000", {
        type: "geojson",
        data: grid_10_100000 as FeatureCollection,
        promoteId: "tile_id",
      });
      theMap.addLayer({
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
    if (!theMap) return;
    const mapLayers = theMap.getStyle().layers;
    for (const layer of mapLayers) {
      if (layer.id.includes("wri-")) {
        if (layers.includes(layer.id)) {
          theMap.setLayoutProperty(layer.id, "visibility", "visible");
        } else {
          theMap.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
    }
  };

  const setHoverEvents = () => {
    if (!theMap) return;
    theMap.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
      if (!theMap) return;
      const features = theMap.queryRenderedFeatures(e.point);
      if (features.length) {
        for (const feature of features) {
          if (feature.layer.id.includes("wri-")) {
            theMap.getCanvas().style.cursor = "pointer";
          }
        }
      } else {
        theMap.getCanvas().style.cursor = "";
      }
    });
  };

  const setClickEvents = () => {
    if (!theMap) return;
    theMap.on("click", (e) => handleMapClick(e));
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!theMap) return;
    const features = theMap.queryRenderedFeatures(e.point);
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
    if (!theMap) return;
    theMap.setFeatureState({ source, id }, { hover: highlight });
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

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-10 h-[calc(100vh-50px)] sm:h-[calc(100vh-90px)]">
      <div className="h-[200px] sm:col-span-4 sm:h-auto overflow-auto p-5">
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
              color={asyncPresets.color}
            >
              <Icon
                size="mini"
                name={asyncPresets.iconName}
                loading={asyncPresets.loading}
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
      </div>
      <div className="h-[calc(100vh-260px)] sm:col-span-6 sm:h-auto relative">
        <MapboxGLMap
          visible={true}
          setTheMap={setTheMap}
          basemap="light-v9"
          mapOptions={{
            zoom: 1,
            doubleClickZoom: false,
          }}
        />
      </div>
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
