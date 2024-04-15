"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import { BBox, Geometry } from "geojson";
import { Content } from "@google/generative-ai";

import {
  Icon,
  Input,
  Segment,
  Message,
  MessageContent,
} from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";

import { wait } from "@/lib/utils";
import { getFeature } from "@/lib/mapboxAPI";
import { AsyncStatus, Field } from "@/lib/types";
import { asyncStatuses } from "@/lib/asyncStatuses";
import { sendPrompt } from "@/lib/geminiAPI";

interface ChatMapProps {}

const ChatMap = ({}: ChatMapProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });
  const theMap = useRef<mapboxgl.Map | null>(null);
  const [history, setHistory] = useState<Content[]>([]);
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
    setPromptValue("");
    if (value) {
      const currentHistory = [...history];
      setHistory((prevHistory) => {
        const newHistory = [
          ...prevHistory,
          { role: "user", parts: [{ text: value }] },
        ];
        return newHistory;
      });
      setAsyncStatus({
        status: "loading",
        message: "Reticulating splines...",
      });
      try {
        const response = await sendPrompt({
          providedHistory: currentHistory,
          prompt: value,
        });

        setHistory((prevHistory) => {
          const newHistory = [
            ...prevHistory,
            { role: "model", parts: [{ text: response }] },
          ];
          return newHistory;
        });

        const iso = extractIsoCode({ text: response });

        if (iso) {
          setIso({
            key: iso,
            value: iso,
            text: iso,
          });
        }

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

  const extractIsoCode = ({ text }: { text: string }) => {
    const regex = /\(([A-Z]{3})\)\.\.\./;
    const matches = text.match(regex);

    if (matches && matches[1]) {
      return matches[1];
    }
    return null;
  };

  useEffect(() => {
    if (!theMap.current) return;
    const tasks = async () => {
      if (iso) {
        removeHighlight();
        const feature = await fetchFeature({ code: iso.value });
        if (!feature) return;
        // console.log("feature", feature);
        addHighlight({ geometry: feature.geometry });
        zoomToGeometry({ geometry: feature.geometry });
      } else {
        theMap.current?.flyTo({ center: [0, 0], zoom: 2 });
        removeHighlight();
      }
    };
    tasks();
  }, [iso]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const currentAsyncStatus =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  // console.log("history", history);

  return (
    <div className="flex w-full h-full gap-3">
      <Segment
        data-component="chatBoxContainer"
        className="flex-1 flex flex-col m-0 justify-between"
      >
        <div
          data-component="chatLog"
          ref={scrollRef}
          className="flex flex-1 flex-col overflow-auto max-h-[65vh] pr-2"
        >
          <div className="flex gap-2.5 max-w-[80%] mb-3 border border-gray-300 rounded-lg py-2 px-4 bg-gray-100 border-gray-300">
            <Icon name="computer" siz="tiny" />
            <p>Where would you like to go?</p>
          </div>
          {history.map((message, index) => {
            return (
              <div
                key={index}
                className={`flex gap-2.5 max-w-[80%] mb-3 border border-gray-300 rounded-lg py-2 px-4 ${
                  message.role === "user"
                    ? "self-end bg-blue-100 border-blue-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Icon
                  name={`${message.role === "user" ? "user" : "computer"}`}
                  siz="tiny"
                />
                <p>{message.parts[0].text}</p>
              </div>
            );
          })}
        </div>
        <div>
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
          <div data-component="chatInput">
            <Input
              fluid
              placeholder="Where to?"
              value={promptValue}
              onChange={(e, { value }) => setPromptValue(value)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  handleMessageSubmit({ value: promptValue });
                }
              }}
              action={{
                content: "Submit",
                onClick: () => handleMessageSubmit({ value: promptValue }),
              }}
            />
          </div>
        </div>
      </Segment>
      <Segment data-component="mapContainer" className="flex-1 m-0">
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
