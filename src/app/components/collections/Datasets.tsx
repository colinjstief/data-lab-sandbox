import Link from "next/link";

import { getDatasets } from "@/lib/gfwDataAPI";
import { wait } from "@/lib/utils";

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

  const currentSize = meta?.size;
  const totalNumber = meta?.total_items;
  const totalPages = meta?.total_pages;

  const firstPageNumber = links?.first.match(/page\[number\]=(\d+)/);
  const firstPageSize = links?.first.match(/page\[size\]=(\d+)/);
  const prevPageNumber = links?.prev.match(/page\[number\]=(\d+)/);
  const prevPageSize = links?.prev.match(/page\[size\]=(\d+)/);
  const nextPageNumber = links?.next.match(/page\[number\]=(\d+)/);
  const nextPageSize = links?.next.match(/page\[size\]=(\d+)/);
  const lastPageNumber = links?.last.match(/page\[number\]=(\d+)/);
  const lastPageSize = links?.last.match(/page\[size\]=(\d+)/);

  return (
    <>
      <div className="mb-5">
        {datasets?.map((dataset) => {
          return <li key={dataset.dataset}>{dataset.dataset}</li>;
        })}
      </div>
      <div>
        {prevPageNumber && prevPageSize && (
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: prevPageNumber[1],
                pageSize: prevPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800"
          >
            Prev
          </Link>
        )}
        {firstPageNumber && firstPageSize && (
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: firstPageNumber[1],
                pageSize: firstPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800"
          >
            1
          </Link>
        )}

        {lastPageNumber && lastPageSize && (
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: lastPageNumber[1],
                pageSize: lastPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800"
          >
            {totalPages}
          </Link>
        )}
        {nextPageNumber && nextPageSize && (
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: nextPageNumber[1],
                pageSize: nextPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800"
          >
            Next
          </Link>
        )}
      </div>
    </>
  );
};

export default Datasets;
