import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";
import Header from "@/app/(components)/(layout)/Header";
import KeyTable from "@/app/(components)/api-keys/KeyTable";
import KeyForm from "@/app/(components)/api-keys/KeyForm";

const APIKeysPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter((item) => item.fields.value === "api-keys");
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";

  return (
    <>
      <Header title={title} description={description} />
      <div className="flex flex-col gap-5 p-5">
        \
        <KeyForm />
        <KeyTable />
      </div>
    </>
  );
};

export default APIKeysPage;
