"use server";

const apiURL = process.env.BITLY_API_URL;
const accessToken = process.env.BITLY_API_ACCESS_TOKEN;

export async function POST(request: Request) {
  const body = await request.json();
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

  const bitlyData = await bitlyResponse.json();

  return Response.json({ shortLink: bitlyData.link });
}
