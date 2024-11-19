// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import {
//   DEFAULT_REDIRECT_ROUTE,
//   PREVIEW_ROUTE,
//   PROTECTED_ROUTES,
//   PUBLIC_ROUTES
// } from "../routes";
// import { getSession } from "./lib/session";

// export function middleware(request: NextRequest) {
//   const session = getSession();
//   // Autorization: Protecting our special routes that are accessible only for Authenticated users
//   if (
//     PROTECTED_ROUTES.includes(request.nextUrl.pathname) ||
//     request.nextUrl.pathname.startsWith(PREVIEW_ROUTE)
//   ) {
//     if (!token) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_REDIRECT_ROUTE, request.url)
//       );
//     }
//     // check if the token is verified
//     // TODO: Hit the verifyToken endPoint
//     const isTokenVerified = true;
//     if (!isTokenVerified) {
//       return NextResponse.redirect(
//         new URL(DEFAULT_REDIRECT_ROUTE, request.url)
//       );
//     }
//     // Allow access to the route
//     return NextResponse.next();
//   }
//   // Allow the request to pass for all Public Routes
//   return NextResponse.next();
// }

// // For all routes except these matchers the middleware will be excuted
// export const config = {
//   matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_REDIRECT_ROUTE } from "../routes";
import { getSession } from "./lib/session";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session || !session?.user) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_ROUTE, request.url));
  }
  return NextResponse.next();
}

// not valid to assign variable PROTECTED_ROUTES to matcher
export const config = {
  matcher: [
    "/profile",
    "/edit-profile",
    "/profile/blogs",
    "/profile/videos",
    "/create-post",
    "/create-video-blog",
    "/referals",
    "/my-pages",
    "/privacy-settings",
    "/notifications",
    "/create-blog-category",
    "/functions",
    "/departments",
    "/preview-post",
  ],
};
