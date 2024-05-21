import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";
import Header from "@/app/(components)/(layout)/Header";

const NewPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter(
    (item) => item.fields.value === "vector-layer"
  );
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";
  return (
    <>
      <Header title={title} description={description} />
      <p>Page content</p>
    </>
  );
};

export default NewPage;
