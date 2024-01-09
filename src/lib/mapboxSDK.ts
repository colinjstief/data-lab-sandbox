import { MB_KEY } from "@/lib/keys";
import mapboxDatasets from "@mapbox/mapbox-sdk/services/datasets";

export const datasetsClient = mapboxDatasets({
  accessToken: MB_KEY,
});
