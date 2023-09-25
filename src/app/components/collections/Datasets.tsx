import Link from "next/link";

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
    <table className="w-full">
      <thead className="mb-5 flex justify-between">
        <Pagination links={links} meta={meta} />
        <PageSizePicker pageSize={pageSize} />
      </thead>
      <tbody className="">
        {datasets?.map((dataset) => {
          return (
            <tr key={dataset.dataset} className="border-b py-2">
              <td>{dataset.dataset}</td>
              <td>{dataset.created_on.split("T")[0]}</td>
              <td>{dataset.metadata?.title}</td>
              <td>
                <Link
                  href={`/datasets/${dataset.dataset}`}
                  className="rounded border bg-gray-200 py-2 px-4 mr-2 text-sm text-gray-800"
                >
                  Details
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Datasets;
