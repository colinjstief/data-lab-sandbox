import { Icon, Button } from "semantic-ui-react";

interface TopBarProps {}

const TopBar = ({}: TopBarProps) => {
  return (
    <div className="bg-green-100 flex px-6 py-2.5 justify-between items-center sm:hidden">
      <h1 className="text-lg m-0">Data Lab Sandbox</h1>
      <Button icon size="small" onClick={() => console.log("toggle menu")}>
        <Icon name="bars" />
      </Button>
    </div>
  );
};

export default TopBar;
