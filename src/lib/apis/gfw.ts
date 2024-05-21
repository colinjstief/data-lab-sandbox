"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

import {
  ServerActionError,
  PaginationLinks,
  PaginationMeta,
  GFWAPIDataset,
  GFWAPIField,
  GFWAPIQueryResponse,
  GFWAPIKey,
  GFWAPICreateKey,
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
}) => {
  const params = new URLSearchParams({
    "page[size]": String(pageSize),
    "page[number]": String(pageNumber),
  });

  try {
    const res = await fetch(`${apiURL}/datasets?${params}`);
    if (!res.ok) {
      throw new ServerActionError("Could not load datasets.");
    }
    const resData = await res.json();
    const data: GFWAPIDataset[] = resData.data;
    const links: PaginationLinks = resData.links;
    const meta: PaginationMeta = resData.meta;
    return {
      status: "success",
      message: "Datasets loaded",
      data,
      links,
      meta,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const getDataset = async ({ dataset }: { dataset: string }) => {
  try {
    const res = await fetch(`${apiURL}/dataset/${dataset}`);
    if (!res.ok) {
      throw new ServerActionError("Could not load dataset.");
    }
    const resData = await res.json();
    const data: GFWAPIDataset = resData.data;
    return {
      status: "success",
      message: "Dataset loaded",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const getFields = async ({
  dataset,
  version,
}: {
  dataset: string;
  version: string;
}) => {
  try {
    const res = await fetch(`${apiURL}/dataset/${dataset}/${version}/fields`);
    if (!res.ok) {
      throw new ServerActionError("Could not load fields.");
    }
    const resData = await res.json();
    const data: GFWAPIField[] = resData.data;
    return {
      status: "success",
      message: "Fields loaded",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

////////////////
//// QUERY /////
////////////////
export const queryData = async ({ options }: { options: WizardQuery }) => {
  //console.log("options =>", options);
  const { area, asset, version, query } = options;

  // Global              gadm_global   GET /query?sql= SELECT sum(ha) FROM my_table
  // GADM ISO            gadm_iso      GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA"
  // GADM ADM1           gadm_adm1     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3
  // GADM ADM2           gadm_adm2     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3 AND adm2 = 1
  // WDPA                wdpa          GET /query?sql= SELECT sum(ha) FROM my_table WHERE wdpa_protected_area__id = "2345234"
  // Geostore (Saved)    geostore      GET /query?sql= SELECT sum(ha) FROM my_table WHERE geostore__id = "4j194c214" AND geostore_origin = "rw"
  // GeoJSON             geojson       POST { "sql": 'SELECT sum(ha) FROM my_table', "geometry": {"type": "string", "coordinates": []} }

  try {
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
      if (!res.ok) {
        throw new ServerActionError("Could not run query.");
      }
      const resData = await res.json();
      const data: GFWAPIQueryResponse = resData.data;
      return {
        status: "success",
        message: "Query successful",
        data,
      };
    } else {
      return { status: "error", message: "No valid area type." };
    }
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
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
}: GeoTIFFDownloadOptions) => {
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

export const getKeys = async () => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new ServerActionError("Not authenticated.");
  }

  try {
    const res = await fetch(`${apiURL}/auth/apikeys`, {
      headers: {
        Authorization: `Bearer ${session.user.rwToken}`,
      },
    });

    if (!res.ok) {
      throw new ServerActionError("Could not load API keys.");
    }

    const resData = await res.json();
    const data: GFWAPIKey[] = resData.data;
    return {
      status: "success",
      message: "API keys loaded",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const createKey = async (keyDetails: GFWAPICreateKey) => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new ServerActionError("Not authenticated.");
  }

  try {
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
      throw new ServerActionError("Could not create API key.");
    }

    const resData = await res.json();
    const data: GFWAPIKey = resData.data;
    revalidatePath("/keys");
    return {
      status: "success",
      message: "API key created",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const deleteKey = async (api_key: string) => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new ServerActionError("Not authenticated.");
  }

  try {
    const res = await fetch(`${apiURL}/auth/apikey/${api_key}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.rwToken}`,
      },
    });

    if (!res.ok) {
      throw new ServerActionError("Could not delete API key");
    }

    const resData = await res.json();
    const data: GFWAPIKey = resData.data;
    revalidatePath("/keys");
    return {
      status: "success",
      message: "API key deleted.",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};
