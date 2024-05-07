"use server";

const apiURL = process.env.CONTENTFUL_API_URL;
const spaceID = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

export const getAssetByType = async ({ type }: { type: string }) => {
  const res = await fetch(
    `${apiURL}/spaces/${spaceID}/environments/master/entries?access_token=${accessToken}&content_type=${type}`
  );
  return res.json();
};
