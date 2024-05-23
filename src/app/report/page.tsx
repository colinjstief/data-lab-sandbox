import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";
import Header from "@/app/(components)/(layout)/Header";
import Report from "@/app/(components)/report/Report";

const ReportPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter((item) => item.fields.value === "report");
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";
  return (
    <>
      <Header title={title} description={description} />
      <Report />
    </>
  );
};

export default ReportPage;
