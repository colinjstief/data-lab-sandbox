"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import { RWAPIUser } from "@/lib/types";

const apiURL = process.env.RW_API_URL;

/////////////////////////
//// AUTHENTICATION /////
/////////////////////////

export const getUserData = async (): Promise<RWAPIUser> => {
  const session = await getServerSession(options);

  if (!session?.user?.rwToken) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${apiURL}/v2/user`, {
    headers: {
      Authorization: `Bearer ${session.user.rwToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
