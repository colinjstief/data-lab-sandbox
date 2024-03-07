import { useState, useEffect } from "react";
import { Icon, Button, Dropdown, Segment } from "semantic-ui-react";

import { WizardQuery, GFWAPIField, Field } from "@/lib/types";
import { wait, sortByProperty } from "@/lib/utils";
import { getFields } from "@/lib/gfwDataAPI";
import { constructQuery } from "@/lib/constructQuery";

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

  const [statChoices, setStatChoices] = useState<Field[]>([]); // e.g. sum, mean, count, coordinates
  const [statFields, setstatFields] = useState<Field[]>([]); // e.g. umd_tree_cover_loss__ha, area__ha
  const [stats, setStats] = useState<{ stat: Field; field: Field }[]>([]);

  const [filterChoices, setFilterChoices] = useState<Field[]>([]); // e.g. =, !=, IS NOT NULL, IS NULL
  const [filterFields, setFilterFields] = useState<Field[]>([]); // e.g. umd_tree_cover_density__threshold, is__peatland
  const [filters, setFilters] = useState<{ operator: Field; field: Field }[]>(
    []
  );

  // const [groupFields, setGroupFields] = useState<Field[]>([]); // tsc_tree_cover_loss_drivers__driver, year
  // const [groups, setGroups] = useState([]);

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

        // console.log("apiFields =>", apiFields);

        const initialFields: Field[] = apiFields.map((apiField) => {
          return {
            key: apiField.name,
            value: apiField.name,
            text: apiField.name,
          };
        });

        const initialStatFields = initialFields.filter((field) => {
          // return ["__ha", "__Mg"].some((item) => {
          //   return field.value.includes(item)
          // });
          return [
            "umd_tree_cover_loss__ha",
            "umd_tree_cover_loss_from_fires__ha",
            "whrc_aboveground_co2_stock_2000__Mg",
          ].some((item) => {
            return field.value === item;
          });
        });
        const sortedInitialStatFields = sortByProperty(
          initialStatFields,
          "key"
        );
        setstatFields(sortedInitialStatFields);

        const initialFilterFields = initialFields.filter((field) => {
          // return ["is__", "__type", "__threshold"].some((item) => {
          //   return field.value.includes(item)
          // });
          return ["umd_tree_cover_density__threshold"].some((item) => {
            return field.value === item;
          });
        });
        const sortedFilterFields = sortByProperty(initialFilterFields, "key");
        setFilterFields(sortedFilterFields);

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
  }, [options.asset, options.version]);

  // CONSTRUCT SQL
  useEffect(() => {
    const startConstructQueryRequest = async () => {
      const theQuery = await constructQuery({
        options,
        stats,
        filters: [],
        groups: [],
      });
      // console.log("theQuery =>", theQuery);
      setOptions({
        ...options,
        query: theQuery,
      });
    };
    if (!!options.version && !!stats) {
      startConstructQueryRequest();
    }
  }, [options.version, stats, filters]);

  // SET CHOICES
  useEffect(() => {
    // const statChoices = [
    //   { key: "sum", value: "sum", text: "sum" },
    //   { key: "mean", value: "mean", text: "mean" },
    // ];

    // if (!!options.asset && options.asset.includes("alert")) {
    //   statChoices.push({ key: "count", value: "count", text: "count" });
    //   statChoices.push({
    //     key: "coordinates",
    //     value: "coordinates",
    //     text: "coordinates",
    //   });
    // }

    setStatChoices([
      { key: "sum", value: "sum", text: "sum" },
      { key: "mean", value: "mean", text: "mean" },
    ]);

    setFilterChoices([{ key: "equals", value: "=", text: "equals" }]);
  }, [options.asset, options.version]);

  // STATISTICS - ADD NEW STAT
  const addStat = () => {
    setStats([
      ...stats,
      { stat: statChoices[0], field: statFields[stats.length] },
    ]);
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

  // FILTERS - ADD NEW FILTER
  const addFilter = () => {
    setFilters([
      ...filters,
      { operator: filterChoices[0], field: filterFields[filters.length] },
    ]);
  };

  // FILTERS - REMOVE FILTER
  const removeFilter = ({ i }: { i: number }) => {
    setFilters(filters.filter((filter, index) => i !== index));
  };

  // FILTERS - HANDLE FILTER CHANGE
  const handleFilterChange = ({
    i,
    operator,
    field,
  }: {
    i: number;
    operator: Field;
    field: Field;
  }) => {
    const newFilters = filters.map((existingFilter, index) => {
      if (index === i) {
        return {
          operator: {
            key: operator.key,
            value: operator.value,
            text: operator.text,
          },
          field: { key: field.value, value: field.value, text: field.value },
        };
      } else {
        return existingFilter;
      }
    });
    setFilters(newFilters);
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select your fields</h3>
        <div className="flex flex-col">
          <div className="mb-5">
            <h4 className="text-m mb-3">Statistics</h4>
            <div>
              {stats.map((stat, i) => {
                let inputFields;
                if (stat.stat.value === "sum") {
                  inputFields = statFields;
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
          <div className="mb-5">
            <h4 className="text-m mb-3">Filters</h4>
            <div>
              {filters.map((filter, i) => {
                return (
                  <div key={i} className="flex items-center mb-3">
                    <Dropdown
                      search
                      selection
                      options={filterFields}
                      value={filter.field?.value}
                      onChange={(e, newField) => {
                        handleFilterChange({
                          i,
                          operator: filter.operator as Field,
                          field: newField as Field,
                        });
                      }}
                      className="min-w-[330px] mx-3"
                    />
                    <Dropdown
                      search
                      selection
                      options={filterChoices}
                      value={filter.operator.value}
                      onChange={(e, newOperator) => {
                        handleFilterChange({
                          i,
                          operator: newOperator as Field,
                          field: filter.field as Field,
                        });
                      }}
                      className="min-w-[120px] mx-3"
                    />
                    <Button
                      icon
                      size="tiny"
                      onClick={() => removeFilter({ i })}
                    >
                      <Icon name="delete" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button onClick={addFilter} className="mt-2 ml-2">
              Add
            </Button>
          </div>
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

const booleanOperators = [
  { key: "true", value: "= 'true'", text: "true" },
  { key: "false", value: "= 'false'", text: "false" },
];
const existenceOperators = [
  { key: "equals", value: "=", text: "equals" },
  { key: "not_equal", value: "!=", text: "does not equal" },
  { key: "not_null", value: "IS NOT NULL", text: "IS NOT NULL" },
  { key: "null", value: "IS NULL", text: "IS NULL" },
];
const dateOperators = [
  { key: "before", value: "<", text: "before" },
  { key: "after", value: ">", text: "after" },
  { key: "between", value: "between", text: "between" },
];
