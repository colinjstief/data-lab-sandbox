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
}) => {
  const res = await fetch(`${apiURL}/datasets`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();

  // const response = await axios.get(dataUrl, {
  //     params: {
  //     "page[size]": pageSize,
  //     "page[number]": destination?.page || activePage,
  //     },
  // });
};
