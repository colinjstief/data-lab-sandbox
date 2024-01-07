import { Dropdown, Button, Segment } from "semantic-ui-react";

interface VersionSelectProps {
  visible: boolean;
}

const VersionSelect = ({ visible }: VersionSelectProps) => {
  let containerStyle = "h-full mt-0 border-l-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">Select Version</Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default VersionSelect;
