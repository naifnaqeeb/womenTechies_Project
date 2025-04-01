"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-purple-800">Sign In</h1>
        </div>

        {/* Clerk Sign In Component */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
          <SignIn
            appearance={{
              layout: {
                showOptionalFields: true,
                socialButtonsPlacement: "bottom", // Optional
              },
              variables: {
                colorPrimary: "#9333ea", // Purple primary color
              },
            }}
            redirectUrl={redirectUrl}
            signUpUrl="/auth/register"
          />
        </div>
      </div>
    </div>
  );
}
