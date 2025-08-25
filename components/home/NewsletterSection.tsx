"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState("")
  const [statusType, setStatusType] = useState<"success" | "error" | "">("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hp, setHp] = useState("") // honeypot

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(email)) {
      setStatusType("error")
      setNewsletterStatus("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    setStatusType("")
    setNewsletterStatus("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter:home", hp })
      })
      if (res.ok) {
        setStatusType("success")
        setNewsletterStatus("Thank you for subscribing!")
        setEmail("")
        setTimeout(() => setNewsletterStatus(""), 3500)
      } else {
        const data = await res.json().catch(() => ({} as any))
        setStatusType("error")
        setNewsletterStatus(data?.error || "Subscription failed. Please try again.")
      }
    } catch (err) {
      setStatusType("error")
      setNewsletterStatus("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
              disabled={isSubmitting}
              className="flex-1 bg-white/90 backdrop-blur-sm border-0 rounded-full"
            />
            {/* Honeypot field for bots */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              className="hidden"
            />
            <Button type="submit" disabled={isSubmitting} className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8">
              {isSubmitting ? "Submitting..." : "Subscribe"}
            </Button>
          </div>
        </form>

        {newsletterStatus && (
          <p
            className={
              `mt-4 font-medium ` +
              (statusType === "success" ? "text-green-200" : statusType === "error" ? "text-red-200" : "text-yellow-300")
            }
            aria-live="polite"
          >
            {newsletterStatus}
          </p>
        )}
      </div>
    </section>
  )
}