import TileExport from "@/app/components/tile-export/TileExport";

const TileExportPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <TileExport />;
};

export default TileExportPage;
