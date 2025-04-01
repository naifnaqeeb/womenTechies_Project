"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Redirect if not loaded or no user (this is a fallback, middleware should handle this)
  if (isLoaded && !user) {
    router.push("/")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col p-6 bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Welcome to AuraAwaaz</h1>
          <p className="text-gray-600">Your personal health dashboard</p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Cycle Tracking</h2>
          <p className="text-gray-600">Track your menstrual cycle and get personalized insights.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Mood Journal</h2>
          <p className="text-gray-600">Record your daily moods and identify patterns over time.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Fitness Tracker</h2>
          <p className="text-gray-600">Monitor your fitness goals and track your progress.</p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>This is a placeholder dashboard. In a real application, this would display personalized data.</p>
      </div>
    </div>
  )
}

