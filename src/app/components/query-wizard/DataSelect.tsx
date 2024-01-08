import { Dropdown, Button, Segment, Icon } from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface DataSelectProps {
  query: WizardQuery;
  setQuery: (query: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const DataSelect = ({
  query,
  setQuery,
  visible,
  setVisibleTab,
}: DataSelectProps) => {
  const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
    setQuery({ ...query, dataset: e.currentTarget.dataset.dataset! });
  };

  let containerStyle = "h-full";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select a dataset</h3>
        <div className="flex flex-wrap">
          {Object.entries(datasets).map(([key, value]) => {
            let cardStyle;
            let radioButton;
            if (query.dataset === value.dataset) {
              cardStyle =
                "h-[175px] w-[175px] border-2 border-gray-500 flex flex-col justify-center items-center p-[5px] mr-5 mb-5 hover:cursor-pointer";
              radioButton = (
                <div className="border border-gray-400 h-[20px] w-[20px] mt-5 rounded-full flex justify-center items-center">
                  <div className="bg-gray-600 h-[12px] w-[12px] rounded-full"></div>
                </div>
              );
            } else {
              cardStyle =
                "h-[175px] w-[175px] border border-gray-300 flex flex-col justify-center items-center p-[5px] mr-5 mb-5 hover:cursor-pointer";
              radioButton = (
                <div className="border border-gray-400 h-[20px] w-[20px] mt-5 rounded-full"></div>
              );
            }

            return (
              <div
                key={key}
                data-dataset={value.dataset}
                className={cardStyle}
                onClick={(e) => handleChange(e)}
              >
                <Icon name={value.icon as any} size="big" />
                <p className="font-bold text-[18px] my-1">{value.name}</p>
                <p>{value.coverage}</p>
                {radioButton}
              </div>
            );
          })}
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!query.dataset}
          onClick={() => setVisibleTab("version")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default DataSelect;
