import { useState, useEffect } from "react";
import { Button, Radio, RadioProps, Segment } from "semantic-ui-react";

import { WizardQuery, GFWAPIVersion } from "@/lib/types";
import { wait } from "@/lib/utils";
import { getFields } from "@/lib/gfwDataAPI";

interface FieldSelectProps {
  query: WizardQuery;
  setQuery: (query: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const FeildSelect = ({
  query,
  setQuery,
  visible,
  setVisibleTab,
}: FieldSelectProps) => {
  const [async, setAsync] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  const [fields, setFields] = useState<GFWAPIVersion[]>([]);

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  useEffect(() => {
    const startGetFields = async () => {
      setAsync({
        status: "Loading",
        message: "Reticulating splines...",
      });
      try {
        const fields = await getFields({
          dataset: query.asset,
          version: query.version,
        });
        if (!fields) throw new Error("No fields found");

        console.log("fields =>", fields);
        setFields(fields);

        setAsync({
          status: "",
          message: "",
        });
      } catch (error) {
        setAsync({
          status: "Failed",
          message: "Failed to load boundaries",
        });
        await wait(3000);
        setAsync({
          status: "",
          message: "",
        });
      }
    };

    if (query.asset && query.version) {
      startGetFields();
    }
  }, [query.asset, query.version]);

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select your fields</h3>
        <div className="flex flex-col"></div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!query.dataset}
          onClick={() => setVisibleTab("results")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default FeildSelect;
