"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import Link from "next/link";

interface NavigationProps {
  menuVisible: boolean;
  hideMenu: () => void;
}

const Navigation = ({ menuVisible, hideMenu }: NavigationProps) => {
  const { data: session, status } = useSession();
  console.log("status =>", status);
  console.log("session =>", session);

  const pathname = usePathname();
  const section = pathname.split("/")[1];

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
      {pages.map((page) => {
        if (
          page.hide === "when-not-admin" &&
          session?.user.email !== "sky.chancy.0l@icloud.com"
        ) {
          return null;
        }

        if (page.hide === "when-unauth" && status !== "authenticated") {
          return null;
        }

        if (page.hide === "when-auth" && status === "authenticated") {
          return null;
        }

        return (
          <div
            key={page.id}
            className="text-xl py-4 justify-center flex sm:text-base sm:py-0 sm:justify-start sm:block"
          >
            <Link
              href={page.location}
              className="text-white hover:font-bold"
              onClick={() => hideMenu()}
            >
              {page.label.toLowerCase().replaceAll(" ", "-") === section ? (
                <b>{page.label}</b>
              ) : (
                <span>{page.label}</span>
              )}
            </Link>
          </div>
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

const pages = [
  {
    id: 1,
    label: "Home",
    location: "/",
    hide: "no",
  },
  {
    id: 2,
    label: "Sign in",
    location: "/signin",
    hide: "when-auth",
  },
  {
    id: 3,
    label: "Profile",
    location: "/profile",
    hide: "when-unauth",
  },
  {
    id: 4,
    label: "API Keys",
    location: "/api-keys",
    hide: "when-unauth",
  },
  {
    id: 5,
    label: "Datasets",
    location: "/datasets?pageSize=10&pageNumber=1",
    hide: "no",
  },
  {
    id: 6,
    label: "Vector Layer",
    location: "/vector-layer",
    hide: "no",
  },
  {
    id: 7,
    label: "Compare",
    location: "/compare",
    hide: "no",
  },
  {
    id: 8,
    label: "Query Wizard",
    location: "/query-wizard",
    hide: "no",
  },
  {
    id: 9,
    label: "Download Stats",
    location: "/download",
    hide: "no",
  },
  {
    id: 10,
    label: "Tile export",
    location: "/tile-export",
    hide: "no",
  },
  {
    id: 11,
    label: "Chat Map",
    location: "/chat-map",
    hide: "no",
  },
  {
    id: 12,
    label: "Deck Map",
    location: "/deck-map",
    hide: "when-not-admin",
  },
];
