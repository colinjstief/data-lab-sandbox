import { Button, Segment } from "semantic-ui-react";
import DatePicker from "react-datepicker";

import { WizardQuery } from "@/lib/types";

interface RangeSelectProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const RangeSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: RangeSelectProps) => {
  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  const handleChange = ([newStartDate, newEndDate]: [Date, Date]) => {
    setOptions({ ...options, range: [newStartDate, newEndDate] });
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select a Range</h3>
        <div className="flex flex-col">
          <div className="mb-10">
            {options.dataset === "tcl" ? (
              <div className="w-50">
                <Button
                  active={!options.range.length}
                  onClick={() => {
                    setOptions({ ...options, range: [] });
                  }}
                  value="Full data range"
                >
                  Full range (2001 - 2022)
                </Button>
                <Button
                  active={!!options.range.length}
                  onClick={() => {
                    setOptions({
                      ...options,
                      range: [new Date("2001-06-01"), new Date("2022-06-01")],
                    });
                  }}
                  value="Subset"
                >
                  Subset of years
                </Button>
                {!!options.range.length && (
                  <DatePicker
                    className="cursor-pointer p-1.5 border border-gray-300"
                    selected={options.range[0]}
                    onChange={handleChange}
                    selectsRange
                    startDate={options.range[0]}
                    endDate={options.range[1]}
                    minDate={new Date("2001-06-01")}
                    maxDate={new Date("2022-06-01")}
                    dateFormat="yyyy"
                    showYearPicker
                  />
                )}
              </div>
            ) : (
              <h1>Date picker</h1>
            )}
          </div>
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!options.dataset}
          onClick={() => setVisibleTab("group")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default RangeSelect;
