"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

import {
  GFWAPICreateKey,
  GFWAPIDatasets,
  GFWAPIDataset,
  GFWAPIField,
  GFWAPIKeys,
  GFWAPINewKey,
  WizardQuery,
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
  console.log(`${apiURL}/dataset/${dataset}`);
  const res = await fetch(`${apiURL}/dataset/${dataset}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.data;
};

export const getFields = async ({
  dataset,
  version,
}: {
  dataset: string;
  version: string;
}): Promise<GFWAPIField[]> => {
  console.log(`${apiURL}/dataset/${dataset}/${version}/fields`);
  const res = await fetch(`${apiURL}/dataset/${dataset}/${version}/fields`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data.data;
};

////////////////
//// QUERY /////
////////////////
export const queryData = async ({
  options,
}: {
  options: WizardQuery;
}): Promise<{ [key: string]: any }[] | []> => {
  const { area, asset, version, query } = options;

  // Global              gadm_global   GET /query?sql= SELECT sum(ha) FROM my_table
  // GADM ISO            gadm_iso      GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA"
  // GADM ADM1           gadm_adm1     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3
  // GADM ADM2           gadm_adm2     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3 AND adm2 = 1
  // WDPA                wdpa          GET /query?sql= SELECT sum(ha) FROM my_table WHERE wdpa_protected_area__id = "2345234"
  // Geostore (Saved)    geostore      GET /query?sql= SELECT sum(ha) FROM my_table WHERE geostore__id = "4j194c214" AND geostore_origin = "rw"
  // GeoJSON             geojson       POST { "sql": 'SELECT sum(ha) FROM my_table', "geometry": {"type": "string", "coordinates": []} }

  let res;
  if (area.type === "gadm_global") {
    const request = `${apiURL}/dataset/${asset}/${version}/query?sql=${query}`;
    console.log("request", request);
    res = await fetch(request);
  }
  if (res) {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data.data;
  }

  return [];
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
  try {
    const session = await getServerSession(options);

    if (!session?.user?.rwToken) {
      throw new Error("Not authenticated");
    }

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
    revalidatePath("/keys");
    return res.json();
  } catch (error) {
    return { status: "error", message: "A network error occurred" };
  }
};

export const deleteKey = async (api_key: string): Promise<any> => {
  try {
    const session = await getServerSession(options);

    if (!session?.user?.rwToken) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(`${apiURL}/auth/apikey/${api_key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.rwToken}`,
      },
    });

    revalidatePath("/keys");
    return res.json();
  } catch (error) {
    return { status: "error", message: "A network error occurred" };
  }
};
