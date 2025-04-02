// import { type NextRequest, NextResponse } from "next/server"
// import { auth, currentUser } from "@clerk/nextjs/server"
// import connectToDatabase from "@/lib/mongodb"
// import UserHealth from "@/models/UserHealth"

// // GET handler to fetch user health data
// export async function GET(req: NextRequest) {
//   try {
//     // Check authentication
//     const  userId  = auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get user from Clerk
//     const user = await currentUser()
//     if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
//       return NextResponse.json({ error: "User email not found" }, { status: 400 })
//     }

//     // Get primary email
//     const primaryEmail = user.emailAddresses[0].emailAddress

//     // Connect to the database
//     await connectToDatabase()

//     // Find user health data by email
//     const userHealth = await UserHealth.findOne({ email: primaryEmail })

//     if (!userHealth) {
//       return NextResponse.json({ exists: false }, { status: 404 })
//     }

//     return NextResponse.json({
//       exists: true,
//       data: userHealth,
//     })
//   } catch (error) {
//     console.error("Error fetching user health data:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // POST handler to create or update user health data
// export async function POST(req: NextRequest) {
//   try {
//     // Check authentication
//     const  userId  = auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get user from Clerk
//     const user = await currentUser()
//     if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
//       return NextResponse.json({ error: "User email not found" }, { status: 400 })
//     }

//     // Get primary email
//     const primaryEmail = user.emailAddresses[0].emailAddress

//     // Parse request body
//     const body = await req.json()

//     // Validate required fields
//     const requiredFields = ["age", "height", "weight", "lastPeriodDate", "periodDuration", "birthControl", "moodSwings"]
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
//       }
//     }

//     // Connect to the database
//     await connectToDatabase()

//     // Create or update user health data
//     const userHealth = await UserHealth.findOneAndUpdate(
//       { email: primaryEmail },
//       {
//         email: primaryEmail,
//         age: body.age,
//         height: body.height,
//         weight: body.weight,
//         lastPeriodDate: new Date(body.lastPeriodDate),
//         periodDuration: body.periodDuration,
//         birthControl: body.birthControl,
//         moodSwings: body.moodSwings,
//       },
//       { new: true, upsert: true },
//     )

//     return NextResponse.json({
//       success: true,
//       data: userHealth,
//     })
//   } catch (error: any) {
//     console.error("Error saving user health data:", error)
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error.message,
//       },
//       { status: 500 },
//     )
//   }
// }

