"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const success = searchParams.get("success")

    // Simulate processing OAuth callback
    const timer = setTimeout(() => {
      if (success === "true") {
        setMessage("Authentication successful! Redirecting to dashboard...")
        setTimeout(() => router.push("/dashboard"), 1000)
      } else {
        setMessage("Authentication failed. Please try again.")
        setTimeout(() => router.push("/auth/login"), 2000)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-100 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-800 mb-2">{message}</h1>
        <p className="text-gray-500">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  )
}

