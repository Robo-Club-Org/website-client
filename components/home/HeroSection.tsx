"use client"

import { Search, ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to the Future of
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Electronics & Robotics
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover cutting-edge components, development boards, and maker tools. Build tomorrow's innovations today
              with our premium electronics collection.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for Arduino, Raspberry Pi, sensors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-full border-0 bg-white/90 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 h-8 text-sm"
                >
                  Search
                </Button>
              </div>
            </form>

            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 text-lg font-semibold"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Electronics Projects & PCB Design Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            We Build Custom Electronics Projects & PCB Designs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            From concept to prototype, we help you bring your ideas to life. Our team specializes in embedded systems, IoT, robotics, and high-quality custom PCB design and manufacturing.
          </p>
          <Link href="/projects">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 text-base rounded-full font-semibold"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              View Our Projects
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
