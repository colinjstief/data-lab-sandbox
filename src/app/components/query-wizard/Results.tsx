import { Dropdown, Button, Segment } from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface ResultsProps {
  query: WizardQuery;
  setQuery: (query: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const Results = ({ visible }: ResultsProps) => {
  let containerStyle = "h-full mt-0 border-l-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">Results</Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default Results;
