"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";
import { constructDownload } from "@/lib/constructDownload";
import { datasets, contexts, ranges } from "@/lib/lists";

import { Button, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

import Selector from "@/app/components/downloader/Selector";
import { set } from "date-fns";
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
  const [datasetOptions, setDatasetOptions] = useState<Field[]>(datasets);
  const [contextOptions, setContextOptions] = useState<Field[]>(contexts);
  const [rangeOptions, setRangeOptions] = useState<Field[]>(ranges);
  const [copyButtonOptions, setCopyButtonOptions] = useState<{
    color: SemanticCOLORS;
    icon: SemanticICONS;
  }>({ color: "grey", icon: "copy" });
  const [asyncStatus, setAsyncStatus] = useState<{
    area: AsyncStatus;
    dataset: AsyncStatus;
    context: AsyncStatus;
    range: AsyncStatus;
  }>({
    area: { status: "Loading", message: "Reticulating splines..." },
    dataset: { status: "Success", message: "" },
    context: { status: "Success", message: "" },
    range: { status: "Success", message: "" },
  });

  useEffect(() => {
    fetchAreas("iso");
  }, []);

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
    try {
      const boundaries = await getBoundaries({ type, iso, adm1 });

      switch (type) {
        case "iso":
          setAreaOptions(boundaries);
          break;
        default:
          break;
      }
      setAsyncStatus((oldState) => {
        return {
          ...oldState,
          area: {
            status: "Success",
            message: "",
          },
        };
      });
    } catch (error) {
      setAsyncStatus((oldState) => {
        return {
          ...oldState,
          area: {
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
          options={areaOptions}
          asyncStatus={asyncStatus.area}
          query={query}
          setQuery={setQuery}
          message="Groups results by selected countries"
        />
        <Selector
          type="datasets"
          options={datasetOptions}
          asyncStatus={asyncStatus.dataset}
          query={query}
          setQuery={setQuery}
          message="Gets the SUM of the selected fields"
        />
        <Selector
          type="contexts"
          options={contextOptions}
          asyncStatus={asyncStatus.context}
          query={query}
          setQuery={setQuery}
          message="Filter by selected fields using AND operator"
        />
        <Selector
          type="ranges"
          options={rangeOptions}
          asyncStatus={asyncStatus.range}
          query={query}
          setQuery={setQuery}
          message="Groups results by selected years"
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
