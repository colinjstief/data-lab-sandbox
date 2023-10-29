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
      <thead>
        <tr>
          <th colSpan={3} className="pb-6">
            <Pagination links={links} meta={meta} />
          </th>
          <th colSpan={1} className="pb-6">
            <PageSizePicker pageSize={pageSize} />
          </th>
        </tr>
      </thead>
      <tbody className="">
        {datasets?.map((dataset) => {
          console.log("dataset =>", dataset);
          return (
            <tr key={dataset.dataset} className="border-b py-2">
              <td className="p-3 max-w-[300px] break-all">{dataset.dataset}</td>
              <td className="p-3">{dataset.created_on.split("T")[0]}</td>
              <td className="p-3 max-w-[300px]">{dataset.metadata?.title}</td>
              <td className="p-3">
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
