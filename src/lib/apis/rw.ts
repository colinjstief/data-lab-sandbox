"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import {
  ServerActionError,
  RWAPIResponse,
  RWAPIUser,
  RWAPIArea,
  RWAPIGeostore,
} from "@/lib/types";

const apiURL = process.env.RW_API_URL;

/////////////////////////
//// AUTHENTICATION /////
/////////////////////////

export const getUserData = async (): Promise<RWAPIResponse<RWAPIUser>> => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new ServerActionError("Not authenticated.");
  }

  try {
    const res = await fetch(`${apiURL}/v2/user`, {
      headers: {
        Authorization: `Bearer ${session.user.rwToken}`,
      },
    });

    if (!res.ok) {
      throw new ServerActionError("Could not load user data.");
    }

    const resData = await res.json();
    const data: RWAPIUser = resData.data;
    return {
      status: "success",
      message: "User data loaded",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const getUserAreas = async ({
  withGeometry,
}: {
  withGeometry?: boolean;
} = {}): Promise<RWAPIResponse<RWAPIArea[]>> => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new ServerActionError("Not authenticated.");
  }

  try {
    const res = await fetch(`${apiURL}/v2/area`, {
      headers: {
        Authorization: `Bearer ${session.user.rwToken}`,
      },
    });

    if (!res.ok) {
      throw new ServerActionError("Could not load user areas.");
    }

    const resData = await res.json();

    if (withGeometry) {
      const areas: RWAPIArea[] = resData.data;
      const promisedGeostores = areas.map(async (area) => {
        try {
          const resGeo = await getGeostore({
            geostoreID: area.attributes.geostore,
          });
          const geostore = resGeo.data;
          return { ...area, geostore };
        } catch (error) {
          return { ...area, geostore: null };
        }
      });

      const resDatas = (await Promise.all(promisedGeostores)) as RWAPIArea[];

      return {
        status: "success",
        message: "User areas with geometries loaded",
        data: resDatas,
      };
    } else {
      const data: RWAPIArea[] = resData.data;
      return {
        status: "success",
        message: "User areas loaded",
        data,
      };
    }
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};

export const getGeostore = async ({
  geostoreID,
}: {
  geostoreID: string;
}): Promise<RWAPIResponse<RWAPIGeostore>> => {
  try {
    const res = await fetch(`${apiURL}/v2/geostore/${geostoreID}`);

    if (!res.ok) {
      throw new ServerActionError("Could not load geostore");
    }

    const resData = await res.json();
    const data: RWAPIGeostore = resData.data;

    return {
      status: "success",
      message: "Geostore loaded",
      data,
    };
  } catch (error) {
    throw new ServerActionError("Unexpected server error.");
  }
};
