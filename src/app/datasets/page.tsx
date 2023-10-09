import { redirect } from "next/navigation";

import { Suspense } from "react";

import Datasets from "@/app/components/collections/Datasets";
import LoadingScreen from "@/app/components/other/LoadingScreen";

const DatasetsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  if (!searchParams?.pageSize || !searchParams?.pageNumber) {
    redirect("/datasets?pageSize=10&pageNumber=1");
  }

  const pageSize =
    typeof searchParams.pageSize === "string"
      ? Number(searchParams.pageSize)
      : 10;
  const pageNumber =
    typeof searchParams.pageNumber === "string"
      ? Number(searchParams.pageNumber)
      : 1;

  return (
    <div key={Math.random()}>
      <Suspense fallback={<LoadingScreen stack={1} />}>
        <Datasets pageSize={pageSize} pageNumber={pageNumber} />
      </Suspense>
    </div>
  );
};

export default DatasetsPage;
