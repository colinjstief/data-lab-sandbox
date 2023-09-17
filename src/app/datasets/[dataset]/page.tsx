import Header from "@/app/components/layout/Header";

const Dataset = ({ params }: { params: { dataset: string } }) => {
  const { dataset } = params;

  return <p>Datset here</p>;
};

export default Dataset;
