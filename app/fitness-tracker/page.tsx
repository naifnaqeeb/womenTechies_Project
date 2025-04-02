"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { format, subDays, startOfWeek, isSameDay } from "date-fns"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Activity,
  TrendingUp,
  Dumbbell,
  Utensils,
  Droplets,
  Edit,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

type ActivityType = "walking" | "running" | "yoga" | "strength" | "cycling" | "swimming" | "other"

type FitnessEntry = {
  id: string
  date: Date
  activityType: ActivityType
  duration: number // in minutes
  calories: number
  notes: string
}

type WaterIntake = {
  date: Date
  amount: number // in ml
}

export default function FitnessTrackerPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [fitnessEntries, setFitnessEntries] = useState<FitnessEntry[]>([])
  const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEntry, setEditingEntry] = useState<FitnessEntry | null>(null)

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [activityType, setActivityType] = useState<ActivityType>("walking")
  const [duration, setDuration] = useState("30")
  const [calories, setCalories] = useState("150")
  const [notes, setNotes] = useState("")
  const [waterAmount, setWaterAmount] = useState("0")

  // Fetch fitness data
  useEffect(() => {
    if (isLoaded && user) {
      const fetchFitnessData = async () => {
        try {
          // In a real app, you would fetch this from your API
          // For now, we'll use mock data
          const mockEntries: FitnessEntry[] = [
            {
              id: "1",
              date: new Date(),
              activityType: "walking",
              duration: 30,
              calories: 150,
              notes: "Morning walk in the park",
            },
            {
              id: "2",
              date: subDays(new Date(), 1),
              activityType: "yoga",
              duration: 45,
              calories: 180,
              notes: "Evening yoga session",
            },
            {
              id: "3",
              date: subDays(new Date(), 2),
              activityType: "strength",
              duration: 60,
              calories: 300,
              notes: "Full body workout",
            },
          ]

          const mockWaterIntake: WaterIntake[] = [
            {
              date: new Date(),
              amount: 1500,
            },
            {
              date: subDays(new Date(), 1),
              amount: 2000,
            },
            {
              date: subDays(new Date(), 2),
              amount: 1800,
            },
          ]

          setFitnessEntries(mockEntries)
          setWaterIntake(mockWaterIntake)
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching fitness data:", error)
          toast({
            title: "Error loading data",
            description: "Failed to load your fitness data. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      }

      fetchFitnessData()
    } else if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router, toast])

  const handleAddEntry = async () => {
    setIsSubmitting(true)

    try {
      const newEntry: FitnessEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        activityType,
        duration: Number.parseInt(duration),
        calories: Number.parseInt(calories),
        notes,
      }

      // In a real app, you would save this to your API
      // await fetch('/api/fitness-tracker', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newEntry)
      // })

      setFitnessEntries([newEntry, ...fitnessEntries])

      toast({
        title: "Activity saved",
        description: `Your fitness activity for ${format(selectedDate, "PPP")} has been saved.`,
      })

      // Reset form
      setSelectedDate(new Date())
      setActivityType("walking")
      setDuration("30")
      setCalories("150")
      setNotes("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving fitness entry:", error)
      toast({
        title: "Error saving activity",
        description: "Failed to save your fitness activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEntry = (entry: FitnessEntry) => {
    setEditingEntry(entry)
    setSelectedDate(new Date(entry.date))
    setActivityType(entry.activityType)
    setDuration(entry.duration.toString())
    setCalories(entry.calories.toString())
    setNotes(entry.notes)
    setIsDialogOpen(true)
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry) return

    setIsSubmitting(true)

    try {
      const updatedEntry: FitnessEntry = {
        ...editingEntry,
        date: selectedDate,
        activityType,
        duration: Number.parseInt(duration),
        calories: Number.parseInt(calories),
        notes,
      }

      // In a real app, you would update this via your API
      // await fetch(`/api/fitness-tracker/${editingEntry.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedEntry)
      // })

      setFitnessEntries(fitnessEntries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry)))

      toast({
        title: "Activity updated",
        description: `Your fitness activity for ${format(selectedDate, "PPP")} has been updated.`,
      })

      // Reset form
      setEditingEntry(null)
      setSelectedDate(new Date())
      setActivityType("walking")
      setDuration("30")
      setCalories("150")
      setNotes("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating fitness entry:", error)
      toast({
        title: "Error updating activity",
        description: "Failed to update your fitness activity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      // In a real app, you would delete this via your API
      // await fetch(`/api/fitness-tracker/${id}`, {
      //   method: 'DELETE'
      // })

      setFitnessEntries(fitnessEntries.filter((entry) => entry.id !== id))

      toast({
        title: "Activity deleted",
        description: "Your fitness activity has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting fitness entry:", error)
      toast({
        title: "Error deleting activity",
        description: "Failed to delete your fitness activity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateWater = async () => {
    try {
      const today = new Date()
      const existingEntryIndex = waterIntake.findIndex((entry) => isSameDay(new Date(entry.date), today))

      if (existingEntryIndex >= 0) {
        // Update existing entry
        const updatedWaterIntake = [...waterIntake]
        updatedWaterIntake[existingEntryIndex] = {
          ...updatedWaterIntake[existingEntryIndex],
          amount: Number.parseInt(waterAmount),
        }
        setWaterIntake(updatedWaterIntake)
      } else {
        // Add new entry
        setWaterIntake([
          {
            date: today,
            amount: Number.parseInt(waterAmount),
          },
          ...waterIntake,
        ])
      }

      toast({
        title: "Water intake updated",
        description: "Your water intake has been updated.",
      })
    } catch (error) {
      console.error("Error updating water intake:", error)
      toast({
        title: "Error updating water intake",
        description: "Failed to update your water intake. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTodayWaterIntake = () => {
    const today = new Date()
    const todayEntry = waterIntake.find((entry) => isSameDay(new Date(entry.date), today))

    return todayEntry ? todayEntry.amount : 0
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "walking":
        return <Activity className="h-5 w-5 text-green-500" />
      case "running":
        return <TrendingUp className="h-5 w-5 text-red-500" />
      case "yoga":
        return <Activity className="h-5 w-5 text-purple-500" />
      case "strength":
        return <Dumbbell className="h-5 w-5 text-blue-500" />
      case "cycling":
        return <Activity className="h-5 w-5 text-orange-500" />
      case "swimming":
        return <Activity className="h-5 w-5 text-cyan-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getWeeklyStats = () => {
    const today = new Date()
    const startOfCurrentWeek = startOfWeek(today)

    let totalDuration = 0
    let totalCalories = 0
    let activeDays = 0

    // Get entries from current week
    const thisWeekEntries = fitnessEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= startOfCurrentWeek && entryDate <= today
    })

    // Calculate stats
    const daysWithActivity = new Set()

    thisWeekEntries.forEach((entry) => {
      totalDuration += entry.duration
      totalCalories += entry.calories
      daysWithActivity.add(format(new Date(entry.date), "yyyy-MM-dd"))
    })

    activeDays = daysWithActivity.size

    return {
      totalDuration,
      totalCalories,
      activeDays,
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  const weeklyStats = getWeeklyStats()

  return (
    <div className="flex min-h-screen flex-col p-6 bg-gradient-to-b from-pink-50 to-purple-50">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-purple-800">Fitness Tracker</h1>
        </div>
        <p className="text-gray-600">Track your workouts, water intake, and monitor your fitness progress.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-white border border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weeklyStats.totalDuration} mins</p>
            <p className="text-xs text-gray-500 mt-1">Across {weeklyStats.activeDays} active days</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
              <Utensils className="h-4 w-4 mr-2" />
              Calories Burned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weeklyStats.totalCalories} kcal</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 flex items-center">
              <Droplets className="h-4 w-4 mr-2" />
              Water Intake Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <p className="text-2xl font-bold">{getTodayWaterIntake()} ml</p>
              <p className="text-sm text-gray-500">/ 2000 ml</p>
            </div>
            <Progress value={(getTodayWaterIntake() / 2000) * 100} className="h-2" />
            <div className="flex items-center gap-2 pt-2">
              <Input
                type="number"
                value={waterAmount}
                onChange={(e) => setWaterAmount(e.target.value)}
                className="w-24"
                min="0"
                max="5000"
              />
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleUpdateWater}>
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Activity" : "Log New Activity"}</DialogTitle>
              <DialogDescription>Record your workout details to track your fitness progress.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Type</label>
                <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Calories Burned</label>
                <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} min="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Add any notes about your workout"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  if (editingEntry) {
                    setEditingEntry(null)
                    setSelectedDate(new Date())
                    setActivityType("walking")
                    setDuration("30")
                    setCalories("150")
                    setNotes("")
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingEntry ? (
                  "Update Activity"
                ) : (
                  "Save Activity"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border border-purple-100">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your most recent workouts</CardDescription>
        </CardHeader>
        <CardContent>
          {fitnessEntries.length > 0 ? (
            <div className="space-y-4">
              {fitnessEntries.map((entry) => (
                <div key={entry.id} className="flex items-start justify-between border-b pb-4">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{getActivityIcon(entry.activityType)}</div>
                    <div>
                      <p className="font-medium capitalize">{entry.activityType}</p>
                      <p className="text-sm text-gray-500">{format(new Date(entry.date), "PPP")}</p>
                      <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.duration} mins</p>
                    <p className="text-sm text-gray-500">{entry.calories} kcal</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditEntry(entry)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No activities logged yet. Start tracking your workouts above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

