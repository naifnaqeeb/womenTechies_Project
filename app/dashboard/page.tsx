"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, LineChart, Smile, Loader2 } from "lucide-react"
import { format, addDays } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

type UserHealthData = {
  age: number
  height: number
  weight: number
  lastPeriodDate: string
  periodDuration: string
  birthControl: string
  moodSwings: string[]
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [healthData, setHealthData] = useState<UserHealthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      // Fetch user health data from API
      const fetchUserHealth = async () => {
        try {
          const response = await fetch("/api/user-health")
          if (!response.ok) {
            const errorText = await response.text()
            console.error("API Error:", errorText)
            throw new Error("Failed to fetch health data")
          }
          const data = await response.json()
          if (data.exists) {
            setHealthData(data.data)
          } else {
            // User hasn't completed onboarding
            router.push("/onboarding")
            return
          }
        } catch (error) {
          console.error("Error fetching health data:", error)
          toast({
            title: "Error loading data",
            description: "Failed to load your health data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserHealth()
    } else if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router, toast])

  // Calculate next period date (simple prediction)
  const getNextPeriodDate = () => {
    if (healthData?.lastPeriodDate) {
      const lastPeriod = new Date(healthData.lastPeriodDate)
      const nextPeriod = addDays(lastPeriod, 28) // Assuming 28-day cycle
      return format(nextPeriod, "PPP")
    }
    return "Not available"
  }

  // Get period duration in readable format
  const getPeriodDuration = () => {
    if (!healthData?.periodDuration) return "Not set"

    return healthData.periodDuration + " days"
  }

  // Get mood prediction based on cycle phase
  const getMoodPrediction = () => {
    if (!healthData?.lastPeriodDate) return "Unknown"

    const lastPeriod = new Date(healthData.lastPeriodDate)
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceLastPeriod % 28) + 1

    // Simple mood prediction based on cycle phase
    if (cycleDay <= 5) {
      return "May be irritable" // Menstruation
    } else if (cycleDay <= 14) {
      return "Likely stable" // Follicular phase
    } else if (cycleDay <= 16) {
      return "Energetic" // Ovulation
    } else {
      return "May experience PMS" // Luteal phase
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col p-6 bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Welcome to AuraAwaaz</h1>
          <p className="text-gray-600">Your personal health dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-purple-200 hover:bg-purple-100"
            onClick={() => router.push("/onboarding")}
          >
            Update Health Profile
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Health Insights Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Your Health Insights</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Next Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getNextPeriodDate()}</p>
              <p className="text-xs text-gray-500 mt-1">Based on your 28-day cycle</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Period Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getPeriodDuration()}</p>
              <p className="text-xs text-gray-500 mt-1">Your typical period length</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
                <Smile className="h-4 w-4 mr-2" />
                Mood Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getMoodPrediction()}</p>
              <p className="text-xs text-gray-500 mt-1">Based on your cycle phase</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
                <LineChart className="h-4 w-4 mr-2" />
                Cycle Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Good</p>
              <p className="text-xs text-gray-500 mt-1">Based on your recent data</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Cycle Tracking</h2>
          <p className="text-gray-600 mb-4">Track your menstrual cycle and get personalized insights.</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/cycle-tracking")}>
            Track Now
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Mood Journal</h2>
          <p className="text-gray-600 mb-4">Record your daily moods and identify patterns over time.</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/mood-journal")}>
            Log Mood
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Fitness Tracker</h2>
          <p className="text-gray-600 mb-4">Monitor your fitness goals and track your progress.</p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/fitness-tracker")}>
            Start Tracking
          </Button>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-purple-100">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Ask AuraAwaaz AI</h2>
        <p className="text-gray-600 mb-4">
          Have questions about your health? Our AI assistant can provide personalized insights based on your data.
        </p>
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700">Ask About My Cycle</Button>
          <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
            Health Recommendations
          </Button>
        </div>
      </div>
    </div>
  )
}

