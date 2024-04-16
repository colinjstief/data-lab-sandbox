import VectorLayer from "@/app/components/vector-layer/VectorLayer";

const VectorLayerPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <VectorLayer />;
};

export default VectorLayerPage;
