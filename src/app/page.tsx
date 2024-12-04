/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Navbar from "@/components/layout/Navbar"
import { FlipWords } from "@/components/ui/flip-words"
import { useRef } from "react"
import { Highlighted } from "@/components/ui/hero-highlight"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
export default function Home() {
  const words = ["Enhanced Learning", "Better Learning", "Engaged Learning", "Easier Learning"]
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  return (
    <div className="w-screen flex flex-col min-h-screen">
      <Navbar />
      <section className="flex flex-col lg:flex-row w-screen bg-gray-100 px-6 md:px-8 lg:px-12 xl:px-20 py-20 xl:gap-16">
        <div className="w-full lg:w-1/2">
          <h1 className="text-5xl sm:text-6xl font-bold mb-2 relative text-center lg:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-950 to-yellow-500 animate-gradient-x">
              StudAIng
            </span>
          </h1>
          <p className="text-2xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl mt-8 font-bold text-center lg:text-left">
            <Highlighted className="text-black dark:text-white">
            Flashcards, Quizzes, Vizualization 
            </Highlighted> {" "}
            for
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl font-bold mt-1 text-center lg:text-left">
            <FlipWords words={words} className='text-blue-800' />
          </h1>
          <div className="w-full flex">
            <button className="mt-4 md:mt-6 lg:mt-8 px-5 md:px-6 lg:px-8 xl:px-10 py-1 lg:py-2 text-lg md:text-lg lg:text-xl bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-100 transform hover:scale-105 shadow-lg mx-auto lg:mx-0"
              onClick={() => router.push("/chat")}
            >
              get started
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
          <div className="relative group/card w-full rounded-2xl aspect-[16/9] border-2 border-gray-400 shadow-xl">
            <video
              ref={videoRef}
              src="/videos/hero-video.mp4"
              className="object-cover rounded-2xl w-full h-full"
              onEnded={handleVideoEnd}
              autoPlay
              muted
            />
          </div>
        </div>
      </section>
      <section className="w-full flex flex-col px-6 md:px-8 lg:px-12 xl:px-20 py-20 bg-dot-black/[0.1] space-y-16">
        <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold">Features</h1>
        <div className="flex flex-col-reverse lg:flex-row w-full">
          <div className="w-3/4 lg:w-1/2 mt-8 lg:mt-0 mx-auto">
            <div className="relative group/card w-full rounded-2xl aspect-[16/9] border-2 border-gray-400 shadow-xl">
              <video
                ref={videoRef}
                src="/videos/basic-features.mp4"
                className="object-cover rounded-2xl w-full h-full"
                autoPlay
                muted
                loop
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:mt-8 text-center lg:text-left lg:ml-16 font-semibold mb-2 relative">
              Interactive study components
            </h1>
            <p className="text-base sm:text-xl lg:text-xl xl:text-2xl mt-4 text-center lg:text-left lg:ml-16">
              Engage with presentations, flashcards, quizzes, and other interactive components designed to make you learning time, more efficient.
            </p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:mt-8 text-center lg:text-left lg:ml-16 font-semibold mb-2 relative">
              Advanced AI canvas
            </h1>
            <p className="text-base pr-8 sm:text-xl lg:text-xl xl:text-2xl mt-4 text-center lg:text-left lg:ml-16">
              Create, draw, and illustrate complex problems for StudAIng to solve and explain.
            </p>
          </div>
          <div className="w-3/4 lg:w-1/2 mt-8 lg:mt-0 mx-auto">
            <div className="relative group/card w-full rounded-2xl aspect-[16/9] border-2 border-gray-400 shadow-xl">
              <video
                ref={videoRef}
                src="/videos/draw-feature.mp4"
                className="object-cover rounded-2xl w-full h-full"
                autoPlay
                muted
                loop
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row w-full">
          <div className="w-3/4 lg:w-1/2 mt-8 lg:mt-0 mx-auto">
            <div className="relative group/card w-full rounded-2xl aspect-[16/9] border-2 border-gray-400 shadow-xl">
              <video
                ref={videoRef}
                src="/videos/physics-feature.mp4"
                className="object-cover rounded-2xl w-full h-full"
                autoPlay
                muted
                loop
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:mt-8 text-center lg:text-left lg:ml-16 font-semibold mb-2 relative">
              Physics Simulator
            </h1>
            <p className="text-base sm:text-xl lg:text-xl xl:text-2xl mt-4 text-center lg:text-left lg:ml-16">
              Experience real-time physics simulations to understand complex concepts through interactive and visual experimentation.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}