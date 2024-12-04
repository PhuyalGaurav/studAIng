"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { signIn } from "next-auth/react"
import SignupBanner from "@/components/signup/SignupBanner"
import SignupForm from "@/components/signup/SignupForm"

export default function RegisterPage() {
  const callbackUrl = "/chat"

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center w-full max-w-md p-6 mx-auto lg:max-w-2xl lg:w-1/2">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">StudAIng</h1>
        </div>
        <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
        <p className="text-gray-600 mb-8">Sign up and start learning with interactive UI components</p>

        <SignupForm />
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn('google', { callbackUrl })}
            >
              <Image
                src="/google-icon.png?height=20&width=20"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Sign up with Google
            </Button>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href={`signin?callbackUrl=${callbackUrl}`} className="font-medium text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
      {/* Left side of signup */}
      <SignupBanner />
    </div>
  )
}