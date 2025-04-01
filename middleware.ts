import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes (accessible without authentication)
const isPublicRoute = createRouteMatcher(["/", "/auth/sign-in", "/auth/sign-up", "/api/webhook/clerk"])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth() // Get the user session info

  // Allow access to public routes
  if (isPublicRoute(req)) return NextResponse.next()

  // Redirect to sign-in page if user is not authenticated
  if (!userId) {
    const signInUrl = new URL("/auth/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Allow access to authenticated users
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

