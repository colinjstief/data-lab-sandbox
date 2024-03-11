import { useState, useEffect } from "react";
import { Button, Segment } from "semantic-ui-react";

import { WizardQuery, GFWAPIQueryResponse } from "@/lib/types";
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
  const [results, setResults] = useState<string>("");
  const [message, setMessage] = useState<string>("");
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
        const res = await queryData({ options });
        console.log("res =>", res);
        if (res.data) {
          setResults(JSON.stringify(res.data, null, 2));
          setMessage("");
        } else if (res.message) {
          setResults("");
          setMessage(res.message);
        }
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
      setResults("");
      setMessage("");
      startSendRequest();
    }
  }, [visible, options.version, options.query]);

  useEffect(() => {
    setResults("");
    setMessage("");
  }, [options.query]);

  return (
    <Segment.Group className={containerStyle}>
      <Segment>
        <div className="p-4 bg-slate-200">
          <span className="font-mono">{options.query}</span>
        </div>
      </Segment>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Results</h3>
        <div>
          {async.status && <p>Fetching your data...</p>}
          {message && <p>{message}</p>}
          {!!results.length && (
            <pre className="bg-gray-100 text-gray-800 border border-gray-300 p-4 rounded-lg overflow-auto font-mono text-sm leading-6">
              <code className="text-red-600">{results}</code>
            </pre>
          )}
        </div>
      </Segment>
    </Segment.Group>
  );
};

export default Results;
