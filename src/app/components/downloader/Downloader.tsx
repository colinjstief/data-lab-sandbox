"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { ListItem } from "@/lib/types";
import { wait } from "@/lib/utils";
import {
  Button,
  Icon,
  Input,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";

interface DownloaderProps {}

interface DownloadQuery {
  area: ListItem[];
  data: ListItem[];
  context: ListItem[];
  range: ListItem[];
}

interface AsyncStatus {
  status: string;
  message: string;
}

const Downloader = ({}: DownloaderProps) => {
  const [activeTabs, setActiveTab] = useState<{
    area: string;
    data: string;
    context: string;
    range: string;
  }>({ area: "iso", data: "data", context: "layers", range: "years" });
  const [query, setQuery] = useState<DownloadQuery>({
    area: [],
    data: [],
    context: [],
    range: [],
  });
  const [areaOptions, setAreaOptions] = useState<ListItem[]>([]);
  const [dataOptions, setDataOptions] = useState<ListItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [asyncStatus, setAsyncStatus] = useState<{
    area: AsyncStatus;
    data: AsyncStatus;
    context: AsyncStatus;
    range: AsyncStatus;
  }>({
    area: { status: "Loading", message: "Reticulating splines..." },
    data: { status: "Loading", message: "Reticulating splines..." },
    context: { status: "Loading", message: "Reticulating splines..." },
    range: { status: "Loading", message: "Reticulating splines..." },
  });

  useEffect(() => {
    fetchAreas("iso");
    fetchDatasets();
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
      setAsyncStatus({
        ...asyncStatus,
        area: {
          status: "Success",
          message: "",
        },
      });
    } catch (error) {
      setAsyncStatus({
        ...asyncStatus,
        area: {
          status: "Failed",
          message: "Failed to load areas. Try reloading?",
        },
      });
    }
  };

  const fetchDatasets = async () => {
    try {
      const datasets = [
        {
          key: "1",
          value: "1",
          text: "Dataset 1",
        },
        {
          key: "2",
          value: "2",
          text: "Dataset 2",
        },
        {
          key: "3",
          value: "3",
          text: "Dataset 3",
        },
      ];

      setDataOptions(datasets);

      setAsyncStatus({
        ...asyncStatus,
        data: {
          status: "Success",
          message: "",
        },
      });
    } catch (error) {
      setAsyncStatus({
        ...asyncStatus,
        data: {
          status: "Failed",
          message: "Failed to load datasets. Try reloading?",
        },
      });
    }
  };

  const toggleIsoSelection = (selectedIso: ListItem) => {
    setQuery((prevQuery) => {
      const isAlreadySelected = prevQuery.area.some(
        (area) => area.value === selectedIso.value
      );

      return {
        ...prevQuery,
        area: isAlreadySelected
          ? prevQuery.area.filter((area) => area.value !== selectedIso.value)
          : [...prevQuery.area, selectedIso],
      };
    });
  };

  const selectAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      area: areaOptions,
    }));
  };

  const clearAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      area: [],
    }));
  };

  console.log("query =>", query);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[900px] flex flex-wrap gap-4">
        {/* AREA SELECTOR */}
        <div className="w-[400px] border border-gray-300">
          <div className="flex gap-4 p-3 border-b border-gray-300">
            <div
              className={`uppercase cursor-pointer ${
                activeTabs.area === "iso"
                  ? "text-blue-500 border-b border-blue-500"
                  : ""
              }`}
            >
              Countries
            </div>
          </div>
          <div className="p-3 border-b border-gray-300">
            <Input
              fluid
              icon="search"
              iconPosition="left"
              placeholder="Search here..."
              value={searchText}
              onChange={(e, { value }) => setSearchText(value)}
            />
          </div>
          <div className="border-b border-gray-300 h-[150px] overflow-auto">
            {asyncStatus.area.status === "Loading" ||
            asyncStatus.area.status === "" ? (
              <Segment className="h-full">
                <Dimmer active inverted>
                  <Loader inverted>{asyncStatus.area.message}</Loader>
                </Dimmer>
              </Segment>
            ) : asyncStatus.area.status === "Failed" ? (
              <p>{asyncStatus.area.message}</p>
            ) : (
              <ul>
                {areaOptions
                  .filter((area) =>
                    area.text.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((area) => (
                    <li
                      key={area.key}
                      className="px-3 py-1 border-b border-gray-200 cursor-pointer flex gap-3 items-center"
                      onClick={() => toggleIsoSelection(area)}
                    >
                      <div
                        className={`w-[14px] h-[14px] border border-gray-400 ${
                          query.area.some(
                            (selectedIso) => selectedIso.value === area.value
                          )
                            ? "bg-gray-400"
                            : ""
                        }`}
                      ></div>
                      <p>{area.text}</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="p-3 flex gap-4 border-b border-gray-300">
            <Button fluid content="Select all" onClick={selectAll} />
            <Button fluid content="Clear all" onClick={clearAll} />
          </div>
          <div>
            <ul className="p-3 flex flex-wrap gap-2">
              {query.area.map((area) => (
                <li
                  key={area.key}
                  className="flex gap-1 cursor-pointer px-2 py-1 border border-gray-300"
                  onClick={() => toggleIsoSelection(area)}
                >
                  <Icon name="x" />
                  {area.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* DATA SELECTOR */}
        <div className="w-[400px] border border-gray-300">
          <div className="flex gap-4 p-3 border-b border-gray-300">
            <div
              className={`uppercase cursor-pointer ${
                activeTabs.data === "data"
                  ? "text-blue-500 border-b border-blue-500"
                  : ""
              }`}
            >
              DATASETS
            </div>
          </div>
          <div className="p-3 border-b border-gray-300">
            <Input
              fluid
              icon="search"
              iconPosition="left"
              placeholder="Search here..."
              value={searchText}
              onChange={(e, { value }) => setSearchText(value)}
            />
          </div>
          <div className="border-b border-gray-300 h-[150px] overflow-auto">
            {asyncStatus.data.status === "Loading" ||
            asyncStatus.data.status === "" ? (
              <Segment className="h-full">
                <Dimmer active inverted>
                  <Loader inverted>{asyncStatus.data.message}</Loader>
                </Dimmer>
              </Segment>
            ) : asyncStatus.data.status === "Failed" ? (
              <p>{asyncStatus.data.message}</p>
            ) : (
              <ul>
                {dataOptions
                  .filter((data) =>
                    data.text.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((data) => (
                    <li
                      key={data.key}
                      className="px-3 py-1 border-b border-gray-200 cursor-pointer flex gap-3 items-center"
                      onClick={() => toggleIsoSelection(data)}
                    >
                      <div
                        className={`w-[14px] h-[14px] border border-gray-400 ${
                          query.data.some(
                            (selectedData) => selectedData.value === data.value
                          )
                            ? "bg-gray-400"
                            : ""
                        }`}
                      ></div>
                      <p>{data.text}</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="p-3 flex gap-4 border-b border-gray-300">
            <Button fluid content="Select all" onClick={selectAll} />
            <Button fluid content="Clear all" onClick={clearAll} />
          </div>
          <div>
            <ul className="p-3 flex flex-wrap gap-2">
              {query.area.map((area) => (
                <li
                  key={area.key}
                  className="flex gap-1 cursor-pointer px-2 py-1 border border-gray-300"
                  onClick={() => toggleIsoSelection(area)}
                >
                  <Icon name="x" />
                  {area.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <Button
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
