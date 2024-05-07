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
  GFWAPIQueryResponse,
  WizardQuery,
  GeoTIFFDownloadOptions,
} from "@/lib/types";

const apiURL = process.env.GFW_DATA_API_URL;
const apiKey = process.env.GFW_DATA_API_KEY;

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
  //console.log(`${apiURL}/dataset/${dataset}`);
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
  //console.log(`${apiURL}/dataset/${dataset}/${version}/fields`);
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
}): Promise<GFWAPIQueryResponse> => {
  //console.log("options =>", options);
  const { area, asset, version, query } = options;

  // Global              gadm_global   GET /query?sql= SELECT sum(ha) FROM my_table
  // GADM ISO            gadm_iso      GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA"
  // GADM ADM1           gadm_adm1     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3
  // GADM ADM2           gadm_adm2     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3 AND adm2 = 1
  // WDPA                wdpa          GET /query?sql= SELECT sum(ha) FROM my_table WHERE wdpa_protected_area__id = "2345234"
  // Geostore (Saved)    geostore      GET /query?sql= SELECT sum(ha) FROM my_table WHERE geostore__id = "4j194c214" AND geostore_origin = "rw"
  // GeoJSON             geojson       POST { "sql": 'SELECT sum(ha) FROM my_table', "geometry": {"type": "string", "coordinates": []} }

  let res;
  let request;

  switch (area.type) {
    case "gadm_global":
    case "gadm_iso":
    case "gadm_adm1":
    case "gadm_adm2":
      request = `${apiURL}/dataset/${asset}/${version}/query/json?sql=${query}`;
      res = await fetch(request);
      break;
  }

  if (res) {
    const data = await res.json();
    return data;
  } else {
    return { status: "error", message: "A network error occurred" };
  }
};

/////////////////////////////////////////////
////  CREATE DOWNLOAD GEOTIFF TILE LINK /////
/////////////////////////////////////////////
export const createGeotiffLink = async ({
  asset,
  version,
  grid,
  tileID,
  pixelMeaning,
}: GeoTIFFDownloadOptions): Promise<any> => {
  const request = `${apiURL}/dataset/${asset}/${version}/download/geotiff?grid=${grid}&tile_id=${tileID}&pixel_meaning=${pixelMeaning}&x-api-key=${apiKey}`;

  return request;

  // if (res) {
  //   const data = await res.json();
  //   return data;
  // } else {
  //   return { status: "error", message: "A network error occurred" };
  // }
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
