import RasterLayer from "@/app/components/raster-layer/RasterLayer";

const RasterLayerPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <RasterLayer />;
};

export default RasterLayerPage;
