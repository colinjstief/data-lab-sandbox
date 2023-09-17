import { GFWAPIDatasets } from "@/lib/types";

const apiURL = process.env.GFW_DATA_API_URL;
const apiKey = process.env.GFW_DATA_API_KEY;

export const getDatasets = async ({
  link = "",
  pageSize = 5,
  pageNumber = 1,
}: {
  link?: string;
  pageSize?: number;
  pageNumber?: number;
}): Promise<GFWAPIDatasets> => {
  const params = new URLSearchParams({
    "page[size]": String(pageSize),
    "page[number]": String(pageNumber),
  });

  const res = await fetch(`${apiURL}/datasets?${params}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
