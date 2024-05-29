"use client";

import { useState } from "react";

import ReportForm from "@/app/(components)/report/ReportForm";
import ReportMap from "@/app/(components)/report/ReportMap";

const Report = () => {
  const [theMap, setTheMap] = useState<mapboxgl.Map | null>(null);

  return (
    <div className="grid grid-cols-1 grid-rows-3 sm:grid-cols-2 sm:grid-rows-1 h-[calc(100vh-50px)] md:h-[calc(100vh-90px)]">
      <div>
        <ReportMap setTheMap={setTheMap} />
      </div>
      <div className="row-span-2 sm: row-span-1 overflow-auto p-5 flex flex-col">
        <ReportForm theMap={theMap} />
      </div>
    </div>
  );
};

export default Report;
