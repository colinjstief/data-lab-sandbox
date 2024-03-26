"use client";

import { useEffect, useState } from "react";
import { getBoundaries } from "@/lib/mapboxAPI";
import { Boundary } from "@/lib/types";
import { wait } from "@/lib/utils";
import { Button, Icon, Input } from "semantic-ui-react";

interface DownloaderProps {}

interface DownloadQuery {
  iso: Boundary[];
  data: string[];
  context: string[];
  years: string[];
}

const Downloader = ({}: DownloaderProps) => {
  const [activeTab, setActiveTab] = useState<string>("iso");
  const [query, setQuery] = useState<DownloadQuery>({
    iso: [],
    data: [],
    context: [],
    years: [],
  });
  const [isoOptions, setIsoOptions] = useState<Boundary[]>([]);
  const [searchText, setSearchText] = useState("");

  const [async, setAsync] = useState<{
    status: string;
    message: string;
  }>({
    status: "",
    message: "",
  });

  useEffect(() => {
    fetchBoundaries("iso");
  }, []);

  const fetchBoundaries = async (type: string, iso?: string, adm1?: string) => {
    setAsync({
      status: "Loading",
      message: "Reticulating splines...",
    });
    try {
      const boundaries = await getBoundaries({ type, iso, adm1 });

      switch (type) {
        case "iso":
          setIsoOptions(boundaries);
          break;
        // case "adm1":
        //   setAdm1Options(boundaries);
        //   break;
        // case "adm2":
        //   setAdm2Options(boundaries);
        //   break;
        default:
          break;
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

  const toggleIsoSelection = (selectedIso: Boundary) => {
    setQuery((prevQuery) => {
      const isAlreadySelected = prevQuery.iso.some(
        (iso) => iso.value === selectedIso.value
      );

      return {
        ...prevQuery,
        iso: isAlreadySelected
          ? prevQuery.iso.filter((iso) => iso.value !== selectedIso.value)
          : [...prevQuery.iso, selectedIso],
      };
    });
  };

  const selectAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      iso: isoOptions,
    }));
  };

  const clearAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      iso: [],
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[900px] flex flex-wrap gap-4">
        <div className="w-[400px] border border-gray-300">
          <div className="flex gap-4 p-3 border-b border-gray-300">
            <div
              className={`uppercase cursor-pointer ${
                activeTab === "iso"
                  ? "text-blue-500 border-b border-blue-500"
                  : ""
              }`}
            >
              Countries
            </div>
            <div
              className={`uppercase cursor-pointer ${
                activeTab === "other"
                  ? "text-blue-500 border-b border-blue-500"
                  : ""
              }`}
            >
              Other
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
            <ul>
              {isoOptions
                .filter((iso) =>
                  iso.text.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((iso) => (
                  <li
                    key={iso.key}
                    className="px-3 py-1 border-b border-gray-200 cursor-pointer flex gap-3 items-center"
                    onClick={() => toggleIsoSelection(iso)}
                  >
                    <div
                      className={`w-[14px] h-[14px] border border-gray-400 ${
                        query.iso.some(
                          (selectedIso) => selectedIso.value === iso.value
                        )
                          ? "bg-gray-400"
                          : ""
                      }`}
                    ></div>
                    <p>{iso.text}</p>
                  </li>
                ))}
            </ul>
          </div>
          <div className="p-3 flex gap-4">
            <Button fluid content="Select all" onClick={selectAll} />
            <Button fluid content="Clear all" onClick={clearAll} />
          </div>
          <div>
            <ul className="p-3 flex flex-wrap gap-2">
              {query.iso.map((iso) => (
                <li
                  key={iso.key}
                  className="flex gap-1 cursor-pointer px-2 py-1 border border-gray-300"
                  onClick={() => toggleIsoSelection(iso)}
                >
                  <Icon name="x" />
                  {iso.text}
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
