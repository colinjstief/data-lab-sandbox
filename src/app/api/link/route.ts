"use server";

import { NextResponse } from "next/server";

const apiURL = process.env.BITLY_API_URL;
const accessToken = process.env.BITLY_API_ACCESS_TOKEN;

export async function POST(request: Request) {
  try {
    // Ensure the accessToken is available
    if (!accessToken || !apiURL) {
      return new Response("Unauthorized or API URL not configured properly", {
        status: 401,
      });
    }

    // Ensure body of request sent a value in the longURL property
    const body = await request.json();
    if (!body || !body.longURL) {
      return new Response("Bad Request: Missing long URL in the request body", {
        status: 400,
      });
    }

    const { longURL } = body;

    const bitlyResponse = await fetch(`${apiURL}/shorten`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        long_url: `${longURL}`,
      }),
    });

    if (!bitlyResponse.ok) {
      throw new Error("Bitly API responded with an error");
    }

    const bitlyData = await bitlyResponse.json();

    return NextResponse.json({ shortLink: bitlyData.link });
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Error in URL shortening:", error);

    // Respond with a generic server error message
    return new Response("Server Error: Unable to process request", {
      status: 500,
    });
  }
}
