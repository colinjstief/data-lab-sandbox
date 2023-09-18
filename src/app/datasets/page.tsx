import { redirect } from "next/navigation";

import { getDatasets } from "@/lib/gfwDataAPI";

import Datasets from "@/app/components/collections/Datasets";

const DatasetsPage = async ({
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

  const data = await getDatasets({
    pageSize,
    pageNumber,
  });

  return (
    <div>
      <h1>GFW Data API Datasets</h1>
      <div className="my-5">
        <Datasets data={data} />
      </div>
    </div>
  );
};

export default DatasetsPage;
