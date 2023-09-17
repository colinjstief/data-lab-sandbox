import { redirect } from "next/navigation";
import { getDatasets } from "@/lib/gfwDataAPI";

import DatasetTable from "@/app/components/collections/DatasetTable";
import { wait } from "@/lib/utils";

const Datasets = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams?.pageSize || !searchParams?.pageNumber) {
    redirect("/datasets?pageSize=5&pageNumber=1");
  }

  const pageSize =
    typeof searchParams.pageSize === "string"
      ? Number(searchParams.pageSize)
      : 5;
  const pageNumber =
    typeof searchParams.pageNumber === "string"
      ? Number(searchParams.pageNumber)
      : 1;

  await wait(2000);

  const data = await getDatasets({
    pageSize,
    pageNumber,
  });

  console.log("data =>", data);

  return (
    <div>
      <h1>GFW Data API Datasets</h1>
      <DatasetTable />
    </div>
  );
};

export default Datasets;
