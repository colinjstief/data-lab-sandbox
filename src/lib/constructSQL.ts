"use server";

import knex from "knex";

import { Field } from "./types";

export const constructSQL = async ({
  stats,
}: {
  stats: { stat: Field; field: Field }[];
}): Promise<string> => {
  console.log("stats =>", stats);

  const db = knex({
    client: "pg",
    useNullAsDefault: true,
  });

  let query = db("my_table").select();

  if (stats.length > 0) {
    stats.forEach((stat) => {
      if (stat.stat.value === "coordinates") {
        query = query.select("latitude", "longitude");
      } else if (stat.stat.value === "count") {
        query = query.count("*");
      } else {
        query = query.sum(`${stat.field?.value} as sum(${stat.field?.value})`);
      }
    });
    return query.toString();
  } else {
    return "";
  }
};
