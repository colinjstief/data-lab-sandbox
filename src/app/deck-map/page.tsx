import DeckMap from "@/app/components/other/DeckMap";

const DeckMapPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return <DeckMap />;
};

export default DeckMapPage;
