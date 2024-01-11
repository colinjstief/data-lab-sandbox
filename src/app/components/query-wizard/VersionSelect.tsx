import { Button, Segment } from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface VersionSelectProps {
  query: WizardQuery;
  setQuery: (query: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const VersionSelect = ({
  query,
  setQuery,
  visible,
  setVisibleTab,
}: VersionSelectProps) => {
  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select a Version</h3>
        <div className="flex flex-wrap">
          {Object.entries(datasets).map(([key, value]) => {
            return value.versions.map((version) => {
              return <p key={version}>{version}</p>;
            });
          })}
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!query.dataset}
          onClick={() => setVisibleTab("field")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default VersionSelect;
