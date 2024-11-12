'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowUpRight } from "lucide-react"
import { useRouter } from 'next/navigation'

interface LandingPageProps {
  onTryClick: () => void;
  showContent: boolean;
}

export function LandingPageComponent({ onTryClick, showContent }: LandingPageProps) {
  const [activeSection, setActiveSection] = useState("home")
  const router = useRouter();

  const handleTryClick = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <div className={`bg-black text-white font-sans relative ${showContent ? 'h-auto' : 'min-h-screen'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-green-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col">
          {!showContent && (
            <main className="container mx-auto mt-32 p-4 flex flex-col items-center justify-center">
              <div className="max-w-3xl text-center">
                <h2 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-white">
                  The Bloomberg Terminal for Prediction Markets
                </h2>
                <p className="text-xl text-gray-300 mb-12">
                  Find arbitrage and analyze trades on Kalshi and Polymarket in seconds.
                </p>

                <div className="mt-12">
                  <Button 
                    onClick={handleTryClick}
                    className="bg-green-500 hover:bg-green-600 text-black py-6 px-12 rounded-lg text-xl inline-flex items-center gap-2 transition-all hover:scale-105"
                  >
                    Try<ArrowUpRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </>
  )
}