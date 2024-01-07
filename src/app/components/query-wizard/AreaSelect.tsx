import { Dropdown, Button, Segment } from "semantic-ui-react";

interface AreaSelectProps {
  visible: boolean;
}

const AreaSelect = ({ visible }: AreaSelectProps) => {
  let containerStyle = "h-full mt-0 border-l-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">Select area</Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default AreaSelect;
