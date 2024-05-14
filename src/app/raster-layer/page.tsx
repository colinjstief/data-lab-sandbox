import { NextPageParams, NextPageSearchParams } from "@/lib/types";

import RasterLayer from "@/app/components/raster-layer/RasterLayer";

const RasterLayerPage = ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  return <RasterLayer />;
};

export default RasterLayerPage;
