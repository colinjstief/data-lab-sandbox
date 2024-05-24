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

import MapboxGLMap from "@/app/(components)/(map)/MapboxGLMap";

import { wait } from "@/lib/utils";
import { getFeature } from "@/lib/apis/mapbox";
import { AsyncStatus, Field } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";
import { sendPrompt } from "@/lib/apis/gemini";

interface ChatMapProps {}

const ChatMap = ({}: ChatMapProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const [history, setHistory] = useState<Content[]>([]);
  const [promptValue, setPromptValue] = useState<string>("");
  const [iso, setIso] = useState<Field>({
    key: "",
    value: "",
    text: "",
  });
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });

  const loadSources = () => {
    if (!theMap) return;
    if (!theMap.getSource("wri-gadm-36-iso")) {
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
    }
  };

  const zoomToGeometry = ({ geometry }: { geometry: Geometry }) => {
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

  const addHighlight = ({ geometry }: { geometry: Geometry }) => {
    if (!theMap) return;

    theMap.addSource(`selected-iso-source`, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: geometry,
        properties: {},
      },
    });

    theMap.addLayer({
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
    if (!theMap) return;
    if (theMap.getLayer(`selected-iso-layer`)) {
      theMap.removeLayer(`selected-iso-layer`);
    }
    if (theMap.getSource(`selected-iso-source`)) {
      theMap.removeSource(`selected-iso-source`);
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
    if (!theMap) return;
    const tasks = async () => {
      if (iso) {
        removeHighlight();
        const feature = await fetchFeature({ code: iso.value });
        if (!feature) return;
        // console.log("feature", feature);
        addHighlight({ geometry: feature.geometry });
        zoomToGeometry({ geometry: feature.geometry });
      } else {
        theMap?.flyTo({ center: [0, 0], zoom: 2 });
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

  useEffect(() => {
    if (!theMap || mapLoaded) return;
    loadSources();
    setMapLoaded(true);
  }, [theMap]);

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  // console.log("history", history);

  return (
    <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-2 h-[calc(100vh-50px)] md:h-[calc(100vh-90px)]">
      <div
        data-component="chatBoxContainer"
        className="p-4 sm:row-span-2 overflow-auto flex flex-col m-0 justify-between"
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
      </div>
      <div data-component="mapContainer" className="sm:row-span-2">
        <MapboxGLMap
          visible={true}
          setTheMap={setTheMap}
          basemap="light-v9"
          mapOptions={{
            zoom: 2,
          }}
        />
      </div>
    </div>
  );
};

export default ChatMap;
