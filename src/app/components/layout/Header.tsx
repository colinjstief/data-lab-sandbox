"use client";

import { usePathname } from "next/navigation";

interface HeaderProps {}

const pages = {
  signin: {
    title: "Sign in",
    category: "",
    description: "Acces your stuff",
  },
  profile: {
    title: "Profile",
    category: "",
    description: "Your information",
  },
  keys: {
    title: "API Keys",
    category: "",
    description: "Manage your API keys",
  },
  datasets: {
    title: "Datasets",
    category: "",
    description: "All the GFW Data API has to offer",
  },
  map: {
    title: "Map",
    category: "",
    description: "Sandbox for geospatial layers on a map",
  },
  compare: {
    title: "Compare",
    category: "",
    description: "Comparing land cover datasets",
  },
  "query-wizard": {
    title: "Query Wizard",
    category: "",
    description: "Let's make a query together",
  },
};

const Header = ({}: HeaderProps) => {
  const pathname = usePathname();
  const section = pathname.split("/")[1];

  let category = "";
  let title = "Welcome!";
  let description =
    "This is a place to try out the cool things the Data Lab APIs offer";

  if (section in pages) {
    category = pages[section as keyof typeof pages].category;
    title = pages[section as keyof typeof pages].title;
    description = pages[section as keyof typeof pages].description;
  }

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-5">
      {category && <h2 className="uppercase text-sm mb-5">{category}</h2>}
      <h1 className="mb-1 text-3xl font-semibold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Header;
