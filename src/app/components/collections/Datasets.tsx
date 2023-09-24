import { getDatasets } from "@/lib/gfwDataAPI";

import PageSizePicker from "@/app/components/other/PageSizePicker";
import Pagination from "@/app/components/other/Pagination";

const Datasets = async ({
  pageSize,
  pageNumber,
}: {
  pageSize: number;
  pageNumber: number;
}) => {
  const data = await getDatasets({
    pageSize,
    pageNumber,
  });

  const datasets = data?.data;
  const links = data?.links;
  const meta = data?.meta;

  return (
    <>
      <div className="mb-5">
        {datasets?.map((dataset) => {
          return <li key={dataset.dataset}>{dataset.dataset}</li>;
        })}
      </div>
      <div className="flex justify-between">
        <div>
          <PageSizePicker pageSize={pageSize} />
        </div>
        <div>
          <Pagination links={links} meta={meta} />
        </div>
      </div>
    </>
  );
};

export default Datasets;
