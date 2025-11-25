import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "@fullauth/next/helpers";
import { authOptions } from "./app/api/auth/[...fullauth]/route";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getServerSession(authOptions);

  console.log("session", session);
  // Check if the path starts with /admin but is not the login page
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for admin session cookie
    const session = await getServerSession(authOptions);

    console.log("session", session);
    if (!session) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing login page while authenticated, redirect to admin dashboard
  if (pathname === "/admin/login") {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
