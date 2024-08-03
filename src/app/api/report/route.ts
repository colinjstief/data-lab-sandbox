"use server";

import { PDFDocument } from "pdf-lib";
import { NextRequest, NextResponse } from "next/server";

import { PDFExportFormSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const formData = Object.fromEntries(data);
    const parsedData = PDFExportFormSchema.safeParse(formData);

    if (!parsedData.success) {
      return new NextResponse("Improperly formatted data", {
        status: 400,
      });
    }
    const { title, notes, logoImage, mapImage } = parsedData.data;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { height, width } = page.getSize();
    page.drawText(title as string, {
      x: 50,
      y: height - 50,
      size: 30,
    });

    if (mapImage) {
      const mapPNG = await pdfDoc.embedPng(mapImage);

      page.drawImage(mapPNG, {
        x: 50,
        y: height - 400,
        width: 256,
        height: 150,
      });
    }

    if (logoImage) {
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
      if (logo) {
        page.drawImage(logo, {
          x: 500,
          y: height - 80,
          width: 50,
          height: 50,
        });
      }
    }

    if (notes) {
      page.drawText(notes as string, {
        x: 50,
        y: height - 500,
        size: 20,
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: new Headers({
        "content-type": "application/pdf",
      }),
    });
    // const data = await request.formData();
    // console.log("data =>", data);
    // const formData = await form.parse(data);
    // console.log("parsedData =>", parsedData);
  } catch (error) {
    console.error("Error in URL shortening:", error);

    // Respond with a generic server error message
    return new NextResponse("Server Error: Unable to process request", {
      status: 500,
    });
  }
}
