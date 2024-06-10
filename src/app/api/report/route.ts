"use server";

import fs from "fs";
import { PDFDocument } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";
import { PDFExportFormSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  console.time("Total Time");

  try {
    console.time("Parse Form Data");
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    const parsedData = PDFExportFormSchema.safeParse(formData);
    console.timeEnd("Parse Form Data");

    if (!parsedData.success) {
      return new NextResponse("Improperly formatted data", {
        status: 400,
      });
    }

    const { title, notes, logoImage, mapImage } = parsedData.data;

    console.time("Create PDF Document");
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { height, width } = page.getSize();
    console.timeEnd("Create PDF Document");

    console.time("Draw Title");
    page.drawText(title as string, {
      x: 50,
      y: height - 50,
      size: 30,
    });
    console.timeEnd("Draw Title");

    if (mapImage) {
      console.time("Embed Map Image");
      const mapPNG = await pdfDoc.embedPng(mapImage);
      console.timeEnd("Embed Map Image");

      console.time("Draw Map Image");
      page.drawImage(mapPNG, {
        x: 50,
        y: height - 400,
        width: 512,
        height: 300,
      });
      console.timeEnd("Draw Map Image");
    }

    if (logoImage) {
      console.time("Embed Logo Image");
      // @ts-ignore
      const { type } = logoImage;
      // @ts-ignore
      const arrayBuffer = await logoImage.arrayBuffer();
      let logo;
      if (type === "image/png") {
        logo = await pdfDoc.embedPng(arrayBuffer);
      } else if (type === "image/jpg" || type === "image/jpeg") {
        logo = await pdfDoc.embedJpg(arrayBuffer);
      }
      console.timeEnd("Embed Logo Image");

      if (logo) {
        console.time("Draw Logo Image");
        page.drawImage(logo, {
          x: 500,
          y: height - 80,
          width: 50,
          height: 50,
        });
        console.timeEnd("Draw Logo Image");
      }
    }

    if (notes) {
      console.time("Draw Notes");
      page.drawText(notes as string, {
        x: 50,
        y: height - 500,
        size: 20,
      });
      console.timeEnd("Draw Notes");
    }

    console.time("Save PDF Document");
    const pdfBytes = await pdfDoc.save();
    console.timeEnd("Save PDF Document");

    console.timeEnd("Total Time");

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: new Headers({
        "content-type": "application/pdf",
      }),
    });
  } catch (error) {
    console.error("Error in URL shortening:", error);

    console.timeEnd("Total Time");

    // Respond with a generic server error message
    return new NextResponse("Server Error: Unable to process request", {
      status: 500,
    });
  }
}
