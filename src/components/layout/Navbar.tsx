"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NavbarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold items-center space-x-1 flex flex-row">
              <span className="sr-only">Home</span>
              <Image className="rounded-full hidden md:block" src={"/logo.png"} alt="" width={35} height={35} />
              <span>StudAIng</span>
            </Link>
            {(isSidebarOpen !== undefined && setIsSidebarOpen !== undefined) &&
              <Button
                variant="outline"
                className="block ml-3 z-50 md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                Chat History
              </Button>
            }
          </div>
          <div className="">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function AuthButton() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <Image className="rounded-full hidden md:block" src={session?.user?.image || "/default-profile.jpg"} alt="" width={35} height={35} />
        <Button variant="default" className="bg-black rounded-full text-white hover:bg-gray-800 mx-2 md:m-0" onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }

  return (
    <>
      <Button variant="default" className="bg-black rounded-full text-white hover:bg-gray-800" onClick={() => signIn()}>Sign in</Button>
    </>
  )
}