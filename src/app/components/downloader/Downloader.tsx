"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";
import { constructDownload } from "@/lib/constructDownload";
import { datasets, contexts, ranges } from "@/lib/lists";

import { Button, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

import Selector from "@/app/components/downloader/Selector";
import { wait } from "@/lib/utils";

interface DownloaderProps {}

const Downloader = ({}: DownloaderProps) => {
  const [query, setQuery] = useState<DownloadQuery>({
    areas: [],
    datasets: [],
    contexts: [],
    ranges: [],
  });
  const [downloadURL, setDownloadURL] = useState<string>("");
  const [areaOptions, setAreaOptions] = useState<Field[]>([]);
  const [activeTabs, setActiveTabs] = useState<{
    [key: string]: string;
  }>({
    areas: "iso",
    datasets: "datasets",
    contexts: "contexts",
    ranges: "ranges",
  });
  const [datasetOptions, setDatasetOptions] = useState<Field[]>(datasets);
  const [contextOptions, setContextOptions] = useState<Field[]>(contexts);
  const [rangeOptions, setRangeOptions] = useState<Field[]>(ranges);
  const [copyButtonOptions, setCopyButtonOptions] = useState<{
    color: SemanticCOLORS;
    icon: SemanticICONS;
  }>({ color: "grey", icon: "copy" });
  const [asyncStatus, setAsyncStatus] = useState<{
    areas: AsyncStatus;
    datasets: AsyncStatus;
    contexts: AsyncStatus;
    ranges: AsyncStatus;
  }>({
    areas: { status: "Loading", message: "Reticulating splines..." },
    datasets: { status: "Success", message: "" },
    contexts: { status: "Success", message: "" },
    ranges: { status: "Success", message: "" },
  });

  useEffect(() => {
    const iso = query.areas.find((area) => area.type === "iso")?.value;
    const adm1 = query.areas.find((area) => area.type === "adm1")?.value;

    if (activeTabs.areas === "adm2") {
      fetchAreas("adm2", iso, adm1);
    } else if (activeTabs.areas === "adm1") {
      fetchAreas("adm1", iso);
      setQuery((prevQuery) => {
        return {
          ...prevQuery,
          areas: prevQuery.areas.filter(
            (area) => area.type === "adm1" || area.type === "iso"
          ),
        };
      });
    } else {
      fetchAreas("iso");
      setQuery((prevQuery) => {
        return {
          ...prevQuery,
          areas: prevQuery.areas.filter((area) => area.type === "iso"),
        };
      });
    }
  }, [activeTabs.areas]);

  useEffect(() => {
    const getDownloadURL = async () => {
      let newURL;
      if (
        query.areas.length > 0 &&
        query.datasets.length > 0 &&
        query.ranges.length > 0
      ) {
        newURL = await constructDownload({ query });
      } else {
        newURL = "";
      }
      setDownloadURL(newURL);
    };
    getDownloadURL();
  }, [query]);

  const fetchAreas = async (type: string, iso?: string, adm1?: string) => {
    setAsyncStatus((oldState) => {
      return {
        ...oldState,
        areas: { status: "Loading", message: "Reticulating splines..." },
      };
    });
    try {
      const boundaries = await getBoundaries({ type, iso, adm1 });

      switch (type) {
        case "iso":
          setAreaOptions(boundaries);
          break;
        case "adm1":
          setAreaOptions(boundaries);
          break;
        case "adm2":
          setAreaOptions(boundaries);
          break;
        default:
          break;
      }
      setAsyncStatus((oldState) => {
        return {
          ...oldState,
          areas: {
            status: "Success",
            message: "",
          },
        };
      });
    } catch (error) {
      setAsyncStatus((oldState) => {
        return {
          ...oldState,
          areas: {
            status: "Failed",
            message: "Failed to load datasets. Try reloading?",
          },
        };
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(downloadURL);
      setCopyButtonOptions({ color: "green", icon: "check" });
      await wait(1000);
      setCopyButtonOptions({ color: "grey", icon: "copy" });
    } catch (err) {
      setCopyButtonOptions({ color: "red", icon: "exclamation" });
      await wait(1000);
      setCopyButtonOptions({ color: "grey", icon: "copy" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-[900px] flex flex-wrap gap-4">
        <Selector
          type="areas"
          asyncStatus={asyncStatus.areas}
          query={query}
          setQuery={setQuery}
          message="Groups results by selected geographies"
          tabs={[
            { label: "ISO", value: "iso", options: areaOptions },
            {
              label: "ADM1",
              value: "adm1",
              options: areaOptions,
              disabled:
                query.areas.filter((area) => area.type === "iso").length !== 1,
            },
            {
              label: "ADM2",
              value: "adm2",
              options: areaOptions,
              disabled:
                query.areas.filter((area) => area.type === "adm1").length !== 1,
            },
          ]}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
        <Selector
          type="datasets"
          asyncStatus={asyncStatus.datasets}
          query={query}
          setQuery={setQuery}
          message="Gets the SUM of the selected fields"
          tabs={[
            { label: "Datasets", value: "datasets", options: datasetOptions },
          ]}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
        <Selector
          type="contexts"
          asyncStatus={asyncStatus.contexts}
          query={query}
          setQuery={setQuery}
          message="Group by all possible values in the selected fields"
          tabs={[
            { label: "Groupings", value: "contexts", options: contextOptions },
          ]}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
        <Selector
          type="ranges"
          asyncStatus={asyncStatus.ranges}
          query={query}
          setQuery={setQuery}
          message="Groups results by selected years"
          tabs={[{ label: "Years", value: "ranges", options: rangeOptions }]}
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
        />
      </div>
      <div>
        <Button
          disabled={!downloadURL}
          as={"a"}
          href={downloadURL}
          content="Download data"
          icon="download"
          labelPosition="left"
          color="grey"
        />
      </div>
      {downloadURL && (
        <div className="relative">
          <pre className="bg-gray-100 text-gray-800 border border-gray-300 py-4 pl-4 pr-10 rounded-lg overflow-auto font-mono text-sm leading-6">
            <code className="text-red-600 break-words whitespace-pre-wrap">
              {downloadURL}
            </code>
          </pre>
          <Button
            size="medium"
            color={copyButtonOptions.color}
            icon={copyButtonOptions.icon}
            onClick={copyToClipboard}
            className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Downloader;
