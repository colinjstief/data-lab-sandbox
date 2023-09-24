import { z } from "zod";

/////////////////
//// CUSTOM /////
/////////////////

import { signinSchema } from "@/lib/schema";
export type SignInData = z.infer<typeof signinSchema>;

////////////////////
//// NEXT AUTH /////
////////////////////

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      rwToken: string;
      id: string;
      email: string;
      role: string;
      createdAt: Date;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    rwToken: string;
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    rwToken: string;
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }
}

///////////////////////
//// GFW DATA API /////
///////////////////////

interface RWAPIGFWProfile {
  sector: string;
  state: string;
  city: string;
  howDoYouUse: string[];
  primaryResponsibilities: string[];
  signUpForTesting: boolean;
  language: string;
  profileComplete: boolean;
  interests: string[];
  signUpToNewsletter: boolean;
  topics: string[];
}

export interface RWAPIUser {
  data: {
    type: string;
    id: string;
    attributes: {
      fullName: string;
      email: string;
      createdAt: string;
      applicationData: {
        gfw: RWAPIGFWProfile;
      };
    };
  };
}

///////////////////////
//// GFW DATA API /////
///////////////////////

export interface GFWAPIDataset {
  created_on: string;
  updated_on: string;
  dataset: string;
  is_downloadable: boolean;
  metadata: any;
  versions: string[] | null;
}

export interface GFWAPILinks {
  self: string;
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface GFWAPIMeta {
  size: number;
  total_items: number;
  total_pages: number;
}

export interface GFWAPIDatasets {
  data: GFWAPIDataset[];
  status: string;
  links: GFWAPILinks;
  meta: GFWAPIMeta;
}
