import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AuraAwaaz - Your AI-powered women's health companion",
  description: "Track your health, mood, and wellness with personalized insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}

