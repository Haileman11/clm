import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // If user is not authenticated, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Get user role from token
  const userRole = token.role as string;

  // Check if the request is for contracts
  if (request.nextUrl.pathname.startsWith("/api/contracts")) {
    // For non-CONTRACT_MANAGER roles, only allow GET requests (read-only)
    if (userRole !== "CONTRACT_MANAGER") {
      // Allow GET requests (read-only access)
      if (request.method === "GET") {
        return NextResponse.next();
      }
      
      // Block all other methods (POST, PUT, DELETE, etc.)
      return NextResponse.json(
        { error: "You don't have permission to modify contracts. Read-only access granted." },
        { status: 403 }
      );
    }
  }

  // Check if the request is for users or vendors
  if (
    request.nextUrl.pathname.startsWith("/api/users") ||
    request.nextUrl.pathname.startsWith("/api/vendors") ||
    request.nextUrl.pathname.startsWith("/users") ||
    request.nextUrl.pathname.startsWith("/vendors")
  ) {
    // Only CONTRACT_MANAGER can access these endpoints
    if (userRole !== "CONTRACT_MANAGER") {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 403 }
      );
    }
  }

  // For contract pages, add a header to indicate read-only status
  if (request.nextUrl.pathname.startsWith("/contracts")) {
    const response = NextResponse.next();
    
    if (userRole !== "CONTRACT_MANAGER") {
      response.headers.set("X-Read-Only", "true");
    }
    
    return response;
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/api/contracts/:path*",
    "/api/users/:path*",
    "/api/vendors/:path*",
    "/contracts/:path*",
    "/users/:path*",
    "/vendors/:path*",
  ],
}; 