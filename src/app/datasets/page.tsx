import { redirect } from "next/navigation";
import { getDatasets } from "@/lib/gfwDataAPI";
import { wait } from "@/lib/utils";

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

  await wait(4000);

  const data = await getDatasets({
    link: "",
    pageSize: 5,
    pageNumber: 1,
  });

  console.log("data =>", data);

  return <DatasetTable />;
};

export default Datasets;
