import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/oauth-callback",
  "/api/webhook/clerk",
])

export default clerkMiddleware((auth, req) => {
  const  userId  = auth

  // Allow access to public routes
  if (isPublicRoute(req)) return NextResponse.next()

  // Allow access to API routes
  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next()

  // Redirect to login page if user is not authenticated
  if (!userId) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access to authenticated users
  return NextResponse.next()
})

// Improved matcher to prevent blocking unnecessary routes
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
}

