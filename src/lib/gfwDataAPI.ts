"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import {
  GFWAPICreateKey,
  GFWAPIDatasets,
  GFWAPIKeys,
  GFWAPINewKey,
} from "@/lib/types";

const apiURL = process.env.GFW_DATA_API_URL;

export const getDatasets = async ({
  pageSize = 10,
  pageNumber = 1,
}: {
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

export const getKeys = async (): Promise<GFWAPIKeys> => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${apiURL}/auth/apikeys`, {
    headers: {
      Authorization: `Bearer ${session.user.rwToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const createKey = async (
  keyDetails: GFWAPICreateKey
): Promise<GFWAPINewKey> => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new Error("Not authenticated");
  }

  console.log("session.user.rwToken =>", session.user.rwToken);
  console.log("keyDetails =>", keyDetails);

  const res = await fetch(`${apiURL}/auth/apikey`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.rwToken}`,
    },
    body: JSON.stringify({
      alias: keyDetails.alias,
      organization: keyDetails.organization,
      email: keyDetails.email,
      domains: keyDetails.domains || [],
      never_expires: keyDetails.neverExpires,
    }),
  });

  if (!res.ok) {
    console.log("res =>", res);
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
