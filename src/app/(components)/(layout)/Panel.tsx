import { getAssetByType } from "@/lib/apis/contentful";

import TopBar from "@/app/(components)/(layout)/TopBar";
import Banner from "@/app/(components)/(layout)/Banner";
import Navigation from "@/app/(components)/(layout)/Navigation";

interface PanelProps {}

const Panel = async ({}: PanelProps) => {
  const res = await getAssetByType({ type: "page" });
  const sortedPages = res.data
    ? res.data.sort((a, b) => a.fields.order - b.fields.order)
    : [];

  return (
    <div
      data-component="Panel"
      className="flex flex-col w-full md:w-48 bg-primary-blue z-999"
    >
      <TopBar />
      <Banner />
      <Navigation sortedPages={sortedPages} />
    </div>
  );
};

export default Panel;
