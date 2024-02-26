import {
  Button,
  ButtonOr,
  ButtonGroup,
  Segment,
  ButtonProps,
} from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface SegmentationProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const SegmentSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: SegmentationProps) => {
  const handleTimeClick = (
    e: React.SyntheticEvent<HTMLElement>,
    data: ButtonProps
  ) => {
    setOptions({
      ...options,
      timeSegment: data.value as string,
    });
  };

  const handleAreaClick = (
    e: React.SyntheticEvent<HTMLElement>,
    data: ButtonProps
  ) => {
    setOptions({
      ...options,
      areaSegment: data.value as string,
    });
  };

  let segmentOptions =
    datasets[options.dataset].segmentations[options.area.type];
  if (!segmentOptions) {
    segmentOptions = [];
  }

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select break downs</h3>
        <div className="flex flex-col">
          <div className="mb-10">
            <h4 className="mb-2">Do you want a breakdown by year?</h4>
            <ButtonGroup fluid>
              <Button
                active={options.timeSegment === ""}
                onClick={handleTimeClick}
                value=""
              >
                No breakdown
              </Button>
              {segmentOptions.includes("year") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeSegment === "year"}
                    onClick={handleTimeClick}
                    value="year"
                  >
                    By year
                  </Button>
                </>
              )}
              {segmentOptions.includes("week") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeSegment === "week"}
                    onClick={handleTimeClick}
                    value="week"
                  >
                    By week
                  </Button>
                </>
              )}
              {segmentOptions.includes("day") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeSegment === "day"}
                    onClick={handleTimeClick}
                    value="day"
                  >
                    By day
                  </Button>
                </>
              )}
            </ButtonGroup>
          </div>
          <div>
            <h4 className="mb-2">Area</h4>
            <ButtonGroup fluid>
              <Button
                active={options.areaSegment === ""}
                onClick={handleAreaClick}
                value=""
              >
                No breakdown
              </Button>
              {segmentOptions.includes("iso") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaSegment === "iso"}
                    onClick={handleAreaClick}
                    value="iso"
                  >
                    By ISO
                  </Button>
                </>
              )}
              {segmentOptions.includes("adm1") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaSegment === "adm1"}
                    onClick={handleAreaClick}
                    value="adm1"
                  >
                    By ADM1
                  </Button>
                </>
              )}
              {segmentOptions.includes("adm2") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaSegment === "adm2"}
                    onClick={handleAreaClick}
                    value="adm2"
                  >
                    By ADM2
                  </Button>
                </>
              )}
            </ButtonGroup>
          </div>
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!options.dataset}
          onClick={() => setVisibleTab("version")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default SegmentSelect;
