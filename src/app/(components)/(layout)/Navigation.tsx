"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

import { ContentfulAsset } from "@/lib/types";

interface NavigationProps {
  sortedPages: ContentfulAsset[];
}

const Navigation = ({ sortedPages }: NavigationProps) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split("/")[1];

  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  const menu = currentParams.get("menu");
  const styles = `${
    !menu ? "hidden" : ""
  } absolute top-[50px] inset-x-0 md:visible md:static md:flex md:flex-col bg-primary-blue py-6 px-6 z-[999] overflow-auto`;

  const hideMenu = () => {
    currentParams.delete("menu");

    const search = currentParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <nav data-component="Navigation" className={styles}>
      {sortedPages.length &&
        sortedPages.map((page) => {
          if (
            page.fields.hide === "when-not-admin" &&
            session?.user.email !== "sky.chancy.0l@icloud.com"
          ) {
            return null;
          }

          if (
            page.fields.hide === "when-unauth" &&
            status !== "authenticated"
          ) {
            return null;
          }

          if (page.fields.hide === "when-auth" && status === "authenticated") {
            return null;
          }

          return (
            <Link
              key={page.sys.id}
              href={page.fields.path}
              className="text-white hover:font-bold"
              onClick={() => hideMenu()}
            >
              <div className="text-xl py-4 justify-center flex sm:text-base sm:py-0 sm:justify-start sm:block">
                {page.fields.value === section ? (
                  <b>{page.fields.label}</b>
                ) : (
                  <span>{page.fields.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      {status === "authenticated" && (
        <button
          className="text-xl py-4 justify-center flex sm:text-base sm:py-0 sm:justify-start sm:block text-white hover:font-bold text-left"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      )}
    </nav>
  );
};

export default Navigation;
