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
          <Link
            key={page.id}
            href={page.location}
            className="text-white py-0.5"
          >
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
];
