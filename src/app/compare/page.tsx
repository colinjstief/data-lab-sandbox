import Compare from "@/app/components/compare/Compare";

const ComparePage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <Compare />;
};

export default ComparePage;
