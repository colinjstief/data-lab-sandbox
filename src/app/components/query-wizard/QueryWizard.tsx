"use client";

import { useState } from "react";

import { Step, Icon } from "semantic-ui-react";
import DataSelect from "@/app/components/query-wizard/DataSelect";
import VersionSelect from "@/app/components/query-wizard/VersionSelect";
import FieldSelect from "@/app/components/query-wizard/FieldSelect";
import AreaSelect from "@/app/components/query-wizard/AreaSelect";
import Results from "@/app/components/query-wizard/Results";

import { datasets } from "@/lib/datasets";

console.log("datasets => ", datasets);

interface QueryWizardProps {}

const QueryWizard = ({}: QueryWizardProps) => {
  const initQuery = {
    dataset: null,
    version: null,
    sql: null,
    area: null,
    params: null,
    results: null,
  };

  const [visibleTab, setVisibleTab] = useState("dataset");
  const [query, setQuery] = useState(initQuery);

  return (
    <div className="flex items-start h-full">
      <Step.Group vertical size="mini">
        <Step
          onClick={() => setVisibleTab("dataset")}
          active={visibleTab === "dataset"}
        >
          <Icon name="globe" />
          <Step.Content>
            <Step.Title>Dataset</Step.Title>
            <Step.Description>
              {query?.dataset || "Select your dataset"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("version")}
          active={visibleTab === "version"}
          disabled={!query.dataset}
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
          onClick={() => setVisibleTab("area")}
          active={visibleTab === "area"}
          disabled={!query.sql}
        >
          <Icon name="map marker alternate" />
          <Step.Content>
            <Step.Title>Dataset</Step.Title>
            <Step.Description>
              {!!query?.area ? query.area : "Select an area of interest"}
            </Step.Description>
          </Step.Content>
        </Step>
        <Step
          onClick={() => setVisibleTab("results")}
          active={visibleTab === "results"}
          disabled={!query.area}
        >
          <Icon name="chart pie" />
          <Step.Content>
            <Step.Title>Dataset</Step.Title>
            <Step.Description>See the results</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
      <div className="flex-1 h-full">
        <DataSelect visible={visibleTab === "dataset"} />
        <VersionSelect visible={visibleTab === "version"} />
        <FieldSelect visible={visibleTab === "field"} />
        <AreaSelect visible={visibleTab === "area"} />
        <Results visible={visibleTab === "results"} />
      </div>
    </div>
  );
};

export default QueryWizard;
