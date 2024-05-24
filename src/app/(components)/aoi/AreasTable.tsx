"use client";

import { RWAPIArea } from "@/lib/types";
import MapImage from "@/app/(components)/aoi/MapImage";

const AreasTable = ({
  userAreas = [],
  selectedArea,
  setSelectedArea,
}: {
  userAreas: RWAPIArea[];
  selectedArea: RWAPIArea | null;
  setSelectedArea: (area: RWAPIArea) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {userAreas.map((area) => {
        const selected = area.id === selectedArea?.id;
        return (
          <button
            key={area.id}
            className={`flex border border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${
              selected &&
              "cursor-default border-2 border-blue-400 hover:bg-inherit"
            }`}
            onClick={() => setSelectedArea(area)}
          >
            <MapImage userArea={area} />
            <div className="p-4 text-left">
              <h2>{`Area ID: ${area.id}`}</h2>
              <h2>{`Geostore ID: ${area.attributes.geostore}`}</h2>
              <p>{`Created: ${area.attributes.createdAt}`}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AreasTable;
