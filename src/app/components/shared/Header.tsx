import * as React from "react";

interface IHeaderProps {
  title: string;
  description: string;
  category?: string;
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const { title, description, category } = props;

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-5">
      {category && <h2 className="uppercase text-sm mb-5">{category}</h2>}
      <h1 className="mb-1 text-lg font-semibold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Header;
