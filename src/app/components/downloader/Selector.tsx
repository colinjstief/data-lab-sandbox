"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";

import {
  Button,
  Icon,
  Input,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";

interface SelectorProps {
  asyncStatus: AsyncStatus;
  options: Field[];
  query: DownloadQuery;
  setQuery: Dispatch<SetStateAction<DownloadQuery>>;
  type: "area" | "dataset" | "context" | "range";
}

const Selector = ({
  asyncStatus,
  options,
  query,
  setQuery,
  type,
}: SelectorProps) => {
  //const [activeTabs, setActiveTab] = useState<string>("iso");
  const [searchText, setSearchText] = useState("");

  const toggleSelection = ({ selection }: { selection: Field }) => {
    setQuery((prevQuery) => {
      const isAlreadySelected = prevQuery[type].some(
        (item) => item.value === selection.value
      );

      return {
        ...prevQuery,
        [type]: isAlreadySelected
          ? prevQuery[type].filter((item) => item.value !== selection.value)
          : [...prevQuery[type], selection],
      };
    });
  };

  const selectAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: options,
    }));
  };

  const clearAll = () => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [type]: [],
    }));
  };

  return (
    <div className="w-[400px] border border-gray-300">
      {/* <div className="flex gap-4 p-3 border-b border-gray-300">Tabs</div> */}
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
        {asyncStatus.status === "Loading" ? (
          <Segment className="h-full">
            <Dimmer active inverted>
              <Loader inverted>Reticulating splines...</Loader>
            </Dimmer>
          </Segment>
        ) : asyncStatus.status === "Failed" ? (
          <p>{asyncStatus.message}</p>
        ) : (
          <ul>
            {options
              .filter((option) =>
                option.text.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((option) => (
                <li
                  key={option.key}
                  className="px-3 py-1 border-b border-gray-200 cursor-pointer flex gap-3 items-center"
                  onClick={() => toggleSelection({ selection: option })}
                >
                  <div
                    className={`w-[14px] h-[14px] border border-gray-400 ${
                      query[type].some(
                        (selection) => selection.value === option.value
                      )
                        ? "bg-gray-400"
                        : ""
                    }`}
                  ></div>
                  <p>{option.text}</p>
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="p-3 flex gap-4 border-b border-gray-300">
        <Button fluid content="Select all" onClick={() => selectAll()} />
        <Button fluid content="Clear all" onClick={() => clearAll()} />
      </div>
      {query[type].length > 0 && (
        <div className="max-h-[120px] overflow-auto">
          <ul className="p-3 flex flex-wrap gap-2">
            {query[type].map((item) => (
              <li
                key={item.key}
                className="flex gap-1 cursor-pointer px-2 py-1 border border-gray-300"
                onClick={() => toggleSelection({ selection: item })}
              >
                <Icon name="x" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Selector;
