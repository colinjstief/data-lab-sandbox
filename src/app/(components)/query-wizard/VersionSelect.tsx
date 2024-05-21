import { useState, useEffect } from "react";
import { Button, Radio, RadioProps, Segment } from "semantic-ui-react";

import { WizardQuery } from "@/lib/types";
import { wait } from "@/lib/utils";
import { getDataset } from "@/lib/apis/gfw";

interface VersionSelectProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const VersionSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: VersionSelectProps) => {
  const [async, setAsync] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  const [versions, setVersions] = useState<string[]>([]);

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  useEffect(() => {
    const startGetVersion = async () => {
      setAsync({
        status: "Loading",
        message: "Reticulating splines...",
      });
      try {
        const res = await getDataset({ dataset: options.asset });
        const versions = res.data.versions ?? [];
        const newestFirst = versions.reverse();
        setVersions(newestFirst);

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

    if (options.asset) {
      startGetVersion();
    }
  }, [options.asset]);

  const handleChange = (
    e: React.SyntheticEvent<HTMLElement>,
    data: RadioProps
  ) => {
    setOptions({ ...options, version: data.value as string });
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select a Version</h3>
        <div className="flex flex-col">
          {versions &&
            versions.map((version, index) => {
              return (
                <Radio
                  key={version}
                  label={index === 0 ? `${version} (most recent)` : version}
                  name="versions"
                  value={version}
                  checked={options.version === version}
                  onChange={handleChange}
                  className="mb-2"
                />
              );
            })}
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!options.dataset}
          onClick={() => setVisibleTab("field")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default VersionSelect;
