import { number, z } from "zod";

/////////////////
//// CUSTOM /////
/////////////////

export const signinSchema = z.object({
  email: z
    .string()
    .nonempty("Email required")
    .email("Please enter a valid email"),
  password: z.string().nonempty("Password required"),
});
export type SignInData = z.infer<typeof signinSchema>;

export interface WizardQuery {
  area: {
    type: string;
    value: string;
    geometry: GeoJSON.Geometry | null;
  };
  dataset: string;
  asset: string;
  version: string;
  sql: string;
  params: string;
  results: string;
}

export interface Dataset {
  dataset: string;
  name: string;
  icon: string;
  coverage: string;
  versions: string[];
}

export interface Datasets {
  [key: string]: Dataset;
}

export interface Boundary {
  key: string;
  value: string;
  text: string;
}

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
      firstName: string;
      lastName: string;
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

export interface GFWAPIMetadata {
  created_on: string;
  updated_on: string;
  resolution: string;
  geographic_coverage: string;
  update_frequency: string;
  scale: string;
  citation: string;
  title: string;
  source: string;
  license: string;
  data_language: string;
  overview: string;
  function: string;
  cautions: string;
  key_restrictions: string;
  tags: string;
  why_added: string;
  learn_more: string;
  id: string;
}

export interface GFWAPIDataset {
  created_on: string;
  updated_on: string;
  dataset: string;
  is_downloadable: boolean;
  metadata: GFWAPIMetadata;
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

export interface GFWAPIKey {
  created_on: string;
  updated_on: string;
  alias: string;
  user_id: string;
  api_key: string;
  organization: string;
  email: string;
  domains: string[];
  expires_on: string;
}

export interface GFWAPIKeys {
  data: GFWAPIKey[];
  status: string;
}

// const domainPattern: RegExp = /^(\*\.)?([\w-]+\.)+[\w-]+$|^(localhost)$/;
// const domainSchema = z.string().refine((value) => domainPattern.test(value), {
//   message: "Invalid domain format",
// });
export const GFWAPICreateKeyFormSchema = z.object({
  alias: z.string().nonempty("Name required"),
  organization: z.string().nonempty("Organization required"),
  email: z
    .string()
    .nonempty("Email required")
    .email("Please enter a valid email"),
  domains: z.string().optional().default("[]"),
  neverExpires: z.boolean().optional(),
});
export type GFWAPICreateKeyForm = z.infer<typeof GFWAPICreateKeyFormSchema>;

export interface GFWAPICreateKey {
  alias: string;
  organization: string;
  email: string;
  domains?: string[] | [];
  neverExpires?: boolean;
}

export interface GFWAPINewKey {
  data?: GFWAPIKey;
  message?: string;
  status: string;
}
