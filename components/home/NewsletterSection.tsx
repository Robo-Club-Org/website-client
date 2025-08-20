"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState("")

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterStatus("Thank you for subscribing!")
    setEmail("")
    setTimeout(() => setNewsletterStatus(""), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated with Latest Tech</h2>
        <p className="text-xl text-blue-100 mb-8">
          Get exclusive deals, new product launches, and maker tutorials delivered to your inbox
        </p>

        <form onSubmit={handleNewsletter} className="max-w-md mx-auto">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/90 backdrop-blur-sm border-0 rounded-full"
            />
            <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">
              Subscribe
            </Button>
          </div>
        </form>

        {newsletterStatus && <p className="mt-4 text-yellow-300 font-medium">{newsletterStatus}</p>}
      </div>
    </section>
  )
}