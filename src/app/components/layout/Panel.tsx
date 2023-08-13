"use client";

import TopBar from "@/app/components/layout/TopBar";
import Banner from "@/app/components/other/Banner";
import Navigation from "@/app/components/layout/Navigation";

interface PanelProps {}

const Panel = () => {
  return (
    <div className="bg-primary-blue sm:w-48 w-full sm:h-full">
      <TopBar />
      <div>
        <Banner />
        {/* <Navigation /> */}
      </div>
    </div>
  );
};

export default Panel;
