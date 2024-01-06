"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import {
  GFWAPICreateKey,
  GFWAPIDatasets,
  GFWAPIDataset,
  GFWAPIKeys,
  GFWAPINewKey,
} from "@/lib/types";

const apiURL = process.env.GFW_DATA_API_URL;

//////////////////
//// DATASET /////
//////////////////

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
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export const getDataset = async ({
  dataset,
}: {
  dataset: string;
}): Promise<GFWAPIDataset> => {
  const res = await fetch(`${apiURL}/dataset/${dataset}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.data;
};

///////////////////
//// API KEYS /////
///////////////////

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
      "Content-type": "application/json",
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
    const errorMessage = await res.text();
    throw new Error(`Failed to create key. Error: ${errorMessage}`);
  }

  return res.json();
};
