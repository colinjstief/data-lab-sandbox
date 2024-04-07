"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";

import { Button } from "semantic-ui-react";

import Selector from "@/app/components/downloader/Selector";

import { datasets, contexts, ranges } from "@/lib/lists";

interface DownloaderProps {}

const Downloader = ({}: DownloaderProps) => {
  const [query, setQuery] = useState<DownloadQuery>({
    area: [],
    dataset: [],
    context: [],
    range: [],
  });
  const [areaOptions, setAreaOptions] = useState<Field[]>([]);
  const [datasetOptions, setDatasetOptions] = useState<Field[]>(datasets);
  const [contextOptions, setContextOptions] = useState<Field[]>(contexts);
  const [rangeOptions, setRangeOptions] = useState<Field[]>(ranges);

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

  console.log("query =>", query);

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-[900px] flex flex-wrap gap-4">
        <Selector
          type="area"
          options={areaOptions}
          asyncStatus={asyncStatus.area}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="dataset"
          options={datasetOptions}
          asyncStatus={asyncStatus.dataset}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="context"
          options={contextOptions}
          asyncStatus={asyncStatus.context}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="range"
          options={rangeOptions}
          asyncStatus={asyncStatus.range}
          query={query}
          setQuery={setQuery}
        />
      </div>
      <div>
        <Button
          disabled={true}
          content="Download data"
          icon="download"
          labelPosition="left"
          color="grey"
          onClick={() => {
            console.log("Download the data");
          }}
        />
      </div>
    </div>
  );
};

export default Downloader;
