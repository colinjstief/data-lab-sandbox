import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import { getAssetByType } from "@/lib/contentfulAPI";
import { ContentfulResponse } from "@/lib/types";

const Home = async () => {
  const session = await getServerSession(options);

  const pages: ContentfulResponse = await getAssetByType({ type: "page" });
  const sortedPages = pages.items.sort(
    (a, b) => a.fields.order - b.fields.order
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
    </div>
  );
};

export default Home;
