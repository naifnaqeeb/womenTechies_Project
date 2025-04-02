"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { format, subDays } from "date-fns"
import { ArrowLeft, Loader2, Calendar, Plus, Smile, Frown, Meh, Heart, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

type MoodEntry = {
  id: string
  date: Date
  mood: "happy" | "neutral" | "sad" | "loved"
  notes: string
}

export default function MoodJournalPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad" | "loved">("happy")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null)

  // Fetch mood entries
  useEffect(() => {
    if (isLoaded && user) {
      const fetchMoodEntries = async () => {
        try {
          // In a real app, you would fetch this from your API
          // For now, we'll use mock data
          const mockEntries: MoodEntry[] = [
            {
              id: "1",
              date: new Date(),
              mood: "happy",
              notes: "Had a great day today! Feeling energetic and positive.",
            },
            {
              id: "2",
              date: subDays(new Date(), 1),
              mood: "neutral",
              notes: "Just an ordinary day. Nothing special happened.",
            },
            {
              id: "3",
              date: subDays(new Date(), 2),
              mood: "sad",
              notes: "Feeling a bit down today. Might be related to my cycle.",
            },
          ]

          setMoodEntries(mockEntries)
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching mood entries:", error)
          toast({
            title: "Error loading data",
            description: "Failed to load your mood journal. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      }

      fetchMoodEntries()
    } else if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router, toast])

  const handleAddEntry = async () => {
    setIsSubmitting(true)

    try {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        mood: selectedMood,
        notes,
      }

      // In a real app, you would save this to your API
      // await fetch('/api/mood-journal', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newEntry)
      // })

      setMoodEntries([newEntry, ...moodEntries])

      toast({
        title: "Entry saved",
        description: `Your mood entry for ${format(selectedDate, "PPP")} has been saved.`,
      })

      // Reset form
      setSelectedDate(new Date())
      setSelectedMood("happy")
      setNotes("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving mood entry:", error)
      toast({
        title: "Error saving entry",
        description: "Failed to save your mood entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEntry = (entry: MoodEntry) => {
    setEditingEntry(entry)
    setSelectedDate(new Date(entry.date))
    setSelectedMood(entry.mood)
    setNotes(entry.notes)
    setIsDialogOpen(true)
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry) return

    setIsSubmitting(true)

    try {
      const updatedEntry: MoodEntry = {
        ...editingEntry,
        date: selectedDate,
        mood: selectedMood,
        notes,
      }

      // In a real app, you would update this via your API
      // await fetch(`/api/mood-journal/${editingEntry.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedEntry)
      // })

      setMoodEntries(moodEntries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry)))

      toast({
        title: "Entry updated",
        description: `Your mood entry for ${format(selectedDate, "PPP")} has been updated.`,
      })

      // Reset form
      setEditingEntry(null)
      setSelectedDate(new Date())
      setSelectedMood("happy")
      setNotes("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error updating mood entry:", error)
      toast({
        title: "Error updating entry",
        description: "Failed to update your mood entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      // In a real app, you would delete this via your API
      // await fetch(`/api/mood-journal/${id}`, {
      //   method: 'DELETE'
      // })

      setMoodEntries(moodEntries.filter((entry) => entry.id !== id))

      toast({
        title: "Entry deleted",
        description: "Your mood entry has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting mood entry:", error)
      toast({
        title: "Error deleting entry",
        description: "Failed to delete your mood entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "happy":
        return <Smile className="h-6 w-6 text-green-500" />
      case "neutral":
        return <Meh className="h-6 w-6 text-amber-500" />
      case "sad":
        return <Frown className="h-6 w-6 text-red-500" />
      case "loved":
        return <Heart className="h-6 w-6 text-pink-500" />
      default:
        return <Smile className="h-6 w-6 text-green-500" />
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
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-purple-800">Mood Journal</h1>
        </div>
        <p className="text-gray-600">
          Track your daily moods and emotions to identify patterns and improve your well-being.
        </p>
      </header>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Mood Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Mood Entry" : "Add Mood Entry"}</DialogTitle>
              <DialogDescription>Record how you're feeling today and any notes you want to remember.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">How are you feeling?</label>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant={selectedMood === "happy" ? "default" : "outline"}
                    className={cn("flex-1 mx-1", selectedMood === "happy" ? "bg-green-500 hover:bg-green-600" : "")}
                    onClick={() => setSelectedMood("happy")}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMood === "neutral" ? "default" : "outline"}
                    className={cn("flex-1 mx-1", selectedMood === "neutral" ? "bg-amber-500 hover:bg-amber-600" : "")}
                    onClick={() => setSelectedMood("neutral")}
                  >
                    <Meh className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMood === "sad" ? "default" : "outline"}
                    className={cn("flex-1 mx-1", selectedMood === "sad" ? "bg-red-500 hover:bg-red-600" : "")}
                    onClick={() => setSelectedMood("sad")}
                  >
                    <Frown className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMood === "loved" ? "default" : "outline"}
                    className={cn("flex-1 mx-1", selectedMood === "loved" ? "bg-pink-500 hover:bg-pink-600" : "")}
                    onClick={() => setSelectedMood("loved")}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="How are you feeling today? Any specific thoughts or events to note?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
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
                    setSelectedMood("happy")
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
                  "Update Entry"
                ) : (
                  "Save Entry"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {moodEntries.length > 0 ? (
              moodEntries.map((entry) => (
                <Card key={entry.id} className="bg-white border border-purple-100">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{format(new Date(entry.date), "PPP")}</CardTitle>
                      <CardDescription>
                        {new Date(entry.date).toLocaleDateString() === new Date().toLocaleDateString()
                          ? "Today"
                          : format(new Date(entry.date), "EEEE")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">{getMoodIcon(entry.mood)}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{entry.notes}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEntry(entry)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-purple-100">
                <p className="text-gray-500">No mood entries yet. Start tracking your mood by adding an entry.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="bg-white border border-purple-100">
            <CardHeader>
              <CardTitle>Mood Calendar</CardTitle>
              <CardDescription>View your mood patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={new Date()}
                className="rounded-md border"
                modifiers={{
                  happy: moodEntries.filter((entry) => entry.mood === "happy").map((entry) => new Date(entry.date)),
                  sad: moodEntries.filter((entry) => entry.mood === "sad").map((entry) => new Date(entry.date)),
                  neutral: moodEntries.filter((entry) => entry.mood === "neutral").map((entry) => new Date(entry.date)),
                  loved: moodEntries.filter((entry) => entry.mood === "loved").map((entry) => new Date(entry.date)),
                }}
                modifiersStyles={{
                  happy: { backgroundColor: "#10b981", color: "white", borderRadius: "9999px" },
                  sad: { backgroundColor: "#ef4444", color: "white", borderRadius: "9999px" },
                  neutral: { backgroundColor: "#f59e0b", color: "white", borderRadius: "9999px" },
                  loved: { backgroundColor: "#ec4899", color: "white", borderRadius: "9999px" },
                }}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs">Happy</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                  <span className="text-xs">Neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs">Sad</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-pink-500 mr-1"></div>
                  <span className="text-xs">Loved</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

