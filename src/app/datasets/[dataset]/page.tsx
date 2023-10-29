import { GFWAPIDataset } from "@/lib/types";

const Dataset = ({ params }: { params: { dataset: string } }) => {
  console.log("params =>", params);
  return <p>{params.dataset}</p>;
};

export default Dataset;
