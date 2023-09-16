import { redirect } from "next/navigation";
import { getDatasets } from "@/lib/gfwDataAPI";

import Header from "@/app/components/layout/Header";
import DatasetTable from "@/app/components/collections/DatasetTable";

const Datasets = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams?.pageSize || !searchParams?.pageNumber) {
    redirect("/datasets?pageSize=5&pageNumber=1");
  }

  const data = await getDatasets({
    link: "",
    pageSize: 5,
    pageNumber: 1,
  });

  console.log("data =>", data);

  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header
        title="Datasets"
        description="All that the GFW Data API has to offer"
      />
      <div className="p-5">
        <DatasetTable />
      </div>
    </main>
  );
};

export default Datasets;
