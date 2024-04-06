"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import { BBox, Geometry } from "geojson";

import {
  Icon,
  Input,
  Segment,
  SegmentGroup,
  Message,
  MessageContent,
  SemanticCOLORS,
  SemanticICONS,
} from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";

import { wait } from "@/lib/utils";
import { getFeature } from "@/lib/mapboxAPI";
import { AsyncStatus, Field } from "@/lib/types";
import { sendPrompt } from "@/lib/geminiAPI";

interface ChatMapProps {}

const ChatMap = ({}: ChatMapProps) => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });
  const theMap = useRef<mapboxgl.Map | null>(null);
  const [promptValue, setPromptValue] = useState<string>("");
  const [iso, setIso] = useState<Field>({
    key: "",
    value: "",
    text: "",
  });

  const handleSetTheMap = ({ map }: { map: mapboxgl.Map }) => {
    theMap.current = map;
    if (map.isStyleLoaded()) {
      initializeMap({ map });
    } else {
      map.on("load", () => initializeMap({ map }));
    }
  };

  const initializeMap = ({ map }: { map: mapboxgl.Map }) => {
    addMapLayers({ map });
    //setHoverEvent({ map });
    //setClickEvent({ map });
  };

  const addMapLayers = ({ map }: { map: mapboxgl.Map }) => {
    if (!map.getSource("wri-gadm-36-iso")) {
      map.addSource("wri-gadm-36-iso", {
        type: "vector",
        url: "mapbox://duncanrager.175ly863",
      });
      map.addLayer({
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
      map.addLayer({
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
    }
  };

  // const setHoverEvent = ({ map }: { map: mapboxgl.Map }) => {
  //   map.on("mousemove", (e: mapboxgl.MapMouseEvent) => {
  //     const features = map.queryRenderedFeatures(e.point);
  //     if (features.length) {
  //       map.getCanvas().style.cursor = "pointer";
  //     } else {
  //       map.getCanvas().style.cursor = "";
  //     }
  //   });
  // };

  // const setClickEvent = ({ map }: { map: mapboxgl.Map }) => {
  //   map.on("click", (e: mapboxgl.MapMouseEvent) => {
  //     const features = map.queryRenderedFeatures(e.point);
  //     if (features.length) {
  //       for (const feature of features) {
  //         if (
  //           feature.properties &&
  //           feature.layer.id === "wri-gadm-36-iso-layer-fill"
  //         ) {
  //           setIso({
  //             key: feature.properties.GID_0,
  //             value: feature.properties.GID_0,
  //             text: feature.properties.NAME_0,
  //           });
  //         }
  //       }
  //     }
  //   });
  // };

  const zoomToGeometry = ({ geometry }: { geometry: Geometry }) => {
    if (!theMap.current) return;
    const bounds: BBox = bbox(geometry);
    const lngLatBounds: mapboxgl.LngLatBoundsLike = [
      bounds[0],
      bounds[1],
      bounds[2],
      bounds[3],
    ];
    theMap.current.fitBounds(lngLatBounds);
  };

  const addHighlight = ({ geometry }: { geometry: Geometry }) => {
    if (!theMap.current) return;

    theMap.current.addSource(`selected-iso-source`, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: geometry,
        properties: {},
      },
    });

    theMap.current.addLayer({
      id: `selected-iso-layer`,
      type: "line",
      source: `selected-iso-source`,
      layout: {},
      paint: {
        "line-color": "#02FDFF",
        "line-width": 1.5,
      },
    });
  };

  const removeHighlight = () => {
    if (!theMap.current) return;
    if (theMap.current.getLayer(`selected-iso-layer`)) {
      theMap.current.removeLayer(`selected-iso-layer`);
    }
    if (theMap.current.getSource(`selected-iso-source`)) {
      theMap.current.removeSource(`selected-iso-source`);
    }
  };

  const fetchFeature = async ({ code }: { code: string }) => {
    setAsyncStatus({
      status: "loading",
      message: "Reticulating splines...",
    });
    try {
      let feature;
      if (code) {
        feature = await getFeature({
          datasetId: "clb1pyakj02jj27ny2nqfw819",
          featureId: code,
        });
      }
      setAsyncStatus({
        status: "",
        message: "",
      });
      return feature;
    } catch (error) {
      console.error("Failed to load feature: ", error);
      setAsyncStatus({
        status: "error",
        message: "Failed to load feature",
      });
      await wait(3000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  const handleMessageSubmit = async ({ value }: { value: string }) => {
    if (value) {
      setAsyncStatus({
        status: "loading",
        message: "Reticulating splines...",
      });
      try {
        const response = await sendPrompt({
          history: [],
          prompt: value,
        });

        setAsyncStatus({
          status: "",
          message: "",
        });
      } catch (error) {
        setAsyncStatus({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
        await wait(3000);
        setAsyncStatus({
          status: "",
          message: "",
        });
      }
    } else {
      setAsyncStatus({
        status: "error",
        message: "Please enter a message.",
      });
      await wait(3000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  useEffect(() => {
    if (!theMap.current) return;
    const tasks = async () => {
      if (iso) {
        removeHighlight();
        const feature = await fetchFeature({ code: iso.value });
        if (!feature) return;
        addHighlight({ geometry: feature.geometry });
        zoomToGeometry({ geometry: feature.geometry });
      } else {
        theMap.current?.flyTo({ center: [0, 0], zoom: 2 });
        removeHighlight();
      }
    };
    tasks();
  }, [iso]);

  const currentAsyncStatus =
    asyncStatusConfig[asyncStatus.status as keyof typeof asyncStatusConfig] ||
    asyncStatusConfig.default;

  return (
    <div className="flex flex-1 h-full flex-col md:flex-row">
      <Segment className="flex flex-1 flex-col justify-between gap-5 m-0">
        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="flex flex-col">
            {messages.map((message, index) => {
              if (message.role === "system") {
                return (
                  <div
                    key={index}
                    className="flex gap-2.5 max-w-[80%] mb-2 bg-gray-100 border border-gray-300 rounded-lg py-2 px-4"
                  >
                    <Icon name="computer" siz="tiny" />
                    <p>{message.parts[0].text}</p>
                  </div>
                );
              } else if (message.role === "user") {
                return (
                  <div
                    key={index}
                    className="flex gap-2.5 self-end max-w-[80%] mb-2 bg-blue-100 border border-blue-300 rounded-lg py-2 px-4"
                  >
                    <Icon name="user" siz="tiny" />
                    <p>{message.parts[0].text}</p>
                  </div>
                );
              }
            })}
          </div>
          {asyncStatus.status && (
            <Message icon size="mini" color={currentAsyncStatus.color}>
              <Icon
                size="mini"
                name={currentAsyncStatus.iconName}
                loading={currentAsyncStatus.loading}
              />
              <MessageContent>{asyncStatus.message}</MessageContent>
            </Message>
          )}
        </div>
        <div>
          <Input
            fluid
            placeholder="Where would you like to go?"
            value={promptValue}
            onChange={(e, { value }) => setPromptValue(value)}
            action={{
              content: "Submit",
              onClick: () => handleMessageSubmit({ value: promptValue }),
            }}
          />
        </div>
      </Segment>
      <Segment className="flex flex-1 h-full w-full border mt-5 md:mt-0 md:ml-3 ml-0">
        <TheMap
          id="ChatMap"
          visible={true}
          setTheMap={handleSetTheMap}
          basemap="light-v9"
          zoom={2}
        />
      </Segment>
    </div>
  );
};

export default ChatMap;

const asyncStatusConfig = {
  loading: {
    iconName: "circle notched" as SemanticICONS,
    color: "blue" as SemanticCOLORS,
    loading: true,
  },
  success: {
    iconName: "check" as SemanticICONS,
    color: "green" as SemanticCOLORS,
    loading: false,
  },
  error: {
    iconName: "times circle" as SemanticICONS,
    color: "red" as SemanticCOLORS,
    loading: false,
  },
  default: {
    iconName: "pause" as SemanticICONS,
    color: "blue" as SemanticCOLORS,
    loading: false,
  },
};

const messages = [
  {
    role: "system",
    parts: [
      {
        text: "What country do you want to go to?",
      },
    ],
  },
];
