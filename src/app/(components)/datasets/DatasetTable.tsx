import Link from "next/link";

import { getDatasets } from "@/lib/apis/gfw";

import PageSizePicker from "@/app/(components)/datasets/PageSizePicker";
import Pagination from "@/app/(components)/datasets/Pagination";

const DatasetTable = async ({
  pageSize,
  pageNumber,
}: {
  pageSize: number;
  pageNumber: number;
}) => {
  const res = await getDatasets({
    pageSize,
    pageNumber,
  });

  const datasets = res.data;
  const links = res.links;
  const meta = res.meta;

  return (
    <table className="w-full shadow-md border border-gray-300 rounded">
      <thead>
        <tr className="text-center">
          <th colSpan={3} className="p-5">
            <Pagination links={links} meta={meta} />
          </th>
          <th colSpan={1} className="p-5">
            <PageSizePicker pageSize={pageSize} />
          </th>
        </tr>
      </thead>
      <tbody>
        {datasets.map((dataset) => {
          return (
            <tr
              key={dataset.dataset}
              className="border-b flex flex-col md:table-row"
            >
              <td className="px-5 py-2 sm:max-w-[300px] break-all">
                {dataset.dataset}
              </td>
              <td className="px-5 py-2">{dataset.created_on.split("T")[0]}</td>
              <td className="px-5 py-2 max-w-[300px] break-all">
                {dataset.metadata?.title}
              </td>
              <td className="px-5 py-2">
                <Link
                  href={`/datasets/${dataset.dataset}`}
                  className="rounded border bg-gray-200 py-1 px-4 text-sm text-gray-800"
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

export default DatasetTable;
