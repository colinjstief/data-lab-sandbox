import { z } from "zod";

/////////////////
//// CUSTOM /////
/////////////////

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password required"),
});
export type SignInData = z.infer<typeof signinSchema>;

export interface AsyncStatus {
  status: string;
  message: string;
}

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

export interface DownloadQuery {
  areas: Field[];
  datasets: Field[];
  contexts: Field[];
  ranges: Field[];
}

export interface GeoTIFFDownloadOptions {
  asset: string;
  version: string;
  grid: string;
  tileID: string;
  pixelMeaning: string;
}

export interface Segmentations {
  [key: string]: string[];
}

export interface Field {
  key: string;
  value: string;
  text: string;
  [propName: string]: any;
}

export interface Dataset {
  include: boolean;
  dataset: string;
  name: string;
  icon: string;
  coverage: string;
  groups: Segmentations;
}

export interface Datasets {
  [key: string]: Dataset;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  zoom: number;
}

////////////////////
//// NEXT JS ///////
////////////////////

export interface NextPageParams {
  slug: string;
}

export interface NextPageSearchParams {
  [key: string]: string | string[] | undefined;
}

////////////////////
//// NEXT AUTH /////
////////////////////

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

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

//////////////////////////////////
//// Server action response //////
//////////////////////////////////
export interface ServerActionResponse {
  status: "success" | "error";
  message: string;
}

export class ServerActionError extends Error {
  status: "error";
  constructor(message: string) {
    super(message);
    this.status = "error";
    this.name = "ServerActionError";
  }
}

/////////////////
//// Mapbox /////
/////////////////

/////////////////////
//// Contentful /////
/////////////////////

export interface ContentfulAPIResponse<T> extends ServerActionResponse {
  data?: T | T[];
}

export interface ContentfulAsset {
  fields: { [key: string]: any };
  metadata: { [key: string]: any };
  sys: { [key: string]: any };
}

export interface ContentfulResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulAsset[];
}

///////////////////
//// WRI API //////
///////////////////

export interface PaginationLinks {
  self: string;
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface PaginationMeta {
  size: number;
  "total-items"?: number;
  "total-pages"?: number;
  total_items?: number;
  total_pages?: number;
}

///////////////////////
//// RW DATA API //////
///////////////////////
export interface RWAPIResponse<T> extends ServerActionResponse {
  data?: T | T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

export interface RWAPIGFWProfile {
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
}

export interface RWAPIArea {
  type: string;
  id: string;
  attributes: {
    name: string;
    application: string;
    geostore: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    datasets: [];
    use: {};
    env: string;
    iso: {};
    admin: {};
    tags: [];
    status: string;
    public: boolean;
    fireAlerts: boolean;
    deforestationAlerts: boolean;
    webhookUrl: string;
    monthlySummary: boolean;
    subscriptionId: string;
    email: string;
    language: string;
    confirmed: boolean;
  };
  geostore: RWAPIGeostore;
}

export interface RWAPIGeostore {
  type: string;
  id: string;
  attributes: {
    geojson: GeoJSON.FeatureCollection;
    hash: string;
    provider: {};
    areaHa: number;
    bbox: [number, number, number, number];
    lock: boolean;
    info: {
      use: {};
    };
  };
}

///////////////////////
//// GFW DATA API /////
///////////////////////
export interface GFWAPIResponse<T> extends ServerActionResponse {
  data?: T | T[];
  links?: PaginationLinks;
  meta?: PaginationMeta;
}

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

export interface GFWAPIQueryResponse {
  [key: string]: any;
}

export const GFWAPICreateKeyFormSchema = z.object({
  alias: z.string().min(1, "Name required"),
  organization: z.string().min(1, "Organization required"),
  email: z
    .string()
    .min(1, "Email required")
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
