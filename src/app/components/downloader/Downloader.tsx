"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";
import { constructDownload } from "@/lib/constructDownload";
import { downloadData } from "@/lib/gfwDataAPI";
import { datasets, contexts, ranges } from "@/lib/lists";

import { Button } from "semantic-ui-react";

import Selector from "@/app/components/downloader/Selector";

interface DownloaderProps {}

const Downloader = ({}: DownloaderProps) => {
  const [query, setQuery] = useState<DownloadQuery>({
    areas: [],
    datasets: [],
    contexts: [],
    ranges: [],
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

  const fetchData = async ({ query }: { query: DownloadQuery }) => {
    const sql = await constructDownload({ query });
    console.log("sql =>", sql);
    //const res = await downloadData({ sql });
    //console.log("res =>", res);
  };

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

  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-[900px] flex flex-wrap gap-4">
        <Selector
          type="areas"
          options={areaOptions}
          asyncStatus={asyncStatus.area}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="datasets"
          options={datasetOptions}
          asyncStatus={asyncStatus.dataset}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="contexts"
          options={contextOptions}
          asyncStatus={asyncStatus.context}
          query={query}
          setQuery={setQuery}
        />
        <Selector
          type="ranges"
          options={rangeOptions}
          asyncStatus={asyncStatus.range}
          query={query}
          setQuery={setQuery}
        />
      </div>
      <div>
        <Button
          disabled={
            query.areas.length === 0 ||
            query.datasets.length === 0 ||
            query.ranges.length === 0
          }
          content="Download data"
          icon="download"
          labelPosition="left"
          color="grey"
          onClick={() => {
            fetchData({ query });
          }}
        />
      </div>
    </div>
  );
};

export default Downloader;
