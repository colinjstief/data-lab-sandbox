import { getDataset } from "@/lib/apis/gfw";
import Header from "@/app/(components)/(layout)/Header";

interface DatasetProps {
  params: { dataset: string };
}

const Dataset = async ({ params }: DatasetProps) => {
  const { dataset } = params;

  const res = await getDataset({ dataset });
  const datasetInfo = res.data;
  console.log(datasetInfo);

  return (
    <>
      <Header
        title={datasetInfo.dataset}
        description={`Information about ${datasetInfo.dataset}`}
      />
      <div className="p-5 sm:max-w-3xl">
        <h2 className="font-bold mb-2">{dataset}</h2>
        {/* <div className="mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Identifier</h3>
          <div className="flex flex-wrap justify-end">
            {datasetInfo.created_on.split("T")[0]}
          </div>
        </div> */}
        {Object.entries(datasetInfo.metadata).map(([key, value]) => {
          return (
            <div
              key={key}
              className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between"
            >
              <h3 className="italic mb-2 pr-5">{key}</h3>
              <div className="flex flex-wrap">{value}</div>
            </div>
          );
        })}
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Is downloadable?</h3>
          <div className="flex flex-wrap justify-end">
            {datasetInfo.is_downloadable ? "Yes" : "No"}
          </div>
        </div>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Versions</h3>
          <div className="justify-end">
            {datasetInfo.versions?.map((version) => {
              return <div key={version}>{version}</div>;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dataset;
