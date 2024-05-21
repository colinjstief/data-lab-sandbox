import Link from "next/link";

import { PaginationLinks, PaginationMeta } from "@/lib/types";

interface PaginationProps {
  links: PaginationLinks;
  meta: PaginationMeta;
}

const Pagination = ({ links, meta }: PaginationProps) => {
  const currentPageNumber = links.self.match(/page\[number\]=(\d+)/);
  const firstPageNumber = links.first.match(/page\[number\]=(\d+)/);
  const firstPageSize = links.first.match(/page\[size\]=(\d+)/);
  const prevPageNumber = links.prev.match(/page\[number\]=(\d+)/);
  const prevPageSize = links.prev.match(/page\[size\]=(\d+)/);
  const nextPageNumber = links.next.match(/page\[number\]=(\d+)/);
  const nextPageSize = links.next.match(/page\[size\]=(\d+)/);
  const lastPageNumber = links.last.match(/page\[number\]=(\d+)/);
  const lastPageSize = links.last.match(/page\[size\]=(\d+)/);

  const currentSize = meta.size;
  const totalNumber = meta["total_items"];
  const totalPages = meta["total_pages"];

  return (
    <ul className="flex">
      {prevPageNumber && prevPageSize && (
        <li>
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: prevPageNumber[1],
                pageSize: prevPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 py-2 px-4 mr-2 text-sm text-gray-800"
          >
            Prev
          </Link>
        </li>
      )}
      {firstPageNumber &&
        firstPageSize &&
        currentPageNumber &&
        firstPageNumber[1] !== currentPageNumber[1] && (
          <li>
            <Link
              href={{
                pathname: "/datasets",
                query: {
                  pageNumber: firstPageNumber[1],
                  pageSize: firstPageSize[1],
                },
              }}
              className="rounded border bg-gray-100 py-2 px-4 mr-2 text-sm text-gray-800"
            >
              1
            </Link>
          </li>
        )}
      {currentPageNumber && (
        <li>
          <a className="rounded border bg-gray-100 py-2 px-4 mr-2 text-sm text-gray-800">
            {currentPageNumber[1]}
          </a>
        </li>
      )}
      {lastPageNumber &&
        lastPageSize &&
        currentPageNumber &&
        lastPageNumber[1] !== currentPageNumber[1] && (
          <li>
            <Link
              href={{
                pathname: "/datasets",
                query: {
                  pageNumber: lastPageNumber[1],
                  pageSize: lastPageSize[1],
                },
              }}
              className="rounded border bg-gray-100 py-2 px-4 mr-2 text-sm text-gray-800"
            >
              {totalPages}
            </Link>
          </li>
        )}
      {nextPageNumber && nextPageSize && (
        <li>
          <Link
            href={{
              pathname: "/datasets",
              query: {
                pageNumber: nextPageNumber[1],
                pageSize: nextPageSize[1],
              },
            }}
            className="rounded border bg-gray-100 py-2 px-4 mr-2 text-sm text-gray-800"
          >
            Next
          </Link>
        </li>
      )}
    </ul>
  );
};

export default Pagination;
