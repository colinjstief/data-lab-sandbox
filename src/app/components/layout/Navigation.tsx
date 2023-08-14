import Link from "next/link";

interface NavigationProps {
  menuVisible: boolean;
}

const Navigation = ({ menuVisible }: NavigationProps) => {
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
        return (
          <Link key={page.id} href={page.location} className="text-white py-5">
            {page.label}
          </Link>
        );
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
  },
  {
    id: 2,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 3,
    label: "Home",
    location: "/",
  },
  {
    id: 4,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 5,
    label: "Home",
    location: "/",
  },
  {
    id: 6,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 7,
    label: "Home",
    location: "/",
  },
  {
    id: 8,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 9,
    label: "Home",
    location: "/",
  },
  {
    id: 10,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 11,
    label: "Home",
    location: "/",
  },
  {
    id: 12,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 13,
    label: "Home",
    location: "/",
  },
  {
    id: 14,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 15,
    label: "Home",
    location: "/",
  },
  {
    id: 16,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 17,
    label: "Home",
    location: "/",
  },
  {
    id: 18,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 19,
    label: "Home",
    location: "/",
  },
  {
    id: 20,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 21,
    label: "Home",
    location: "/",
  },
  {
    id: 22,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 23,
    label: "Home",
    location: "/",
  },
  {
    id: 24,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 25,
    label: "Home",
    location: "/",
  },
  {
    id: 26,
    label: "Datasets",
    location: "/datasets",
  },
  {
    id: 27,
    label: "Home",
    location: "/",
  },
  {
    id: 28,
    label: "Datasets",
    location: "/datasets",
  },
];
