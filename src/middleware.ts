import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req });
  // token = {
  //   email: 'sky.chancy.0l@icloud.com',
  //   sub: '6351c8e346f91a28f61b6f5e',
  //   rwToken: 'eyJhbGciOiJIU...',
  //   id: '6351c8e346f91a28f61b6f5e',
  //   role: 'USER',
  //   createdAt: '2022-10-20T22:17:08.000Z',
  //   iat: 1693869641,
  //   exp: 1696461641,
  //   jti: '48f38a39-6a84-4cf7-831f-eb4b1e9c613d'
  // }

  const isAuthenticated = !!token;

  // Don't let the user get to the signin page if they are already signed in
  if (req.nextUrl.pathname.startsWith("/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // Restrict access to logged in users
  if (req.nextUrl.pathname.startsWith("/profile") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}
