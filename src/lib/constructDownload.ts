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

  // CARBON -- https://www.globalforestwatch.org/api/data/dataset/gadm__tcl__iso_change/v20230312/download/csv/?sql=SELECT iso, umd_tree_cover_loss__year, SUM("gfw_gross_emissions_co2e_all_gases__Mg") AS "gfw_gross_emissions_co2e_all_gases__Mg", SUM("gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e") AS "gfw_gross_emissions_co2e_non_co2__Mg", SUM("gfw_full_extent_gross_emissions_CO2_only__Mg_CO2") AS "gfw_gross_emissions_co2e_co2_only__Mg" FROM data WHERE iso = 'BRA' AND umd_tree_cover_density_2000__threshold = 30 AND is__umd_regional_primary_forest_2001 = 'true'  GROUP BY umd_tree_cover_loss__year, iso ORDER BY umd_tree_cover_loss__year, iso

  // FIRES -- https://www.globalforestwatch.org/api/data/dataset/gadm__tcl__iso_change/v20230312/download/csv/?sql=SELECT iso, umd_tree_cover_loss__year, SUM(umd_tree_cover_loss__ha) AS umd_tree_cover_loss__ha, SUM(umd_tree_cover_loss_from_fires__ha) AS "umd_tree_cover_loss_from_fires__ha" FROM data WHERE iso = 'BRA' AND umd_tree_cover_density_2000__threshold = 30  GROUP BY umd_tree_cover_loss__year, iso ORDER BY umd_tree_cover_loss__year, iso

  // FIELDS
  sql = sql.select("iso", "umd_tree_cover_loss__year");

  // DENSITY THRESHOLD
  sql = sql.where("umd_tree_cover_density_2000__threshold", 30);

  // AREA
  if (areas.length > 0) {
    areas.forEach((area) => {
      sql = sql.where("iso", area.value);
    });
  }

  // DATASET
  if (datasets.length > 0) {
    datasets.forEach((dataset) => {
      if (dataset.value === "umd_tree_cover_loss__ha") {
        sql = sql.sum(
          "umd_tree_cover_loss__ha as SUM(umd_tree_cover_loss__ha)"
        );
      } else if (dataset.value === "umd_tree_cover_loss_from_fires__ha") {
        sql = sql.sum(
          "umd_tree_cover_loss_from_fires__ha as SUM(umd_tree_cover_loss_from_fires__ha)"
        );
      } else if (
        dataset.value === "gfw_full_extent_gross_emissions_CO2_only__Mg_CO2"
      ) {
        sql = sql.sum(
          "gfw_full_extent_gross_emissions_CO2_only__Mg_CO2 as SUM(gfw_full_extent_gross_emissions_CO2_only__Mg_CO2)"
        );
      } else if (
        dataset.value === "gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e"
      ) {
        sql = sql.sum(
          "gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e as SUM(gfw_full_extent_gross_emissions_non_CO2__Mg_CO2e)"
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
    ranges.forEach((range) => {
      sql = sql.orWhere("umd_tree_cover_loss__year", range.value);
    });
  }

  // GROUPS
  sql = sql.groupBy("iso", "umd_tree_cover_loss__year");

  // ORDER
  sql = sql.orderBy("iso", "umd_tree_cover_loss__year");

  return sql.toString();
};
