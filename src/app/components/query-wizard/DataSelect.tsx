import { Dropdown, Button, Segment } from "semantic-ui-react";

interface DataSelectProps {
  visible: boolean;
}

const DataSelect = ({ visible }: DataSelectProps) => {
  let containerStyle = "h-full mt-0 border-l-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold">Select a dataset</h3>
      </Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default DataSelect;
