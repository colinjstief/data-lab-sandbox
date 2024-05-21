"use server";

import {
  ContentfulAsset,
  ContentfulResponse,
  ServerActionError,
  ContentfulAPIResponse,
} from "@/lib/types";

const apiURL = process.env.CONTENTFUL_API_URL;
const spaceID = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

export const getAssetByType = async ({ type }: { type: string }) => {
  try {
    const res = await fetch(
      `${apiURL}/spaces/${spaceID}/environments/master/entries?access_token=${accessToken}&content_type=${type}`
    );
    if (!res.ok) {
      throw new ServerActionError("Could not query assets.");
    }
    const resData: ContentfulResponse = await res.json();
    const data: ContentfulAsset[] = resData.items as ContentfulAsset[];
    return {
      status: "success",
      message: "Assets fetched",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const getAssetByAttribute = async ({
  contentType,
  field,
  value,
  limit,
}: {
  contentType: string;
  field: string;
  value: string;
  limit?: number;
}) => {
  try {
    const res = await fetch(
      `${apiURL}/spaces/${spaceID}/environments/master/entries?access_token=${accessToken}&content_type=${contentType}&fields.${field}=${value}${
        limit ? `&limit=${limit}` : ""
      }`
    );
    if (!res.ok) {
      throw new ServerActionError("Could not query assets.");
    }
    const resData: ContentfulResponse = await res.json();
    const data: ContentfulAsset[] = resData.items;
    return {
      status: "success",
      message: "Assets fetched",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};
