"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-6 text-center">
        <div className="mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-purple-800 sm:text-5xl">
            Aura<span className="text-pink-600">Awaaz</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">Your personal AI-powered women's health companion</p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Women's wellness illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg border border-purple-100">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-purple-800">{isSignedIn ? "Welcome Back" : "Welcome"}</h2>
                <p className="text-gray-500">
                  {isSignedIn ? "Continue your wellness journey" : "Sign in to continue your wellness journey"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {isSignedIn ? (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => router.push("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full border-gray-300 hover:bg-purple-50">
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                      <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                        <Link href="/auth/register">Create Account</Link>
                      </Button>
                    </>
                  )}
                </div>

                {!isSignedIn && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-purple-50"
                      onClick={() => router.push("/auth/login?oauth=google")}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

