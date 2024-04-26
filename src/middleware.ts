import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { getToken, JWT } from "next-auth/jwt";
import path from "path";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });
  // console.log("token =>", token);
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

  // Only logged in users can access these pages
  const protectedRoutes = ["/profile", "/api-keys"];

  const requiresAuth = (pathname: string): boolean => {
    return protectedRoutes.some((protectedPath) =>
      pathname.startsWith(protectedPath)
    );
  };

  if (requiresAuth(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Only admins can access these pages
  const admins = ["sky.chancy.0l@icloud.com"];

  const isAdmin = (token: JWT | null): boolean => {
    return admins.some((adminEmail) => token?.email === adminEmail);
  };

  const adminRoutes = ["/deck-map"];

  const requiresAdmin = (pathname: string): boolean => {
    return adminRoutes.some((protectedPath) => pathname === protectedPath);
  };

  if (requiresAdmin(pathname) && !isAdmin(token)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
