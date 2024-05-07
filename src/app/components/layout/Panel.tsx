"use client";

import { useState } from "react";

import TopBar from "@/app/components/layout/TopBar";
import Banner from "@/app/components/layout/Banner";
import Navigation from "@/app/components/layout/Navigation";
import { ContentfulResponse } from "@/lib/types";

interface PanelProps {
  pages: ContentfulResponse;
}

const Panel = ({ pages }: PanelProps) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const toggleMenuVisibility = () => {
    if (menuVisible) {
      setMenuVisible(false);
    } else {
      setMenuVisible(true);
    }
  };

  return (
    <div
      data-component="Panel"
      className="bg-primary-blue sm:w-48 w-full flex flex-col"
    >
      <TopBar handleClick={toggleMenuVisibility} />
      <Banner />
      <Navigation
        pages={pages}
        menuVisible={menuVisible}
        hideMenu={toggleMenuVisibility}
      />
    </div>
  );
};

export default Panel;
