"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import LoginForm from "@/components/signin/SigninForm"
import { signIn } from "next-auth/react"
import SignInBanner from "@/components/signin/SigninBanner"

export default function LoginPage() {
  const callbackUrl = "/chat"

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col justify-center w-full max-w-md p-6 mx-auto lg:max-w-2xl lg:w-1/2">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">StudAIng</h1>
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        <p className="text-gray-600 mb-8">Please enter login details below</p>

        <LoginForm />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue</span>
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
              Log in with Google
            </Button>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href={`signup?callbackUrl=${callbackUrl}`} className="font-medium text-blue-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
      {/* Left side of Login on Desktop View */}
      <SignInBanner />
    </div>
  )
}
