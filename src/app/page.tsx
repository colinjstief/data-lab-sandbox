import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import Header from "@/app/(components)/(layout)/Header";
import { getAssetByType } from "@/lib/apis/contentful";
import { NextPageParams, NextPageSearchParams } from "@/lib/types";

const Home = async ({
  params,
  searchParams,
}: {
  params: NextPageParams;
  searchParams: NextPageSearchParams;
}) => {
  const session = await getServerSession(options);

  const res = await getAssetByType({ type: "page" });
  const sortedPages = res.data
    ? res.data.sort((a, b) => a.fields.order - b.fields.order)
    : [];

  return (
    <>
      <Header
        title="Welcome!"
        description="This is a place to try out the cool things the Data Lab APIs offer"
      />
      <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-5">
        {sortedPages.map((page) => {
          if (page.fields.value === "home" || page.fields.value === "signin") {
            return null;
          }

          if (
            page.fields.hide === "when-not-admin" &&
            session?.user.email !== "sky.chancy.0l@icloud.com"
          ) {
            return null;
          }

          if (page.fields.hide === "when-unauth" && !!!session) {
            return null;
          }

          if (page.fields.hide === "when-auth" && !!session) {
            return null;
          }

          return (
            <Link key={page.sys.id} href={page.fields.path}>
              <div className="bg-slate-100 p-4">
                <div className=""></div>
                <div className="">
                  <h3 className="text-lg font-bold">{page.fields.label}</h3>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Home;
