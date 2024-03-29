import { useState, useEffect } from "react";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import bbox from "@turf/bbox";
import { BBox, Geometry } from "geojson";

import { Dropdown } from "semantic-ui-react";

import { ListItem, WizardQuery } from "@/lib/types";
import { wait } from "@/lib/utils";
import { getBoundaries, getFeature } from "@/lib/mapboxAPI";

interface GADMProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  theMap: mapboxgl.Map | null;
  setTextPanel: (text: string) => void;
}

const GADM = ({ options, setOptions, theMap, setTextPanel }: GADMProps) => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isoOptions, setIsoOptions] = useState<ListItem[]>([]);
  const [adm1Options, setAdm1Options] = useState<ListItem[]>([]);
  const [adm2Options, setAdm2Options] = useState<ListItem[]>([]);
  const [iso, setIso] = useState<string>("");
  const [adm1, setAdm1] = useState<string>("");
  const [adm2, setAdm2] = useState<string>("");
  const [async, setAsync] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  const handleChange = (type: string, newValue: string) => {
    switch (type) {
      case "iso":
        setIso(newValue);
        setAdm1("");
        setAdm2("");
        break;
      case "adm1":
        setAdm1(newValue);
        setAdm2("");
        break;
      case "adm2":
        setAdm2(newValue);
        break;
      default:
        break;
    }
  };

  const loadSources = () => {
    if (!theMap) return;
    if (theMap.getSource("wri-gadm-36-adm2")) return;
    theMap.addSource("wri-gadm-36-adm2", {
      type: "vector",
      url: "mapbox://duncanrager.7tpi79u5",
    });
    theMap.addLayer({
      id: "wri-gadm-36-adm2-layer-fill",
      source: "wri-gadm-36-adm2",
      "source-layer": "gadm36_2_simple1000",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": 0.25,
      },
      layout: {
        visibility: "none",
      },
    });
    theMap.addLayer({
      id: "wri-gadm-36-adm2-layer-line",
      source: "wri-gadm-36-adm2",
      "source-layer": "gadm36_2_simple1000",
      type: "line",
      paint: {
        "line-color": "#b100cd",
        "line-width": 1,
      },
      layout: {
        visibility: "none",
      },
    });

    if (theMap.getSource("wri-gadm-36-adm1")) return;
    theMap.addSource("wri-gadm-36-adm1", {
      type: "vector",
      url: "mapbox://duncanrager.7n25po3t",
    });
    theMap.addLayer({
      id: "wri-gadm-36-adm1-layer-fill",
      source: "wri-gadm-36-adm1",
      "source-layer": "gadm36_1_simple1000",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": 0.25,
      },
      layout: {
        visibility: "none",
      },
    });
    theMap.addLayer({
      id: "wri-gadm-36-adm1-layer-line",
      source: "wri-gadm-36-adm1",
      "source-layer": "gadm36_1_simple1000",
      type: "line",
      paint: {
        "line-color": "#b100cd",
        "line-width": 1,
      },
      layout: {
        visibility: "none",
      },
    });

    if (theMap.getSource("wri-gadm-36-iso")) return;
    theMap.addSource("wri-gadm-36-iso", {
      type: "vector",
      url: "mapbox://duncanrager.175ly863",
    });
    theMap.addLayer({
      id: "wri-gadm-36-iso-layer-fill",
      source: "wri-gadm-36-iso",
      "source-layer": "gadm36_0_simple1000",
      type: "fill",
      paint: {
        "fill-color": "#b100cd",
        "fill-outline-color": "#b100cd",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.25,
        ],
      },
      layout: {
        visibility: "visible",
      },
    });
    theMap.addLayer({
      id: "wri-gadm-36-iso-layer-line",
      source: "wri-gadm-36-iso",
      "source-layer": "gadm36_0_simple1000",
      type: "line",
      paint: {
        "line-color": "#b100cd",
        "line-width": 1,
      },
      layout: {
        visibility: "visible",
      },
    });
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

  const fetchBoundaries = async (type: string, iso?: string, adm1?: string) => {
    setAsync({
      status: "Loading",
      message: "Reticulating splines...",
    });
    try {
      const boundaries = await getBoundaries({ type, iso, adm1 });

      switch (type) {
        case "iso":
          setIsoOptions(boundaries);
          break;
        case "adm1":
          setAdm1Options(boundaries);
          break;
        case "adm2":
          setAdm2Options(boundaries);
          break;
        default:
          break;
      }
      setAsync({
        status: "",
        message: "",
      });
    } catch (error) {
      setAsync({
        status: "Failed",
        message: "Failed to load boundaries",
      });
      await wait(3000);
      setAsync({
        status: "",
        message: "",
      });
    }
  };

  const fetchFeature = async (type: string, code: string) => {
    setAsync({
      status: "Loading",
      message: "Reticulating splines...",
    });
    try {
      let feature;
      switch (type) {
        case "iso":
          feature = await getFeature({
            datasetId: "clb1pyakj02jj27ny2nqfw819",
            featureId: code,
          });
          break;
        case "adm1":
          feature = await getFeature({
            datasetId: "clb1q9all211f22nz3x593p9w",
            featureId: code,
          });
          break;
        case "adm2":
          feature = await getFeature({
            datasetId: "clb1qbq1c0t2f20p4fxkrpgq9",
            featureId: code,
          });
          break;

        default:
          break;
      }
      setAsync({
        status: "",
        message: "",
      });
      return feature;
    } catch (error) {
      setAsync({
        status: "Failed",
        message: "Failed to load feature",
      });
      await wait(3000);
      setAsync({
        status: "",
        message: "",
      });
    }
  };

  const setHoverEvents = () => {
    if (!theMap) return;
    theMap.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
      const features = theMap.queryRenderedFeatures(e.point);
      if (features.length) {
        theMap.getCanvas().style.cursor = "pointer";
        for (const feature of features) {
          if (
            feature.properties &&
            feature.layer.id === "wri-gadm-36-iso-layer-fill"
          ) {
            setTextPanel(feature.properties.NAME_0);
          } else if (
            feature.properties &&
            feature.layer.id === "wri-gadm-36-adm1-layer-fill"
          ) {
            setTextPanel(feature.properties.NAME_1);
          } else if (
            feature.properties &&
            feature.layer.id === "wri-gadm-36-adm2-layer-fill"
          ) {
            setTextPanel(feature.properties.NAME_2);
          }
        }
      } else {
        theMap.getCanvas().style.cursor = "";
        setTextPanel("");
      }
    });
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (!theMap) return;
    const features = theMap.queryRenderedFeatures(e.point);
    if (features.length) {
      for (const feature of features) {
        switch (feature.layer.id) {
          case "wri-gadm-36-iso-layer-fill":
            if (feature.properties) {
              setIso(feature.properties.GID_0);
            }
            break;
          case "wri-gadm-36-adm1-layer-fill":
            for (const option of adm1Options) {
              if (
                feature.properties &&
                option.value === feature.properties.GID_1
              ) {
                setAdm1(feature.properties.GID_1);
                break;
              }
            }
            break;
          case "wri-gadm-36-adm2-layer-fill":
            for (const option of adm2Options) {
              if (
                feature.properties &&
                option.value === feature.properties.GID_2
              ) {
                setAdm2(feature.properties.GID_2);
                break;
              }
            }
            break;
          default:
            break;
        }
      }
    }
  };

  const zoomToGeometry = (geometry: Geometry) => {
    if (!theMap) return;
    const bounds: BBox = bbox(geometry);
    const lngLatBounds: mapboxgl.LngLatBoundsLike = [
      bounds[0],
      bounds[1],
      bounds[2],
      bounds[3],
    ];
    theMap.fitBounds(lngLatBounds);
  };

  const addHighlight = (type: string, geometry: Geometry) => {
    if (!theMap) return;
    removeHighlight(type);

    theMap.addSource(`selected-${type}-source`, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: geometry,
        properties: {},
      },
    });

    theMap.addLayer({
      id: `selected-${type}-layer`,
      type: "line",
      source: `selected-${type}-source`,
      layout: {},
      paint: {
        "line-color": "#02FDFF",
        "line-width": 1.5,
      },
    });
  };

  const removeHighlight = (type: string) => {
    if (!theMap) return;
    if (theMap.getLayer(`selected-${type}-layer`)) {
      theMap.removeLayer(`selected-${type}-layer`);
    }
    if (theMap.getSource(`selected-${type}-source`)) {
      theMap.removeSource(`selected-${type}-source`);
    }
  };

  /////////////////////
  //// On Map Load ////
  /////////////////////
  useEffect(() => {
    if (!theMap || mapLoaded) return;
    loadSources(); // Layers
    setHoverEvents(); // Set text panel
    fetchBoundaries("iso"); // Dropdown choices
    setMapLoaded(true); // Don't repeat these init steps
  }, [theMap]);

  // Treat click event handler differently (https://github.com/mapbox/mapbox-gl-js/issues/9627#issuecomment-1328124316)
  useEffect(() => {
    if (!theMap) return;
    theMap.on("click", (e) => handleMapClick(e));
  }, [isoOptions, adm1Options, adm2Options]);

  /////////////////////////////
  //// On Selection Change ////
  /////////////////////////////

  useEffect(() => {
    if (!theMap) return;
    const tasks = async () => {
      if (adm2) {
        const feature = await fetchFeature("adm2", adm2);
        if (!feature) return;
        addHighlight("adm2", feature.geometry);
        zoomToGeometry(feature.geometry);
        setOptions({
          ...options,
          area: {
            type: "gadm_adm2",
            value: adm2,
            geometry: feature.geometry,
          },
        });
      } else if (adm1) {
        removeHighlight("adm2");
        const feature = await fetchFeature("adm1", adm1);
        if (!feature) return;
        addHighlight("adm1", feature.geometry);
        zoomToGeometry(feature.geometry);
        fetchBoundaries("adm2", iso, adm1);
        setVisibleLayers([
          "wri-gadm-36-adm2-layer-fill",
          "wri-gadm-36-adm2-layer-line",
        ]);
        setOptions({
          ...options,
          area: {
            type: "gadm_adm1",
            value: adm1,
            geometry: feature.geometry,
          },
        });
      } else if (iso) {
        removeHighlight("adm2");
        removeHighlight("adm1");
        const feature = await fetchFeature("iso", iso);
        if (!feature) return;
        addHighlight("iso", feature.geometry);
        zoomToGeometry(feature.geometry);
        fetchBoundaries("adm1", iso);
        setAdm2Options([]);
        setVisibleLayers([
          "wri-gadm-36-adm1-layer-fill",
          "wri-gadm-36-adm1-layer-line",
        ]);
        setOptions({
          ...options,
          area: {
            type: "gadm_iso",
            value: iso,
            geometry: feature.geometry,
          },
        });
      } else {
        theMap.flyTo({ center: [0, 0], zoom: 2 });
        removeHighlight("adm2");
        removeHighlight("adm1");
        removeHighlight("iso");
        setVisibleLayers([
          "wri-gadm-36-iso-layer-fill",
          "wri-gadm-36-iso-layer-line",
        ]);
        setOptions({
          ...options,
          area: {
            type: "gadm_global",
            value: "Global",
            geometry: null,
          },
        });
      }
    };
    tasks();
  }, [iso, adm1, adm2]);

  return (
    <div className="">
      <Dropdown
        fluid
        search
        selection
        clearable
        placeholder="Global"
        options={isoOptions}
        value={iso}
        onChange={(e, newIso) => {
          if (typeof newIso.value === "string") {
            handleChange("iso", newIso.value);
          }
        }}
      />
      <Dropdown
        fluid
        search
        selection
        clearable
        disabled={!iso}
        placeholder="ADM1"
        options={adm1Options}
        value={adm1}
        onChange={(e, newAdm1) => {
          if (typeof newAdm1.value === "string") {
            handleChange("adm1", newAdm1.value);
          }
        }}
        className="mt-3"
      />
      <Dropdown
        fluid
        search
        selection
        clearable
        placeholder="ADM2"
        disabled={!adm1}
        options={adm2Options}
        value={adm2}
        onChange={(e, newAdm2) => {
          if (typeof newAdm2.value === "string") {
            handleChange("adm2", newAdm2.value);
          }
        }}
        className="mt-3"
      />
    </div>
  );
};

export default GADM;
