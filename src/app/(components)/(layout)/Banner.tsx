import Link from "next/link";

import Doughnuts from "@/../public/doughnuts.svg";

interface BannerProps {}

const Banner = ({}: BannerProps) => {
  return (
    <Link data-component="Banner" href="/" className="hidden md:block">
      <div className="p-6 text-center cursor-pointer hover:cursor-pointer">
        <h1 className="text-lg capitalize text-white mb-5">Data Lab sandbox</h1>
        <Doughnuts
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>
    </Link>
  );
};

export default Banner;

// height={100}
// width={200}
// alt="Illustration of doughnut people"
// className="w-48 m-auto"
