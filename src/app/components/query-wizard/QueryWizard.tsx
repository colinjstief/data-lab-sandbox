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
  const initQuery = {
    area: { type: "gadm_global", value: "Global", geometry: null },
    dataset: "tcl",
    timeSegment: "",
    areaSegment: "",
    asset: "gadm__tcl__iso_summary",
    version: "",
    sql: "",
    params: "",
    results: "",
  };

  const [visibleTab, setVisibleTab] = useState<string>("area");
  const [query, setQuery] = useState<WizardQuery>(initQuery);

  const prevQueryRef = useRef(query);

  // Re-select asset when area, dataset, or segments changes
  useEffect(() => {
    console.log("query =>", query);
  }, [query]);

  // Reset segments when dataset changes
  useEffect(() => {
    const prevQuery = prevQueryRef.current;
    prevQueryRef.current = query;

    if (
      prevQuery.area.type !== query.area.type ||
      prevQuery.dataset !== query.dataset
    ) {
      const asset = selectAsset(query);
      setQuery({
        ...query,
        asset: asset,
        timeSegment: "",
        areaSegment: "",
        version: "",
        sql: "",
      });
    }
  }, [query]);

  let breakdownLabel;
  if (query.timeSegment && query.areaSegment) {
    breakdownLabel = `By ${query.timeSegment} by ${query.areaSegment}`;
  } else if (query.timeSegment && !query.areaSegment) {
    breakdownLabel = `By ${query.timeSegment}`;
  } else if (!query.timeSegment && query.areaSegment) {
    breakdownLabel = `By ${query.areaSegment}`;
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
              {!!query?.area.value
                ? query.area.value
                : "Select area of interest"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("dataset")}
          active={visibleTab === "dataset"}
          disabled={!query.area.value}
        >
          <Icon name="globe" />
          <Step.Content>
            <Step.Title>Dataset</Step.Title>
            <Step.Description>
              {datasets[query.dataset as keyof Datasets].name}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("segment")}
          active={visibleTab === "segment"}
          disabled={!query.area.value}
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
          disabled={!query.area.value}
        >
          <Icon name="barcode" />
          <Step.Content>
            <Step.Title>Version</Step.Title>
            <Step.Description>
              {query?.version || "Select your version"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("field")}
          active={visibleTab === "field"}
          disabled={!query.version}
        >
          <Icon name="columns" />
          <Step.Content>
            <Step.Title>Fields</Step.Title>
            <Step.Description>
              {query.sql ? "Fields selected" : "Select your fields"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("results")}
          active={visibleTab === "results"}
          disabled={!query.area.geometry || !query.sql}
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
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "area"}
          setVisibleTab={setVisibleTab}
        />
        <DataSelect
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "dataset"}
          setVisibleTab={setVisibleTab}
        />
        <SegmentSelect
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "segment"}
          setVisibleTab={setVisibleTab}
        />
        <VersionSelect
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "version"}
          setVisibleTab={setVisibleTab}
        />
        <FieldSelect
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "field"}
          setVisibleTab={setVisibleTab}
        />
        <Results
          query={query}
          setQuery={setQuery}
          visible={visibleTab === "results"}
          setVisibleTab={setVisibleTab}
        />
      </div>
    </div>
  );
};

export default QueryWizard;
