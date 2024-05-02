import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import { Dropdown, DropdownProps, Button, Segment } from "semantic-ui-react";

import { WizardQuery } from "@/lib/types";

import MapboxGLMap from "@/app/components/map/MapboxGLMap";
import GADM from "@/app/components/query-wizard/GADM";

interface AreaSelectProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const AreaSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: AreaSelectProps) => {
  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  const [areaType, setAreaType] = useState<string>("gadm");
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);
  const [textPanel, setTextPanel] = useState<string>("");

  const handleChange = (
    e: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => {
    setAreaType(data.value as string);
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-5">Select an area</h3>
        <div className="flex flex-col h-full">
          <Dropdown
            fluid
            selection
            options={areaOptions}
            value={areaType}
            onChange={handleChange}
            className="mb-3"
          />
          <div className="flex flex-1">
            <Segment className="w-[250px] border mb-0">
              {areaType === "gadm" && (
                <GADM
                  options={options}
                  setOptions={setOptions}
                  theMap={theMap}
                  setTextPanel={setTextPanel}
                />
              )}
              {/* {areaType === "wdpa" && <WDPA setTextPanel={setTextPanel} />}
              {areaType === "user_saved" && (
                <UserAreaSaved setTextPanel={setTextPanel} />
              )}
              {areaType === "user_drawn" && (
                <UserAreaDraw setTextPanel={setTextPanel} />
              )}
              {areaType === "user_upload" && (
                <UserAreaUpload setTextPanel={setTextPanel} />
              )} */}
            </Segment>
            <Segment className="flex-1 border mt-0 ml-3">
              <MapboxGLMap
                visible={visible}
                setTheMap={setTheMap}
                basemap="satellite-v9"
                mapOptions={{
                  zoom: 1,
                }}
                textPanel={textPanel}
              />
            </Segment>
          </div>
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!options.area}
          onClick={() => setVisibleTab("dataset")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default AreaSelect;

const areaOptions = [
  { key: "gadm", value: "gadm", text: "GADM" },
  { key: "wdpa", value: "wdpa", text: "WDPA" },
  { key: "user_saved", value: "user_saved", text: "Saved" },
  { key: "user_drawn", value: "user_drawn", text: "Draw" },
  { key: "user_upload", value: "user_upload", text: "Upload" },
];
