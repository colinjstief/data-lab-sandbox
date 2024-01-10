"use server";

import { datasetsClient } from "@/lib/mapboxSDK";
import { Feature, Polygon, MultiPolygon } from "geojson";

export const getBoundaries = async ({
  type,
  iso,
  adm1,
}: {
  type: string;
  iso?: string;
  adm1?: string;
}): Promise<any> => {
  let query;

  switch (type) {
    case "iso":
      query =
        "https://wri-01.carto.com/api/v2/sql?q=SELECT iso as id, name_engli as name FROM gadm36_countries WHERE iso != 'TWN' AND iso != 'XCA' ORDER BY name";
      break;
    case "adm1":
      query = `https://wri-01.carto.com/api/v2/sql?q=SELECT gid_1 as id, name_1 as name FROM gadm36_adm1 WHERE iso = '${iso}' ORDER BY name`;
      break;
    case "adm2":
      query = `https://wri-01.carto.com/api/v2/sql?q=SELECT gid_2 as id, name_2 as name FROM gadm36_adm2 WHERE iso = '${iso}' AND gid_1 = '${adm1}' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name`;
      break;
    default:
      break;
  }

  if (query) {
    const res = await fetch(query);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    const shapedData = data.rows.map((item: { id: string; name: string }) => {
      return {
        key: item.id,
        value: item.id,
        text: `(${item.id}) ${item.name}`,
      };
    });
    return shapedData;
  }
};

export const getFeature = async ({
  datasetId,
  featureId,
}: {
  datasetId: string;
  featureId: string;
}): Promise<GeoJSON.Feature> => {
  const res = await datasetsClient
    .getFeature({
      datasetId,
      featureId,
    })
    .send();

  console.log(res.body);

  return res.body;
};
