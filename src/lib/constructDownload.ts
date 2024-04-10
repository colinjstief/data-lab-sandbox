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

  // FIELDS
  sql = sql.select("iso", "umd_tree_cover_loss__year");

  // DENSITY THRESHOLD
  sql = sql.where("umd_tree_cover_density_2000__threshold", 30);

  // AREA
  if (areas.length > 0) {
    const areaValues = areas.map((area) => area.value);
    sql = sql.whereIn("iso", areaValues);
  }

  // DATASET
  if (datasets.length > 0) {
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
  }

  // CONTEXT
  if (contexts.length > 0) {
    contexts.forEach((context) => {
      sql = sql.where(context.value, true);
    });
  }

  // RANGE
  if (ranges.length > 0) {
    const rangeValues = ranges.map((range) => range.value);
    sql = sql.whereIn("umd_tree_cover_loss__year", rangeValues);
  }

  // GROUPS
  sql = sql.groupBy("iso", "umd_tree_cover_loss__year");

  // ORDER
  sql = sql.orderBy("iso", "umd_tree_cover_loss__year");

  const apiURL = process.env.GFW_DATA_API_URL;
  const asset = "gadm__tcl__iso_change";
  const version = "v20240118";
  const downloadURL = `${apiURL}/dataset/${asset}/${version}/download/csv?sql=${sql.toString()}`;
  return downloadURL;
};
