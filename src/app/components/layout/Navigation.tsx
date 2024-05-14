"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { ContentfulResponse } from "@/lib/types";

interface NavigationProps {
  pages: ContentfulResponse;
  menuVisible: boolean;
  hideMenu: () => void;
}

const Navigation = ({ pages, menuVisible, hideMenu }: NavigationProps) => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const section = pathname.split("/")[1];

  const sortedPages = pages.items.sort(
    (a, b) => a.fields.order - b.fields.order
  );

  let styles;
  if (menuVisible) {
    styles = "visible";
  } else {
    styles = "hidden";
  }

  styles = styles.concat(
    " bg-primary-blue py-6 px-6 flex-col sm:static flex sm:flex absolute inset-x-0 top-16 z-10"
  );

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
