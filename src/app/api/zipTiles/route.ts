"use server";

import { NextResponse } from "next/server";
import archiver from "archiver";
import axios from "axios";

import { createGeotiffLink } from "@/lib/gfwDataAPI";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.dataset || !body.selectedTiles) {
      return new Response("Bad Request: Missing required body arguments", {
        status: 400,
      });
    }

    const { dataset, selectedTiles } = body;

    let zipUrls = {};
    let asset;
    let version;
    let grid;
    let pixelMeaning;

    switch (dataset) {
      case "gfw_forest_carbon_gross_removals_ha":
        asset = "gfw_forest_carbon_gross_removals";
        version = "v20230407";
        grid = "10/40000";
        pixelMeaning = "Mg_CO2e_ha-1";
        break;
      case "gfw_forest_carbon_gross_removals_px":
        asset = "gfw_forest_carbon_gross_removals";
        version = "v20230407";
        grid = "10/40000";
        pixelMeaning = "Mg_CO2e_px-1";
        break;
    }

    if (!asset || !version || !grid || !pixelMeaning) {
      throw new Error("Missing required parameters");
    }

    for (const tileID of selectedTiles) {
      const zipUrl = await createGeotiffLink({
        asset,
        version,
        grid,
        tileID,
        pixelMeaning,
      });
      zipUrls = {
        ...zipUrls,
        tileID: {
          name: tileID,
          url: zipUrl,
        },
      };
    }

    const archive = archiver("zip", { zlib: { level: 9 } });

    for (const [key, value] of Object.entries<{ name: string; url: string }>(
      zipUrls
    )) {
      console.log("response start");
      const { name, url } = value;
      const response = await axios.get(url, { responseType: "arraybuffer" });
      console.log("response end");
      archive.append(response.data, { name: `${name}.jpg` });
      console.log("archive end");
    }
    // archive.finalize();

    // const blob = new Blob(archive, { type: "application/zip" });
    // const headers = new Headers();
    // headers.set("Content-Type", "application/octet-stream");
    // headers.set("Content-Disposition", "attachment; filename='download.zip'");
    // return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (error) {
    console.error("Error in URL shortening:", error);
    return new Response("Server Error: Unable to process request", {
      status: 500,
    });
  }
}
