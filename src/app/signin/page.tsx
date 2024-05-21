import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";

import Header from "@/app/(components)/(layout)/Header";
import SigninForm from "@/app/(components)/(auth)/SigninForm";

const SigninPage = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const res = await getAssetByType({ type: "page" });
  const thisPage = res.data.filter((item) => item.fields.value === "signin");
  const title = thisPage.length > 0 ? thisPage[0].fields.label : "Loading...";
  const description =
    thisPage.length > 0 ? thisPage[0].fields.description : "Loading...";

  return (
    <>
      <Header title={title} description={description} />
      <div className="p-5 sm:mx-auto sm:max-w-lg">
        <SigninForm />
      </div>
    </>
  );
};

export default SigninPage;
