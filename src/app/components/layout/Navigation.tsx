import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

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
        if (page.protected && status !== "authenticated") {
          return null;
        }

        if (page.label.toLowerCase() === section) {
          return (
            <Link key={page.id} href={page.location} className="text-white">
              <u>{page.label}</u>
            </Link>
          );
        } else {
          return (
            <Link key={page.id} href={page.location} className="text-white">
              {page.label}
            </Link>
          );
        }
      })}
    </nav>
  );
};

export default Navigation;

const pages = [
  {
    id: 1,
    label: "Home",
    location: "/",
    protected: false,
  },
  {
    id: 2,
    label: "Datasets",
    location: "/datasets",
    protected: false,
  },
  {
    id: 3,
    label: "Profile",
    location: "/profile",
    protected: true,
  },
];
