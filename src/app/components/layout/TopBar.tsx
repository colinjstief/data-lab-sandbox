"use client";

import { Icon, Button } from "semantic-ui-react";

interface TopBarProps {
  handleClick: () => void;
}

const TopBar = ({ handleClick }: TopBarProps) => {
  return (
    <div
      data-component="TopBar"
      className="bg-primary-blue flex px-6 h-16 justify-between items-center sm:hidden border-b border-[#32324b]"
    >
      <h1 className="text-lg m-0 text-white">Data Lab Sandbox</h1>
      <Button icon size="small" onClick={handleClick}>
        <Icon name="bars" />
      </Button>
    </div>
  );
};

export default TopBar;
