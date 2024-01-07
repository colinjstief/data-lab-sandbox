"use client";

import { SyntheticEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "semantic-ui-react";

interface PageSizePickerProps {
  pageSize: number;
}

const pageSizeOptions = [
  { key: 5, value: 5, text: 5 },
  { key: 10, value: 10, text: 10 },
  { key: 25, value: 25, text: 25 },
  { key: 50, value: 50, text: 50 },
];

const PageSizePicker = ({ pageSize }: PageSizePickerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pageSizeState, setPageSizeState] = useState<number>(pageSize);

  const handleChange = (e: SyntheticEvent) => {
    const newPageSize = (e.target as HTMLInputElement).textContent as string;

    setPageSizeState(parseInt(newPageSize));

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("pageNumber", "1");
    current.set("pageSize", newPageSize);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <Select
      options={pageSizeOptions}
      onChange={(e) => handleChange(e)}
      value={pageSizeState}
      className="self-start min-w-fit"
    />
  );
};

export default PageSizePicker;
