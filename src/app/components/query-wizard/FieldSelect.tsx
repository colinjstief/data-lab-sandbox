import { useState, useEffect, use } from "react";
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

  const [filterFields, setFilterFields] = useState<Field[]>([]); // e.g. umd_tree_cover_density_2000__threshold, is__peatland
  const [filters, setFilters] = useState<
    { field: Field; operator: Field; operatorValue: Field }[]
  >([]);

  const [groupFields, setGroupFields] = useState<Field[]>([]); // tsc_tree_cover_loss_drivers__driver, year
  const [groups, setGroups] = useState<Field[]>([]);

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
          // return ["is__", "__threshold", "__type", "__driver"].some((item) => {
          //   return field.value.includes(item)
          // });
          return [
            "umd_tree_cover_density_2000__threshold",
            "is__umd_regional_primary_forest_2001",
          ].some((item) => {
            return field.value === item;
          });
        });
        const sortedFilterFields = sortByProperty(initialFilterFields, "key");

        setFilterFields(sortedFilterFields);

        const initialGroupFields = initialFields.filter((field) => {
          // return ["__type", "__driver"].some((item) => {
          //   return field.value.includes(item)
          // });
          return [
            "tsc_tree_cover_loss_drivers__driver",
            "gfw_planted_forests__type",
            "gfw_plantation__type",
          ].some((item) => {
            return field.value === item;
          });
        });
        const sortedGroupFields = sortByProperty(initialGroupFields, "key");

        setGroupFields(sortedGroupFields);

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
      let allGroups = [...groups];

      if (options.areaGroup) {
        allGroups.push({
          key: options.areaGroup,
          value: options.areaGroup,
          text: options.areaGroup,
        });
      }

      if (options.timeGroup) {
        allGroups.push({
          key: options.timeGroup,
          value: options.timeGroup,
          text: options.timeGroup,
        });
      }

      const theQuery = await constructQuery({
        options,
        stats,
        filters,
        groups: allGroups,
      });

      setOptions({
        ...options,
        query: theQuery,
        statInQuery: true,
      });
    };

    if (!!options.version && stats.length) {
      startConstructQueryRequest();
    } else {
      setOptions({
        ...options,
        query: "",
        statInQuery: false,
      });
    }
  }, [options.version, stats, filters, groups]);

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
  }, [options.asset, options.version]);

  // STATISTICS - ADD NEW STAT
  const addStat = () => {
    let field;
    if (stats.length >= statFields.length) {
      field = statFields[statFields.length - 1];
    } else {
      field = statFields[stats.length];
    }
    setStats([...stats, { stat: statChoices[0], field }]);
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

  // FILTERS - ADD OR CHANGE FILTER
  const addOrChangeFilter = ({
    action,
    i,
    newFieldValue,
  }: {
    action: string;
    i?: number;
    newFieldValue?: string;
  }) => {
    let field;
    let operator;
    let operatorValue;

    if (action === "change") {
      field = filterFields.filter(
        (filter) => filter.value === newFieldValue
      )[0];
    } else {
      if (filters.length >= filterFields.length) {
        field = filterFields[filterFields.length - 1];
      } else {
        field = filterFields[filters.length];
      }
    }

    if (field.value.includes("is__")) {
      operator = booleanOperators[0];
      operatorValue = booleanOperatorValues[0];
    }

    if (field.value.includes("__driver")) {
      operator = booleanOperators[0];
      operatorValue = driverValues[0];
    }

    if (field.value.includes("__threshold")) {
      operator = booleanOperators[0];
      operatorValue = densityThresholds[0];
    }

    const newFilter = {
      field: field as Field,
      operator: operator as Field,
      operatorValue: operatorValue as Field,
    };

    if (action === "change") {
      const newFilters = filters.map((existingFilter, index) => {
        if (index === i) {
          return newFilter;
        } else {
          return existingFilter;
        }
      });
      setFilters(newFilters);
    } else {
      setFilters([...filters, newFilter]);
    }
  };

  // FILTERS - RENDER FILTER OPERATOR
  const renderFilterOperator = ({
    filter,
    i,
  }: {
    filter: { field: Field; operator: Field; operatorValue: Field };
    i: number;
  }) => {
    const fieldValue = filter.field?.value;
    if (!fieldValue) return <p>not sure about this one...</p>;

    let operatorOptions;
    let operatorValueOptions;

    if (filter.field.value.includes("is__")) {
      operatorOptions = booleanOperators;
      operatorValueOptions = booleanOperatorValues;
    }

    if (filter.field.value.includes("__driver")) {
      operatorOptions = booleanOperators;
      operatorValueOptions = driverValues;
    }

    if (filter.field.value.includes("__threshold")) {
      operatorOptions = booleanOperators;
      operatorValueOptions = densityThresholds;
    }

    return (
      <div className="flex flex-row mx-3">
        <div className="mr-3">
          <Dropdown
            selection
            fluid
            options={operatorOptions}
            value={filter.operator?.value}
            onChange={(e, newOperator) => {
              handleFilterOperatorChange({
                i,
                field: filter.field,
                operator: {
                  key: newOperator.value as string,
                  value: newOperator.value as string,
                  text: newOperator.value as string,
                },
                operatorValue: filter.operatorValue,
              });
            }}
          />
        </div>
        <div>
          <Dropdown
            selection
            fluid
            options={operatorValueOptions}
            value={filter.operatorValue?.value}
            onChange={(e, newOperatorValue) => {
              handleFilterOperatorChange({
                i,
                field: filter.field,
                operator: filter.operator,
                operatorValue: {
                  key: newOperatorValue.value as string,
                  value: newOperatorValue.value as string,
                  text: newOperatorValue.value as string,
                },
              });
            }}
          />
        </div>
      </div>
    );
  };

  // FILTERS - REMOVE FILTER
  const removeFilter = ({ i }: { i: number }) => {
    setFilters(filters.filter((filter, index) => i !== index));
  };

  // FILTERS - HANDLE FILTER OPERATOR CHANGE
  const handleFilterOperatorChange = ({
    i,
    field,
    operator,
    operatorValue,
  }: {
    i: number;
    field: Field;
    operator: Field;
    operatorValue: Field;
  }) => {
    // console.log("i =>", i);
    // console.log("field =>", field);
    // console.log("operator =>", operator);
    // console.log("operatorValue =>", operatorValue);
    const newFilters = filters.map((existingFilter, index) => {
      if (index === i) {
        return {
          field: { key: field.value, value: field.value, text: field.value },
          operator: {
            key: operator.key,
            value: operator.value,
            text: operator.text,
          },
          operatorValue: {
            key: operatorValue.key,
            value: operatorValue.value,
            text: operatorValue.text,
          },
        };
      } else {
        return existingFilter;
      }
    });
    setFilters(newFilters);
  };

  // GROUPS - ADD NEW GROUP
  const addGroup = () => {
    let field;
    if (groups.length >= groupFields.length) {
      field = groupFields[groups.length - 1];
    } else {
      field = groupFields[groups.length];
    }
    setGroups([...groups, field]);
  };

  // GROUPS - REMOVE GROUP
  const removeGroup = ({ i }: { i: number }) => {
    setGroups(groups.filter((group, index) => i !== index));
  };

  // GROUPS - HANDLE GROUP CHANGE
  const handleGroupChange = ({
    i,
    groupValue,
  }: {
    i: number;
    groupValue: string;
  }) => {
    const newGroups = groups.map((existingGroup, index) => {
      if (index === i) {
        return { key: groupValue, value: groupValue, text: groupValue };
      } else {
        return existingGroup;
      }
    });
    setGroups(newGroups);
  };

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select your fields</h3>
        <div className="flex flex-col">
          <div className="mb-5">
            <h4 className="font-bold text-m mb-3">Statistics</h4>
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
                      className="min-w-[120px] mx-3"
                      options={statChoices}
                      value={stat.stat.value}
                      onChange={(e, newStat) => {
                        handleStatChange({
                          i,
                          statValue: newStat.value as string,
                          fieldValue: stat.field.value as string,
                        });
                      }}
                    />
                    <p className="m-0">of</p>
                    <Dropdown
                      search
                      selection
                      className="min-w-[330px] mx-3"
                      options={inputFields}
                      value={stat.field?.value}
                      onChange={(e, newField) => {
                        handleStatChange({
                          i,
                          statValue: stat.stat.value as string,
                          fieldValue: newField.value as string,
                        });
                      }}
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
            <h4 className="font-bold text-m mb-3">Filters</h4>
            <div>
              {filters.map((filter, i) => {
                return (
                  <div key={i} className="flex items-center mb-3">
                    <div>
                      <Dropdown
                        search
                        selection
                        className="min-w-[330px]"
                        options={filterFields}
                        value={filter.field?.value}
                        onChange={(e, newField) => {
                          addOrChangeFilter({
                            action: "change",
                            i,
                            newFieldValue: newField.value as string,
                          });
                        }}
                      />
                    </div>
                    {renderFilterOperator({ filter, i })}
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
            <Button
              onClick={() => addOrChangeFilter({ action: "add" })}
              className="mt-2 ml-2"
            >
              Add
            </Button>
          </div>
          <div className="mb-5">
            <h4 className="font-bold text-m mb-3">Groups</h4>
            <div>
              {options.timeGroup && (
                <div className="flex items-center mb-3">
                  <Dropdown
                    disabled
                    selection
                    className="min-w-[330px] mx-3"
                    options={[
                      {
                        key: options.timeGroup,
                        value: options.timeGroup,
                        text: options.timeGroup,
                      },
                    ]}
                    value={options.timeGroup}
                  />
                </div>
              )}
              {options.areaGroup && (
                <div className="flex items-center mb-3">
                  <Dropdown
                    disabled
                    selection
                    className="min-w-[330px] mx-3"
                    options={[
                      {
                        key: options.areaGroup,
                        value: options.areaGroup,
                        text: options.areaGroup,
                      },
                    ]}
                    value={options.areaGroup}
                  />
                </div>
              )}
              {groups.map((group, i) => {
                return (
                  <div key={i} className="flex items-center mb-3">
                    <Dropdown
                      search
                      selection
                      className="min-w-[330px] mx-3"
                      options={groupFields}
                      value={group.value}
                      onChange={(e, newGroup) => {
                        handleGroupChange({
                          i,
                          groupValue: newGroup.value as string,
                        });
                      }}
                    />
                    <Button icon size="tiny" onClick={() => removeGroup({ i })}>
                      <Icon name="delete" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <Button onClick={addGroup} className="mt-2 ml-2">
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

const booleanOperators = [{ key: "=", value: "=", text: "=" }];

const booleanOperatorValues = [
  { key: "true", value: "true", text: "true" },
  { key: "false", value: "false", text: "false" },
];

const densityThresholds = [
  { key: "10", value: "10", text: "10%" },
  { key: "15", value: "15", text: "15%" },
  { key: "20", value: "20", text: "20%" },
  { key: "25", value: "25", text: "25%" },
  { key: "30", value: "30", text: "30%" },
  { key: "50", value: "50", text: "50%" },
  { key: "75", value: "75", text: "75%" },
];

const driverValues = [
  {
    key: "Commodity driver deforestation",
    value: "Commodity driver deforestation",
    text: "Commodity driver deforestation",
  },
  { key: "Forestry", value: "Forestry", text: "Forestry" },
  {
    key: "Shifting agriculture",
    value: "Shifting agriculture",
    text: "Shifting agriculture",
  },
  { key: "Unknown", value: "Unknown", text: "Unknown" },
  { key: "Urbanization", value: "Urbanization", text: "Urbanization" },
  { key: "Wildfire", value: "Wildfire", text: "Wildfire" },
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
