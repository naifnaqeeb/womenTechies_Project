"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    lastPeriodDate: undefined as Date | undefined,
    periodDuration: "",
    birthControl: "",
    moodSwings: [] as string[],
  })
  const [date, setDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is loaded
    if (isLoaded) {
      if (!user) {
        router.push("/")
        return
      }

      // Check if user has already completed onboarding
      const checkUserHealth = async () => {
        try {
          const response = await fetch("/api/user-health")

          // If response is not ok, handle the error but don't redirect
          if (!response.ok) {
            // If it's a 404 (user not found), that's expected for new users
            if (response.status === 404) {
              setIsLoading(false)
              return
            }

            const errorText = await response.text()
            console.error("API Error:", errorText)
            setIsLoading(false)
            return
          }

          const data = await response.json()

          if (data.exists) {
            // User has already completed onboarding, redirect to dashboard
            router.push("/dashboard")
          } else {
            // User hasn't completed onboarding yet
            setIsLoading(false)
          }
        } catch (error) {
          console.error("Error checking user health data:", error)
          setIsLoading(false)
        }
      }

      checkUserHealth()
    }
  }, [isLoaded, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.lastPeriodDate) {
        toast({
          title: "Missing information",
          description: "Please select your last period date",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Send data to API
      const response = await fetch("/api/user-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // If response is not ok, handle the error
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error("Failed to save health data")
      }

      const data = await response.json()

      toast({
        title: "Profile saved",
        description: "Your health profile has been saved successfully",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error saving health data:", error)
      toast({
        title: "Error saving profile",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleMoodSwingChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, moodSwings: [...prev.moodSwings, value] }
      } else {
        return { ...prev, moodSwings: prev.moodSwings.filter((item) => item !== value) }
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-800">Tell us about yourself</CardTitle>
          <CardDescription>
            This information helps us personalize your experience and provide more accurate insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height in cm"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>

              {/* Last Period Date */}
              <div className="space-y-2">
                <Label>When was the start date of your last period?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setFormData({ ...formData, lastPeriodDate: date || undefined })
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Period Duration */}
              <div className="space-y-2">
                <Label htmlFor="periodDuration">How many days does your period usually last?</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, periodDuration: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 days</SelectItem>
                    <SelectItem value="4-5">4-5 days</SelectItem>
                    <SelectItem value="6-7">6-7 days</SelectItem>
                    <SelectItem value="8+">8+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Control */}
              <div className="space-y-2">
                <Label>Are you on birth control?</Label>
                <RadioGroup onValueChange={(value) => setFormData({ ...formData, birthControl: value })} required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="birth-control-yes" />
                    <Label htmlFor="birth-control-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="birth-control-no" />
                    <Label htmlFor="birth-control-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Mood Swings */}
            <div className="space-y-2">
              <Label>How intense are your mood swings? (Select all that apply)</Label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mood-mild"
                    onCheckedChange={(checked) => handleMoodSwingChange("mild", checked as boolean)}
                  />
                  <Label htmlFor="mood-mild">Mild - Barely noticeable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mood-moderate"
                    onCheckedChange={(checked) => handleMoodSwingChange("moderate", checked as boolean)}
                  />
                  <Label htmlFor="mood-moderate">Moderate - Noticeable but manageable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mood-severe"
                    onCheckedChange={(checked) => handleMoodSwingChange("severe", checked as boolean)}
                  />
                  <Label htmlFor="mood-severe">Severe - Significantly impacts daily life</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mood-none"
                    onCheckedChange={(checked) => handleMoodSwingChange("none", checked as boolean)}
                  />
                  <Label htmlFor="mood-none">I don't experience mood swings</Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save and Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

