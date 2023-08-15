"use client";

import { useState } from "react";

import TopBar from "@/app/components/layout/TopBar";
import Banner from "@/app/components/other/Banner";
import Navigation from "@/app/components/layout/Navigation";

interface PanelProps {}

const Panel = () => {
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
      <Navigation menuVisible={menuVisible} />
    </div>
  );
};

export default Panel;
