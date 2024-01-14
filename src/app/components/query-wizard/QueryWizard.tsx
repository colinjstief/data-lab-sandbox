"use client";

import { useState, useEffect, useRef } from "react";

import { Step, Icon } from "semantic-ui-react";
import DataSelect from "@/app/components/query-wizard/DataSelect";
import SegmentSelect from "@/app/components/query-wizard/SegmentSelect";
import VersionSelect from "@/app/components/query-wizard/VersionSelect";
import FieldSelect from "@/app/components/query-wizard/FieldSelect";
import AreaSelect from "@/app/components/query-wizard/AreaSelect";
import Results from "@/app/components/query-wizard/Results";

import { Datasets, WizardQuery } from "@/lib/types";
import { datasets } from "@/lib/datasets";
import { selectAsset } from "@/lib/selectAsset";

interface QueryWizardProps {}

const QueryWizard = ({}: QueryWizardProps) => {
  const initOptions = {
    area: { type: "gadm_global", value: "Global", geometry: null },
    dataset: "tcl",
    timeSegment: "",
    areaSegment: "",
    asset: "gadm__tcl__iso_summary",
    version: "",
    query: "",
    params: "",
    results: "",
  };

  const [visibleTab, setVisibleTab] = useState<string>("area");
  const [options, setOptions] = useState<WizardQuery>(initOptions);

  const prevOptionsRef = useRef(options);

  // Re-select asset when area, dataset, or segments changes
  useEffect(() => {
    //console.log("options.query =>", options.query);
  }, [options]);

  // Reset segments when dataset changes
  useEffect(() => {
    const prevOptions = prevOptionsRef.current;
    prevOptionsRef.current = options;

    if (
      prevOptions.area.type !== options.area.type ||
      prevOptions.dataset !== options.dataset
    ) {
      const asset = selectAsset(options);
      setOptions({
        ...options,
        asset: asset,
        timeSegment: "",
        areaSegment: "",
        version: "",
        query: "",
      });
    }
  }, [options]);

  let breakdownLabel;
  if (options.timeSegment && options.areaSegment) {
    breakdownLabel = `By ${options.timeSegment} by ${options.areaSegment}`;
  } else if (options.timeSegment && !options.areaSegment) {
    breakdownLabel = `By ${options.timeSegment}`;
  } else if (!options.timeSegment && options.areaSegment) {
    breakdownLabel = `By ${options.areaSegment}`;
  } else {
    breakdownLabel = "No breakdown";
  }

  return (
    <div className="flex items-start h-full">
      <Step.Group vertical size="mini" className="w-[220px]">
        <Step
          onClick={() => setVisibleTab("area")}
          active={visibleTab === "area"}
        >
          <Icon name="map marker alternate" />
          <Step.Content>
            <Step.Title>Area of interest</Step.Title>
            <Step.Description>
              {!!options?.area.value
                ? options.area.value
                : "Select area of interest"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("dataset")}
          active={visibleTab === "dataset"}
          disabled={!options.area.value}
        >
          <Icon name="globe" />
          <Step.Content>
            <Step.Title>Dataset</Step.Title>
            <Step.Description>
              {datasets[options.dataset as keyof Datasets].name}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("segment")}
          active={visibleTab === "segment"}
          disabled={!options.area.value}
        >
          <Icon name="table" />
          <Step.Content>
            <Step.Title>Break down</Step.Title>
            <Step.Description>{breakdownLabel}</Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("version")}
          active={visibleTab === "version"}
          disabled={!options.area.value}
        >
          <Icon name="barcode" />
          <Step.Content>
            <Step.Title>Version</Step.Title>
            <Step.Description>
              {options?.version || "Select your version"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("field")}
          active={visibleTab === "field"}
          disabled={!options.version}
        >
          <Icon name="columns" />
          <Step.Content>
            <Step.Title>Fields</Step.Title>
            <Step.Description>
              {options.query ? "Fields selected" : "Select your fields"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("result")}
          active={visibleTab === "result"}
          disabled={!options.query || !options.version}
        >
          <Icon name="chart pie" />
          <Step.Content>
            <Step.Title>Results</Step.Title>
            <Step.Description>See the results</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
      <div className="flex-1 h-full pl-3">
        <AreaSelect
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "area"}
          setVisibleTab={setVisibleTab}
        />
        <DataSelect
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "dataset"}
          setVisibleTab={setVisibleTab}
        />
        <SegmentSelect
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "segment"}
          setVisibleTab={setVisibleTab}
        />
        <VersionSelect
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "version"}
          setVisibleTab={setVisibleTab}
        />
        <FieldSelect
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "field"}
          setVisibleTab={setVisibleTab}
        />
        <Results
          options={options}
          setOptions={setOptions}
          visible={visibleTab === "result"}
          setVisibleTab={setVisibleTab}
        />
      </div>
    </div>
  );
};

export default QueryWizard;
