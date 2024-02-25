import { useState, useEffect } from "react";
import { Button, Segment } from "semantic-ui-react";

import { WizardQuery } from "@/lib/types";
import { wait } from "@/lib/utils";
import { queryData } from "@/lib/gfwDataAPI";

interface ResultsProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const Results = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: ResultsProps) => {
  const [results, setResults] = useState<{ [key: string]: any }[]>([]);
  const [async, setAsync] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  useEffect(() => {
    const startSendRequest = async () => {
      setAsync({
        status: "Loading",
        message: "Reticulating splines...",
      });
      try {
        const results = await queryData({ options });
        console.log("results =>", results);
        setResults(results);

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

    if (visible && options.version && options.query) {
      console.log("here we go");
      startSendRequest();
    }
  }, [visible, options.version, options.query]);

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Results</h3>
        <div>
          {results.map((result, index) => (
            <div key={index}>
              {Object.entries(result).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
              ))}
            </div>
          ))}
        </div>
      </Segment>
    </Segment.Group>
  );
};

export default Results;
