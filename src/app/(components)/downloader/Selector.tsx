"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { AsyncStatus, Field, DownloadQuery } from "@/lib/types";

import {
  Button,
  Icon,
  Input,
  Dimmer,
  Loader,
  Segment,
  SemanticCOLORS,
} from "semantic-ui-react";

interface SelectorProps {
  asyncStatus: AsyncStatus;
  query: DownloadQuery;
  setQuery: Dispatch<SetStateAction<DownloadQuery>>;
  tabs: Array<{
    label: string;
    value: string;
    options: Field[];
    disabled?: boolean;
  }>;
  activeTabs: {
    [key: string]: string;
  };
  setActiveTabs: Dispatch<
    SetStateAction<{
      [key: string]: string;
    }>
  >;
  type: "areas" | "datasets" | "contexts" | "ranges";
  message?: string;
}

const Selector = ({
  asyncStatus,
  query,
  setQuery,
  type,
  message,
  tabs,
  activeTabs,
  setActiveTabs,
}: SelectorProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [options, setOptions] = useState<Field[]>(tabs[0].options);

  useEffect(() => {
    const newOptions = tabs.find(
      (tab) => tab.value === activeTabs[type]
    )?.options;
    setOptions(newOptions ? newOptions : []);
  }, [tabs]);

  useEffect(() => {
    setSearchText("");
  }, [activeTabs[type]]);

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
    if (type === "areas") {
      const iso = query.areas.find((area) => area.type === "iso");
      const adm1 = query.areas.find((area) => area.type === "adm1");

      if (activeTabs.areas === "adm2" && iso && adm1) {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: [iso, adm1, ...options],
        }));
      } else if (activeTabs.areas === "adm1" && iso) {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: [iso, ...options],
        }));
      } else {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: options,
        }));
      }
    } else {
      setQuery((prevQuery) => ({
        ...prevQuery,
        [type]: options,
      }));
    }
  };

  const clearAll = () => {
    if (type === "areas") {
      const iso = query.areas.find((area) => area.type === "iso");
      const adm1 = query.areas.find((area) => area.type === "adm1");
      if (activeTabs.areas === "adm2" && iso && adm1) {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: [iso, adm1],
        }));
      } else if (activeTabs.areas === "adm1" && iso) {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: [iso],
        }));
      } else {
        setQuery((prevQuery) => ({
          ...prevQuery,
          [type]: [],
        }));
      }
    } else {
      setQuery((prevQuery) => ({
        ...prevQuery,
        [type]: [],
      }));
    }
  };

  return (
    <div className="w-[400px] border border-gray-300">
      {message && (
        <div className="flex gap-4 p-3 border-b border-gray-300">{message}</div>
      )}
      <div className="flex gap-4 p-3 border-b border-gray-300">
        {tabs.map((tab) => {
          let styles;
          if (tab.disabled) {
            styles = "uppercase text-gray-400 cursor-not-allowed";
          } else if (activeTabs[type] === tab.value) {
            styles = "uppercase text-blue-500 border-b border-blue-500";
          } else {
            styles = "uppercase cursor-pointer";
          }

          return (
            <div
              key={tab.value}
              className={styles}
              onClick={() => {
                if (!tab.disabled) {
                  setActiveTabs({ ...activeTabs, [type]: tab.value });
                }
              }}
            >
              {tab.label}
            </div>
          );
        })}
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
            {query[type].map((item) => {
              let itemStyle;
              let fontColor;
              let iconColor: SemanticCOLORS;
              if (activeTabs[type] === item?.type) {
                itemStyle =
                  "flex gap-1 cursor-pointer px-2 py-1 border border-gray-400";
                fontColor = "";
                iconColor = "black";
              } else {
                itemStyle = "flex gap-1 px-2 py-1 border border-gray-200";
                fontColor = "text-slate-400";
                iconColor = "grey";
              }
              return (
                <li
                  key={item.key}
                  className={itemStyle}
                  onClick={() => {
                    if (activeTabs[type] === item?.type) {
                      toggleSelection({ selection: item });
                    }
                  }}
                >
                  <Icon name="x" color={iconColor} />
                  <span className={fontColor}>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Selector;
