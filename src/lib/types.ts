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
  range: [Date, Date] | [];
  timeGroup: string;
  areaGroup: string;
  asset: string;
  version: string;
  query: string;
  statInQuery: boolean;
  results: string;
}

export interface Boundary {
  key: string;
  value: string;
  text: string;
}

export interface Segmentations {
  [key: string]: string[];
}

export interface Field {
  key: string;
  value: string;
  text: string;
}

export interface Dataset {
  dataset: string;
  name: string;
  icon: string;
  coverage: string;
  groups: Segmentations;
}

export interface Datasets {
  [key: string]: Dataset;
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
//// RW DATA API /////
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

export interface GFWAPITableValue {
  value: number;
  meaning: string | number;
}

export interface GFWAPIField {
  alias: string;
  data_type: string;
  description: string;
  is_feature_info: boolean;
  is_filter: boolean;
  name: string;
  unit: string;
  pixel_meaning: string;
  statistics: null;
  values_table: {
    [key: string]: GFWAPITableValue;
  };
  compression: null;
  no_data_value: number;
}

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

export interface GFWAPIQueryResponse {
  data?: { [key: string]: any }[];
  message?: string;
  status: string;
}
