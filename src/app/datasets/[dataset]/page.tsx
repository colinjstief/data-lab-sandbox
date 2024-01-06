import { getDataset } from "@/lib/gfwDataAPI";

interface DatasetProps {}

const Dataset = async ({
  props,
  params,
}: {
  props: DatasetProps;
  params: { dataset: string };
}) => {
  const { dataset } = params;

  const data = await getDataset({ dataset });
  console.log("data =>", data);

  return (
    <div className="flex flex-col shadow-md border border-gray-300 rounded">
      <div className="p-5 border-b border-gray-300">
        <h2 className="font-bold mb-2">{dataset}</h2>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Identifier</h3>
          <div className="flex flex-wrap justify-end">
            {data.created_on.split("T")[0]}
          </div>
        </div>
        {Object.entries(data.metadata).map(([key, value]) => {
          return (
            <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
              <h3 className="italic mb-2 pr-5">{key}</h3>
              <div className="flex flex-wrap">{value}</div>
            </div>
          );
        })}
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Is downloadable?</h3>
          <div className="flex flex-wrap justify-end">
            {data.is_downloadable ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dataset;
