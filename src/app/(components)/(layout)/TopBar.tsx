import MenuToggleButton from "@/app/(components)/(layout)/MenuToggleButton";

interface TopBarProps {}

const TopBar = ({}: TopBarProps) => {
  return (
    <div
      data-component="TopBar"
      className="md:hidden bg-primary-blue flex px-6 h-[50px] justify-between items-center  border-b border-[#32324b]"
    >
      <h1 className="text-lg m-0 text-white">Data Lab Sandbox</h1>
      <MenuToggleButton />
    </div>
  );
};

export default TopBar;
