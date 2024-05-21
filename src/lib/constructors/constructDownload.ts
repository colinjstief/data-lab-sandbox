"use server";

import knex from "knex";

import { DownloadQuery } from "@/lib/types";

export const constructDownload = async ({
  query,
}: {
  query: DownloadQuery;
}): Promise<string> => {
  const { areas, datasets, contexts, ranges } = query;

  const db = knex({
    client: "pg",
    useNullAsDefault: true,
  });

  let sql = db("my_table").select();

  const isoAreas = areas.filter((area) => area.type === "iso");
  const adm1Areas = areas.filter((area) => area.type === "adm1");
  const adm2Areas = areas.filter((area) => area.type === "adm2");

  // DENSITY THRESHOLD
  sql = sql.where("umd_tree_cover_density_2000__threshold", 30);

  // AREA
  sql = sql.select("iso").whereIn(
    "iso",
    isoAreas.map((area) => area.value)
  );

  if (adm1Areas.length > 0) {
    sql = sql.select("adm1").whereIn(
      "adm1",
      adm1Areas.map((area) => area.value.split(".")[1].replace(/_1$/, ""))
    );
  }

  if (adm2Areas.length > 0) {
    sql = sql.select("adm2").whereIn(
      "adm2",
      adm2Areas.map((area) => area.value.split(".")[2].replace(/_1$/, ""))
    );
  }

  // DATASET
  datasets.forEach((dataset) => {
    if (dataset.value === "umd_tree_cover_loss__ha") {
      sql = sql.sum("umd_tree_cover_loss__ha as sum_umd_tree_cover_loss__ha");
    } else if (dataset.value === "umd_tree_cover_loss_from_fires__ha") {
      sql = sql.sum(
        "umd_tree_cover_loss_from_fires__ha as sum_umd_tree_cover_loss_from_fires__ha"
      );
    } else if (
      dataset.value === "gfw_full_extent_gross_emissions_CO2_only__Mg_CO2"
    ) {
      sql = sql.sum(
        "gfw_full_extent_gross_emissions_CO2_only__Mg_CO2 as sum_gfw_full_extent_gross_emissions_CO2_only__Mg_CO2"
      );
    } else if (
      dataset.value === "gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e"
    ) {
      sql = sql.sum(
        "gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e as sum_gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e"
      );
    }
  });

  // RANGE
  const rangeValues = ranges.map((range) => range.value);
  sql = sql
    .select("umd_tree_cover_loss__year")
    .whereIn("umd_tree_cover_loss__year", rangeValues);

  // CONTEXT
  if (contexts.length > 0) {
    contexts.forEach((context) => {
      sql.select(context.value);
      // if (context.value.includes("is__")) {
      //   sql = sql.where(context.value, true);
      // } else {
      //   sql = sql.whereNotNull(context.value);
      // }
      sql.groupBy(context.value);
    });
  }

  // GROUPS AND ORDERS
  if (adm2Areas.length > 0) {
    sql = sql.groupBy("iso", "adm1", "adm2", "umd_tree_cover_loss__year");
    sql = sql.orderBy("adm2", "umd_tree_cover_loss__year");
  } else if (adm1Areas.length > 0) {
    sql = sql.groupBy("iso", "adm1", "umd_tree_cover_loss__year");
    sql = sql.orderBy("adm1", "umd_tree_cover_loss__year");
  } else {
    sql = sql.groupBy("iso", "umd_tree_cover_loss__year");
    sql = sql.orderBy("iso", "umd_tree_cover_loss__year");
  }

  // ASSET AND VERSION
  let asset;
  if (adm2Areas.length > 0) {
    asset = "gadm__tcl__adm2_change";
  } else if (adm1Areas.length > 0) {
    asset = "gadm__tcl__adm1_change";
  } else {
    asset = "gadm__tcl__iso_change";
  }

  const apiURL = process.env.GFW_DATA_API_URL;
  const version = "v20240118";
  const downloadURL = `${apiURL}/dataset/${asset}/${version}/download/csv?sql=${sql.toString()}`;
  return downloadURL;
};
