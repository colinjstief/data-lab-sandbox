"use client";

import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { Icon, Input, Segment, SegmentGroup } from "semantic-ui-react";

import TheMap from "@/app/components/other/TheMap";
import { Location } from "@/lib/types";

import { wait } from "@/lib/utils";

interface ChatMapProps {}

const ChatMap = ({}: ChatMapProps) => {
  const theMap = useRef<mapboxgl.Map | null>(null);
  const [chatText, setChatText] = useState<string>("");

  const handleSetTheMap = ({ map }: { map: mapboxgl.Map }) => {
    theMap.current = map;
  };

  const handleMessageSubmit = ({ value }: { value: string }) => {
    console.log("Message submitted: ", value);
  };

  return (
    <div className="flex flex-1 h-full">
      <SegmentGroup className="flex w-[400px] border mb-0">
        <Segment className="h-[200px]">
          <h1>See context here</h1>
        </Segment>
        <Segment className="flex flex-col flex-1 justify-between">
          <div className="">
            <h1>Messages</h1>
          </div>
          <div className="">
            <Input
              fluid
              placeholder="Where would you like to go?"
              value={chatText}
              onChange={(e, { value }) => setChatText(value)}
              action={{
                content: "Submit",
                onClick: () => handleMessageSubmit({ value: chatText }),
              }}
            />
          </div>
        </Segment>
      </SegmentGroup>
      <Segment className="flex-1 border mt-0 ml-3">
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
