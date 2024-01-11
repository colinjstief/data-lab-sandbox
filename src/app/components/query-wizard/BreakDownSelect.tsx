import { Checkbox, CheckboxProps, Segment } from "semantic-ui-react";

import { datasets } from "@/lib/datasets";
import { WizardQuery } from "@/lib/types";

interface BreakDownSelectProps {
  query: WizardQuery;
  setQuery: (query: WizardQuery) => void;
  visible: boolean;
  setVisibleTab: (tab: string) => void;
}

const BreakDownSelect = ({
  query,
  setQuery,
  visible,
  setVisibleTab,
}: BreakDownSelectProps) => {
  const handleChange = (
    e: React.SyntheticEvent<HTMLElement>,
    data: CheckboxProps
  ) => {
    if (data.checked) {
      setQuery({
        ...query,
        segmentation: [...query.segmentation, data.value as string],
      });
    } else {
      setQuery({
        ...query,
        segmentation: query.segmentation.filter(
          (segment) => segment !== data.value
        ),
      });
    }
  };

  let containerStyle = "h-full mt-0";
  if (visible) {
    containerStyle = containerStyle.concat(" flex");
  } else {
    containerStyle = containerStyle.concat(" hidden");
  }

  return (
    <Segment.Group className={containerStyle}>
      <Segment className="flex-1">
        <h3 className="text-xl font-bold mb-5">Select break downs</h3>
        <div className="flex flex-col">
          {["gadm_iso", "gadm_adm1", "gadm_adm2"].includes(query.area.type) && (
            <Checkbox
              className="mb-3"
              toggle
              label="By year"
              value="year"
              onChange={handleChange}
              checked={query.segmentation.includes("year")}
            />
          )}
          {["gadm_iso"].includes(query.area.type) && (
            <Checkbox
              className="mb-3"
              toggle
              label="By ADM1"
              value="adm1"
              onChange={handleChange}
              checked={query.segmentation.includes("adm1")}
            />
          )}
          {["gadm_iso", "gadm_adm1"].includes(query.area.type) && (
            <Checkbox
              className="mb-3"
              toggle
              label="By ADM2"
              value="adm2"
              onChange={handleChange}
              checked={query.segmentation.includes("adm2")}
            />
          )}
        </div>
      </Segment>
      <Segment className="flex justify-end">Bar</Segment>
    </Segment.Group>
  );
};

export default BreakDownSelect;
