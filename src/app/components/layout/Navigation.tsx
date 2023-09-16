import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import Link from "next/link";

interface NavigationProps {
  menuVisible: boolean;
}

const Navigation = ({ menuVisible }: NavigationProps) => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const section = pathname.split("/")[1];

  let styles;
  if (menuVisible) {
    styles = "visible";
  } else {
    styles = "hidden";
  }

  styles = styles.concat(
    " bg-primary-blue py-6 px-6 flex-col sm:static flex sm:flex absolute inset-x-0 top-16"
  );

  return (
    <nav data-component="Navigation" className={styles}>
      {pages.map((page) => {
        if (page.hide === "when-unauth" && status !== "authenticated") {
          return null;
        }

        if (page.hide === "when-auth" && status === "authenticated") {
          return null;
        }

        if (page.label.toLowerCase().replaceAll(" ", "") === section) {
          return (
            <Link
              key={page.id}
              href={page.location}
              className="text-white hover:text-white"
            >
              <b>{page.label}</b>
            </Link>
          );
        } else {
          return (
            <Link
              key={page.id}
              href={page.location}
              className="text-white hover:text-white"
            >
              {page.label}
            </Link>
          );
        }
      })}
      {status === "authenticated" && (
        <button
          className="text-white hover:text-white text-left"
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
    label: "Datasets",
    location: "/datasets?pageSize=5&pageNumber=1",
    hide: "no",
  },
  {
    id: 3,
    label: "Sign in",
    location: "/signin",
    hide: "when-auth",
  },
  {
    id: 4,
    label: "Profile",
    location: "/profile",
    hide: "when-unauth",
  },
];
