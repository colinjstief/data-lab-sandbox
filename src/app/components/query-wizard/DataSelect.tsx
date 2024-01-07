import { Dropdown, Button, Segment } from "semantic-ui-react";

import { datasets } from "@/lib/datasets";

interface DataSelectProps {
  query: object;
  visible: boolean;
}

const DataSelect = ({ query, visible }: DataSelectProps) => {
  let containerStyle = "h-full";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold">
          {Object.entries(datasets).map(([key, value]) => {
            return (
              <Dropdown
                key={Math.random()}
                placeholder="Select Dataset"
                fluid
                selection
                options={[
                  {
                    key: key,
                    value: key,
                    text: value.name,
                  },
                ]}
              />
            );
          })}
        </h3>
      </Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default DataSelect;
