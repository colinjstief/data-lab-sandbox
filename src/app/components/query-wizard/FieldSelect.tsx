import { useState, useEffect } from "react";
import { Icon, Button, Dropdown, Segment } from "semantic-ui-react";

import { WizardQuery, GFWAPIField, Field } from "@/lib/types";
import { wait, sortByProperty } from "@/lib/utils";
import { getFields } from "@/lib/gfwDataAPI";
import { constructQuery } from "@/lib/constructQuery";
import { stat } from "fs";

interface FieldSelectProps {
  options: WizardQuery;
  setOptions: (options: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const FieldSelect = ({
  options,
  setOptions,
  visible,
  setVisibleTab,
}: FieldSelectProps) => {
  const [async, setAsync] = useState({
    status: "",
    message: "",
  });

  const [sumFields, setSumFields] = useState<Field[]>([]);
  const [statChoices, setStatChoices] = useState<Field[]>([]);
  const [stats, setStats] = useState<{ stat: Field; field: Field }[]>([]);
  const [filterGroupFields, setFilterGroupFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [groups, setGroups] = useState([]);

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  // LOAD FIELDS
  useEffect(() => {
    const startGetFields = async () => {
      setAsync({
        status: "Loading",
        message: "Reticulating splines...",
      });
      try {
        const apiFields: GFWAPIField[] = await getFields({
          dataset: options.asset,
          version: options.version,
        });
        if (!apiFields) throw new Error("No fields found");

        const initialFields: Field[] = apiFields.map((apiField) => {
          return {
            key: apiField.name,
            value: apiField.name,
            text: apiField.name,
          };
        });

        const initialSumFields = initialFields.filter((field) => {
          return ["__ha", "__Mg"].some((item) => {
            return field.value.includes(item);
          });
        });
        const sortedInitialSumFields = sortByProperty(initialSumFields, "key");
        setSumFields(sortedInitialSumFields);

        const initialFilterGroupFields = initialFields.filter((field) => {});

        //setFields(fields);

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

    if (options.asset && options.version) {
      startGetFields();
    }
  }, [options.asset, options.version]);

  // RESET
  useEffect(() => {
    setStats([]);
    setFilters([]);
    setGroups([]);
  }, [options.asset, options.version]);

  // CONSTRUCT SQL
  useEffect(() => {
    const startConstructQueryRequest = async () => {
      const theQuery = await constructQuery({ options, stats });
      setOptions({
        ...options,
        query: theQuery,
      });
    };
    if (stats.length > 0) {
      startConstructQueryRequest();
    }
  }, [options.version, stats, filters, groups]);

  // STATISTICS - SET OPTIONS
  useEffect(() => {
    console.log("SET OPTIONS");
    const choices = [{ key: "sum", value: "sum", text: "sum" }];

    if (!!options.asset && options.asset.includes("alert")) {
      choices.push({ key: "count", value: "count", text: "count" });
      choices.push({
        key: "coordinates",
        value: "coordinates",
        text: "coordinates",
      });
    }

    setStatChoices(choices);
  }, [options.asset, options.version]);

  // STATISTICS - ADD NEW STAT
  const addStat = () => {
    // console.log("statChoices =>", statChoices);
    // console.log("sumFields =>", sumFields);
    // if (["count", "coordinates"].some(alertStat => alertStat === statChoices[0].value) || ) {
    //   setStats([
    //     ...stats,
    //     {
    //       stat: statChoices[0],
    //       field: { key: "alerts", value: "alerts", text: "alerts" },
    //     },
    //   ]);
    // } else {
    //   setStats([
    //     ...stats,
    //     { stat: statChoices[0], field: sumFields[stats.length] },
    //   ]);
    // }
  };

  // STATISTICS - REMOVE STAT
  const removeStat = ({ i }: { i: number }) => {
    setStats(stats.filter((stat, index) => i !== index));
  };

  // STATISTICS - HANDLE STAT CHANGE
  const handleStatChange = ({
    i,
    statValue,
    fieldValue,
  }: {
    i: number;
    statValue: string;
    fieldValue: string;
  }) => {
    const newStats = stats.map((existingStat, index) => {
      if (index === i) {
        if (statValue !== "sum") {
          return {
            stat: { key: statValue, value: statValue, text: statValue },
            field: { key: "alerts", value: "alerts", text: "alerts" },
          };
        } else {
          if (fieldValue === "alerts") {
            return {
              stat: { key: statValue, value: statValue, text: statValue },
              field: { key: "alerts", value: "alerts", text: "alerts" },
            };
          } else {
            return {
              stat: { key: statValue, value: statValue, text: statValue },
              field: { key: fieldValue, value: fieldValue, text: fieldValue },
            };
          }
        }
      } else {
        return existingStat;
      }
    });
    setStats(newStats);
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select your fields</h3>
        <div className="flex flex-col">
          <div className="mb-5">
            <h4 className="text-m mb-3">
              What statistics are you interested in?
            </h4>
            <div>
              {stats.map((stat, i) => {
                let inputFields;
                console.log("stat.stat.value", stat.stat.value);
                if (stat.stat.value === "sum") {
                  inputFields = sumFields;
                } else {
                  inputFields = [
                    { key: "alerts", value: "alerts", text: "alerts" },
                  ];
                }
                return (
                  <div key={i} className="flex items-center mb-3">
                    <p className="m-0">The</p>
                    <Dropdown
                      search
                      selection
                      options={statChoices}
                      value={stat.stat.value}
                      onChange={(e, newStat) => {
                        console.log("newStat", newStat);
                        console.log("stat", stat);
                        handleStatChange({
                          i,
                          statValue: newStat.value as string,
                          fieldValue: stat.field.value as string,
                        });
                      }}
                      className="min-w-[120px] mx-3"
                    />
                    <p className="m-0">of</p>
                    <Dropdown
                      search
                      selection
                      options={inputFields}
                      value={stat.field?.value}
                      onChange={(e, newField) => {
                        handleStatChange({
                          i,
                          statValue: stat.stat.value as string,
                          fieldValue: newField.value as string,
                        });
                      }}
                      className="min-w-[330px] mx-3"
                    />

                    <Button icon size="tiny" onClick={() => removeStat({ i })}>
                      <Icon name="delete" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button onClick={addStat} className="mt-2 ml-2">
              Add
            </Button>
          </div>
          <div className="mb-5">Filters</div>
          <div className="mb-5">Groups</div>
        </div>
      </Segment>
      <Segment>
        <div className="p-4 bg-slate-200">
          <span className="font-mono">{options.query}</span>
        </div>
      </Segment>
      <Segment className="flex justify-end">
        <Button
          disabled={!options.query}
          onClick={() => setVisibleTab("result")}
        >
          Next
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default FieldSelect;

const booleanParams = [
  { key: "true", value: "= 'true'", text: "true" },
  { key: "false", value: "= 'false'", text: "false" },
];
const equalityParams = [
  { key: "equals", value: "=", text: "equals" },
  { key: "not_equal", value: "!=", text: "does not equal" },
];
const existenceParams = [
  { key: "not_null", value: "IS NOT NULL", text: "IS NOT NULL" },
  { key: "null", value: "IS NULL", text: "IS NULL" },
];
const dateParams = [
  { key: "before", value: "<", text: "before" },
  { key: "after", value: ">", text: "after" },
  { key: "between", value: "between", text: "between" },
];
