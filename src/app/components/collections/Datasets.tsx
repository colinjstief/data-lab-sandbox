import Link from "next/link";

import { GFWAPIDatasets } from "@/lib/types";

interface DatasetsProps {
  data: GFWAPIDatasets;
}

const Datasets = async ({ data }: DatasetsProps) => {
  const datasets = data.data;
  const links = data.links;
  const meta = data.meta;

  const currentSize = meta.size;
  const totalNumber = meta.total_items;
  const totalPages = meta.total_pages;

  const firstPageNumber = links.first.match(/page\[number\]=(\d+)/);
  const firstPageSize = links.first.match(/page\[size\]=(\d+)/);
  const prevPageNumber = links.prev.match(/page\[number\]=(\d+)/);
  const prevPageSize = links.prev.match(/page\[size\]=(\d+)/);
  const nextPageNumber = links.next.match(/page\[number\]=(\d+)/);
  const nextPageSize = links.next.match(/page\[size\]=(\d+)/);
  const lastPageNumber = links.last.match(/page\[number\]=(\d+)/);
  const lastPageSize = links.last.match(/page\[size\]=(\d+)/);

  return (
    <>
      <div className="mb-5">
        {datasets.map((dataset) => {
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

// const Page = async ({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) => {
//   const page =
//     typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
//   const limit =
//     typeof searchParams.limit === "string" ? Number(searchParams.limit) : 10;

//   const search =
//     typeof searchParams.search === "string" ? searchParams.search : undefined;

//   const promise = getMovies({ page, limit, query: search });

//   return (
//     <section className="py-24" key={uuid()}>
//       <div className="container">
//         <div className="mb-12 flex items-center justify-between gap-x-16">
//           <h1 className="text-3xl font-bold">Movies</h1>

//           <div className="grow">
//             <Search search={search} />
//           </div>

//           <div className="flex space-x-6">
//             <Link
//               href={{
//                 pathname: "/movies",
//                 query: {
//                   ...(search ? { search } : {}),
//                   page: page > 1 ? page - 1 : 1,
//                 },
//               }}
//               className={clsx(
//                 "rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800",
//                 page <= 1 && "pointer-events-none opacity-50"
//               )}
//             >
//               Previous
//             </Link>
//             <Link
//               href={{
//                 pathname: "/movies",
//                 query: {
//                   ...(search ? { search } : {}),
//                   page: page + 1,
//                 },
//               }}
//               className="rounded border bg-gray-100 px-3 py-1 text-sm text-gray-800"
//             >
//               Next
//             </Link>
//           </div>
//         </div>

//         <Suspense fallback={<Skeleton />}>
//           <Await promise={promise}>
//             {({ movies }) => <Movies movies={movies} />}
//           </Await>
//         </Suspense>
//       </div>
//     </section>
//   );
// };

export default Datasets;
