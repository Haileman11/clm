import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isUnauthorizedPage = req.nextUrl.pathname === "/unauthorized";
    const isAuthPage = req.nextUrl.pathname === "/api/auth/signin";

    // Allow access to auth pages and unauthorized page
    if (isAuthPage || isUnauthorizedPage) {
      return NextResponse.next();
    }

    // Check if user has any role
    if (!token?.role) {
      // For API routes, return 403
      if (isApiRoute) {
        return new NextResponse(null, { status: 403 });
      }
      // For other routes, redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // Check role-based access for API routes
    if (isApiRoute) {
      const path = req.nextUrl.pathname;
      
      // Only CONTRACT_MANAGER can access these routes
      if (
        (path.startsWith("/api/users") || path.startsWith("/api/vendors")) &&
        token.role !== "CONTRACT_MANAGER"
      ) {
        return new NextResponse(null, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/contracts/:path*",
    "/vendors/:path*",
    "/users/:path*",
    "/api/contracts/:path*",
    "/api/vendors/:path*",
    "/api/users/:path*",
    "/unauthorized",
  ],
}; 