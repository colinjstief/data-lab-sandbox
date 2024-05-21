import { redirect } from "next/navigation";

import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";
import Header from "@/app/(components)/(layout)/Header";
import DatasetTable from "@/app/(components)/datasets/DatasetTable";

const DatasetsPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  if (!searchParams.pageSize || !searchParams.pageNumber) {
    redirect("/datasets?pageSize=10&pageNumber=1");
  }

  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter((item) => item.fields.value === "datasets");
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";

  const pageSize =
    typeof searchParams.pageSize === "string"
      ? Number(searchParams.pageSize)
      : 10;
  const pageNumber =
    typeof searchParams.pageNumber === "string"
      ? Number(searchParams.pageNumber)
      : 1;

  return (
    <>
      <Header title={title} description={description} />
      <div key={Math.random()} className="p-5">
        <DatasetTable pageSize={pageSize} pageNumber={pageNumber} />
      </div>
    </>
  );
};

export default DatasetsPage;
