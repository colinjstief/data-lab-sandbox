"use server";

import knex from "knex";

import { Field, WizardQuery } from "@/lib/types";

export const constructQuery = async ({
  options,
  stats,
}: {
  options: WizardQuery;
  stats: { stat: Field; field: Field }[];
}): Promise<string> => {
  // console.log("options =>", options);
  // console.log("stats =>", stats);

  const db = knex({
    client: "pg",
    useNullAsDefault: true,
  });

  let sql = db("my_table").select();

  if (stats.length > 0) {
    stats.forEach((stat) => {
      if (stat.stat.value === "coordinates") {
        sql = sql.select("latitude", "longitude");
      } else if (stat.stat.value === "count") {
        sql = sql.count("*");
      } else {
        sql = sql.sum(`${stat.field?.value}`);
      }
    });
    return sql.toString();
  }

  return sql.toString();
};

// Global              gadm_global   GET /query?sql= SELECT sum(ha) FROM my_table
// GADM ISO            gadm_iso      GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA"
// GADM ADM1           gadm_adm1     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3
// GADM ADM2           gadm_adm2     GET /query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3 AND adm2 = 1
// WDPA                wdpa          GET /query?sql= SELECT sum(ha) FROM my_table WHERE wdpa_protected_area__id = "2345234"
// Geostore (Saved)    geostore      GET /query?sql= SELECT sum(ha) FROM my_table WHERE geostore__id = "4j194c214" AND geostore_origin = "rw"
// GeoJSON             geojson       POST { "sql": 'SELECT sum(ha) FROM my_table', "geometry": {"type": "string", "coordinates": []} }
