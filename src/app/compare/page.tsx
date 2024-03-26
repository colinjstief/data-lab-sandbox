import ComparisonMap from "../components/comparison-map/ComparisonMap";

const ComparePage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <ComparisonMap />;
};

export default ComparePage;
