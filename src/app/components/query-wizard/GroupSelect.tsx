import {
  Button,
  ButtonOr,
  ButtonGroup,
  Segment,
  ButtonProps,
} from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface GroupSelectProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const GroupSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: GroupSelectProps) => {
  const handleTimeClick = (
    e: React.SyntheticEvent<HTMLElement>,
    data: ButtonProps
  ) => {
    setOptions({
      ...options,
      timeGroup: data.value as string,
    });
  };

  const handleAreaClick = (
    e: React.SyntheticEvent<HTMLElement>,
    data: ButtonProps
  ) => {
    setOptions({
      ...options,
      areaGroup: data.value as string,
    });
  };

  let groupOptions = datasets[options.dataset].groups[options.area.type];
  if (!groupOptions) {
    groupOptions = [];
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
        <h3 className="text-xl font-bold mb-5">Select groupings</h3>
        <div className="flex flex-col">
          <div className="mb-10">
            <h4 className="mb-2">Do you want to group by year?</h4>
            <ButtonGroup fluid>
              <Button
                active={options.timeGroup === ""}
                onClick={handleTimeClick}
                value=""
              >
                No breakdown
              </Button>
              {groupOptions.includes("year") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeGroup === "year"}
                    onClick={handleTimeClick}
                    value="year"
                  >
                    By year
                  </Button>
                </>
              )}
              {groupOptions.includes("week") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeGroup === "week"}
                    onClick={handleTimeClick}
                    value="week"
                  >
                    By week
                  </Button>
                </>
              )}
              {groupOptions.includes("day") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.timeGroup === "day"}
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
                active={options.areaGroup === ""}
                onClick={handleAreaClick}
                value=""
              >
                No breakdown
              </Button>
              {groupOptions.includes("iso") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaGroup === "iso"}
                    onClick={handleAreaClick}
                    value="iso"
                  >
                    By ISO
                  </Button>
                </>
              )}
              {groupOptions.includes("adm1") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaGroup === "adm1"}
                    onClick={handleAreaClick}
                    value="adm1"
                  >
                    By ADM1
                  </Button>
                </>
              )}
              {groupOptions.includes("adm2") && (
                <>
                  <ButtonOr />
                  <Button
                    active={options.areaGroup === "adm2"}
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

export default GroupSelect;
