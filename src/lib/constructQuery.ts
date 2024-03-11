"use server";

import knex from "knex";

import { Field, WizardQuery } from "@/lib/types";
import { selectRangeField } from "@/lib/selectRangeField";

export const constructQuery = async ({
  options,
  stats,
  filters,
  groups,
}: {
  options: WizardQuery;
  stats: { stat: Field; field: Field }[];
  filters: { field: Field; operator: Field; operatorValue: Field }[];
  groups: Field[];
}): Promise<string> => {
  // console.log("options =>", options);
  // console.log("stats =>", stats);
  // console.log("filters =>", filters);
  // console.log("groups =>", groups);

  const db = knex({
    client: "pg",
    useNullAsDefault: true,
  });

  let sql = db("my_table").select();

  const rangeField = selectRangeField(options);

  // STATISTICS
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
  }

  // GEOGRAPHY
  if (options.area.type === "gadm_global") {
    // GLOBAL
  } else if (options.area.type === "gadm_iso") {
    // GADM ISO
    const gadm = options.area.value.replace(/_1$/, "");
    sql = sql.select("iso").groupBy("iso");
    sql = sql.where("iso", gadm);
  } else if (options.area.type === "gadm_adm1") {
    // GADM ADM1
    sql = sql.select("iso", "adm1").groupBy("iso", "adm1");
    const gadm = options.area.value.replace(/_1$/, "");
    sql = sql.where("iso", gadm.split(".")[0]);
    sql = sql.where("adm1", gadm.split(".")[1]);
  } else if (options.area.type === "gadm_adm2") {
    // GADM ADM2
    sql = sql.select("iso", "adm1", "adm2").groupBy("iso", "adm1", "adm2");
    const gadm = options.area.value.replace(/_1$/, "");
    sql = sql.where("iso", gadm.split(".")[0]);
    sql = sql.where("adm1", gadm.split(".")[1]);
    sql = sql.where("adm2", gadm.split(".")[2]);
  } else if (options.area.type === "wdpa") {
    // WDPA
    sql = sql
      .select("wdpa_protected_area__id")
      .groupBy("wdpa_protected_area__id");
    sql = sql.where("wdpa_protected_area__id", options.area.value);
  } else if (options.area.type === "geostore") {
    // Geostore (Saved)
    sql = sql.select("geostore__id").groupBy("geostore__id");
    sql = sql.where("geostore__id", options.area.value);
  }

  // DATE RANGE
  if (options.range.length === 2) {
    if (rangeField.includes("__year")) {
      sql = sql.where(
        rangeField,
        ">=",
        options.range[0].getFullYear().toString()
      );
      sql = sql.andWhere(
        rangeField,
        "<=",
        options.range[1].getFullYear().toString()
      );
    } else {
      sql = sql.where(
        rangeField,
        ">=",
        options.range[0].toISOString().slice(0, 10)
      );
      sql = sql.andWhere(
        rangeField,
        "<=",
        options.range[1].toISOString().slice(0, 10)
      );
    }
  }

  // FILTERS
  if (filters.length > 0) {
    filters.forEach((filter) => {
      if (filter.operator.value === "=") {
        sql = sql.where(filter.field.value, filter.operatorValue.value);
      }
    });
  }

  // GROUPS
  if (groups.length > 0) {
    groups.forEach((group) => {
      if (
        group.value === "year" ||
        group.value === "week" ||
        group.value === "day"
      ) {
        sql = sql.select(rangeField).groupBy(rangeField);
      } else {
        sql = sql.select(group.value).groupBy(group.value);
      }
    });
  }

  return sql.toString();
};

// Global              gadm_global   GET https://data-api.globalforestwatch.org/dataset/gadm__tcl__iso_summary/latest/query?sql= SELECT sum(ha) FROM my_table
// GADM ISO            gadm_iso      GET https://data-api.globalforestwatch.org/dataset/gadm__tcl__iso_summary/latest/query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA"
// GADM ADM1           gadm_adm1     GET https://data-api.globalforestwatch.org/dataset/gadm__tcl__adm1_summary/latest/query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3
// GADM ADM2           gadm_adm2     GET https://data-api.globalforestwatch.org/dataset/gadm__tcl__adm2_summary/latest/query?sql= SELECT sum(ha) FROM my_table WHERE iso = "BRA" AND adm1 = 3 AND adm2 = 1
// WDPA                wdpa          GET https://data-api.globalforestwatch.org/dataset/wdpa_protected_areas__tcl__summary/latest/query?sql= SELECT sum(ha) FROM my_table WHERE wdpa_protected_area__id = "2345234"
// Geostore (Saved)    geostore      GET https://data-api.globalforestwatch.org/dataset/gadm__tcl__iso_summary/latest/query?sql= SELECT sum(ha) FROM my_table WHERE geostore__id = "4j194c214" AND geostore_origin = "rw"
// GeoJSON             geojson       POST https://data-api.globalforestwatch.org/dataset/umd_tree_cover_loss/latest/query with the body { "sql": 'SELECT sum(ha) FROM my_table', "geometry": {"type": "string", "coordinates":[[[-62.2159,-3.4653],[-62.2159,-3.4700],[-62.2100,-3.4653],[-62.2159,-3.4653]]]} }
