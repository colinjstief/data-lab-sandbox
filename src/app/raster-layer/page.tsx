import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";
import Header from "@/app/(components)/(layout)/Header";
import RasterLayer from "@/app/(components)/raster-layer/RasterLayer";

const RasterLayerPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter(
    (item) => item.fields.value === "raster-layer"
  );
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";
  return (
    <>
      <Header title={title} description={description} />
      <RasterLayer />
    </>
  );
};

export default RasterLayerPage;
