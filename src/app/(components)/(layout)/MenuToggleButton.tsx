"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon, Button } from "semantic-ui-react";

const MenuToggleButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  const menu = currentParams.get("menu");

  const toggleMenu = () => {
    if (menu) {
      currentParams.delete("menu");
    } else {
      currentParams.set("menu", "visible");
    }

    const search = currentParams.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Button icon size="small" onClick={toggleMenu}>
      <Icon name="bars" />
    </Button>
  );
};

export default MenuToggleButton;
