"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import { ServerActionError, RWAPIResponse, RWAPIUser } from "@/lib/types";

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
