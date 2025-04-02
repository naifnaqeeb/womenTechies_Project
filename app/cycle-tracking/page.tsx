"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { format, subDays, isSameDay } from "date-fns"
import { ArrowLeft, Loader2, Droplets } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type PeriodDay = {
  date: Date
  flow: "light" | "medium" | "heavy"
  symptoms: string[]
}

type CycleData = {
  periods: PeriodDay[]
  lastUpdated: Date
}

export default function CycleTrackingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [flow, setFlow] = useState<"light" | "medium" | "heavy">("medium")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [cycleData, setCycleData] = useState<CycleData>({
    periods: [],
    lastUpdated: new Date(),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch cycle data
  useEffect(() => {
    if (isLoaded && user) {
      const fetchCycleData = async () => {
        try {
          // In a real app, you would fetch this from your API
          // For now, we'll use mock data
          const mockData: CycleData = {
            periods: [
              {
                date: subDays(new Date(), 2),
                flow: "heavy",
                symptoms: ["cramps", "headache"],
              },
              {
                date: subDays(new Date(), 1),
                flow: "medium",
                symptoms: ["cramps"],
              },
              {
                date: new Date(),
                flow: "light",
                symptoms: [],
              },
            ],
            lastUpdated: new Date(),
          }

          setCycleData(mockData)
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching cycle data:", error)
          toast({
            title: "Error loading data",
            description: "Failed to load your cycle data. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      }

      fetchCycleData()
    } else if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router, toast])

  const handleSymptomToggle = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter((s) => s !== symptom))
    } else {
      setSymptoms([...symptoms, symptom])
    }
  }

  const handleSaveEntry = async () => {
    setIsSubmitting(true)

    try {
      // Check if there's already an entry for this date
      const existingEntryIndex = cycleData.periods.findIndex((period) => isSameDay(new Date(period.date), selectedDate))

      const newPeriod: PeriodDay = {
        date: selectedDate,
        flow,
        symptoms,
      }

      const updatedPeriods = [...cycleData.periods]

      if (existingEntryIndex >= 0) {
        // Update existing entry
        updatedPeriods[existingEntryIndex] = newPeriod
      } else {
        // Add new entry
        updatedPeriods.push(newPeriod)
      }

      // Sort periods by date (newest first)
      updatedPeriods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const updatedCycleData = {
        ...cycleData,
        periods: updatedPeriods,
        lastUpdated: new Date(),
      }

      // In a real app, you would save this to your API
      // await fetch('/api/cycle-tracking', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedCycleData)
      // })

      setCycleData(updatedCycleData)

      toast({
        title: "Entry saved",
        description: `Your cycle data for ${format(selectedDate, "PPP")} has been saved.`,
      })

      // Reset form
      setFlow("medium")
      setSymptoms([])
    } catch (error) {
      console.error("Error saving cycle data:", error)
      toast({
        title: "Error saving data",
        description: "Failed to save your cycle data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  ;<Calendar
    mode="single"
    selected={selectedDate}
    onSelect={(date) => date && setSelectedDate(date)}
    className="rounded-md border"
    components={{
      Day: ({ date, ...props }) => {
        const isPeriodDay = cycleData.periods.some((period) => isSameDay(new Date(period.date), date))

        const periodDay = cycleData.periods.find((period) => isSameDay(new Date(period.date), date))

        return (
          <div
            {...props}
            className={cn("relative flex h-9 w-9 items-center justify-center", isPeriodDay && "font-bold")}
          >
            {date.getDate()}
            {isPeriodDay && (
              <div
                className={cn(
                  "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                  periodDay?.flow === "light" && "bg-pink-300",
                  periodDay?.flow === "medium" && "bg-pink-500",
                  periodDay?.flow === "heavy" && "bg-pink-700",
                )}
              />
            )}
          </div>
        )
      },
    }}
  />

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col p-6 bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-purple-800">Cycle Tracking</h1>
        </div>
        <p className="text-gray-600">
          Track your menstrual cycle and symptoms to gain insights into your health patterns.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white border border-purple-100">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>View and track your cycle on the calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              components={{
                Day: ({ date, ...props }) => {
                  const isPeriodDay = cycleData.periods.some((period) => isSameDay(new Date(period.date), date))

                  const periodDay = cycleData.periods.find((period) => isSameDay(new Date(period.date), date))

                  return (
                    <div
                      {...props}
                      className={cn("relative flex h-9 w-9 items-center justify-center", isPeriodDay && "font-bold")}
                    >
                      {date.getDate()}
                      {isPeriodDay && (
                        <div
                          className={cn(
                            "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                            periodDay?.flow === "light" && "bg-pink-300",
                            periodDay?.flow === "medium" && "bg-pink-500",
                            periodDay?.flow === "heavy" && "bg-pink-700",
                          )}
                        />
                      )}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-300 mr-1"></div>
                <span className="text-xs">Light</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-500 mr-1"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-700 mr-1"></div>
                <span className="text-xs">Heavy</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-white border border-purple-100">
          <CardHeader>
            <CardTitle>Log Period</CardTitle>
            <CardDescription>{format(selectedDate, "PPP")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Flow Intensity</h3>
              <div className="flex gap-2">
                <Button
                  variant={flow === "light" ? "default" : "outline"}
                  size="sm"
                  className={flow === "light" ? "bg-pink-300 hover:bg-pink-400 text-white" : ""}
                  onClick={() => setFlow("light")}
                >
                  Light
                </Button>
                <Button
                  variant={flow === "medium" ? "default" : "outline"}
                  size="sm"
                  className={flow === "medium" ? "bg-pink-500 hover:bg-pink-600 text-white" : ""}
                  onClick={() => setFlow("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={flow === "heavy" ? "default" : "outline"}
                  size="sm"
                  className={flow === "heavy" ? "bg-pink-700 hover:bg-pink-800 text-white" : ""}
                  onClick={() => setFlow("heavy")}
                >
                  Heavy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {["cramps", "headache", "bloating", "fatigue", "mood swings", "backache"].map((symptom) => (
                  <Badge
                    key={symptom}
                    variant={symptoms.includes(symptom) ? "default" : "outline"}
                    className={cn("cursor-pointer capitalize", symptoms.includes(symptom) ? "bg-purple-600" : "")}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleSaveEntry}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Entry"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6 bg-white border border-purple-100">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your most recent period tracking entries</CardDescription>
        </CardHeader>
        <CardContent>
          {cycleData.periods.length > 0 ? (
            <div className="space-y-4">
              {cycleData.periods.slice(0, 5).map((period, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{format(new Date(period.date), "PPP")}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Droplets className="h-3 w-3 mr-1" />
                      <span className="capitalize">{period.flow} flow</span>
                    </div>
                  </div>
                  <div>
                    {period.symptoms.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                        {period.symptoms.map((symptom) => (
                          <Badge key={symptom} variant="outline" className="text-xs capitalize">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No symptoms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No period entries yet. Start tracking your cycle above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

