"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const passwordStrength = (pw: string) => {
    if (pw.length < 8) return 'Too short'
    const hasLetter = /[A-Za-z]/.test(pw)
    const hasNumber = /\d/.test(pw)
    const hasSymbol = /[^A-Za-z0-9]/.test(pw)
    const score = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length
    if (score === 1) return 'Weak'
    if (score === 2) return 'Medium'
    return 'Strong'
  }
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields (phone required)")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (form.password.length < 8 || !(/[A-Za-z]/.test(form.password) && /\d/.test(form.password))) {
      setError('Password must be at least 8 chars and include a letter and a number')
      return
    }

    try {
      setLoading(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
  const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }
  setSuccess('Registered! Check your email for the OTP to verify your account.')
  setTimeout(() => { window.location.href = `/verify-email?email=${encodeURIComponent(form.email)}` }, 1200)
    } catch (err) {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/roboclub-logo.png" alt="RoboClub Logo" width={40} height={40} className="object-contain" />
              <span className="text-xl font-bold text-black">RoboClub</span>
            </div>
    <div className="flex items-center gap-6 text-sm font-medium">
      <Link href="/login" className="hover:text-blue-600 text-slate-700">Login</Link>
      <Link href="/register" className="text-blue-600">Register</Link>
    </div>
          </div>
        </div>
      </nav>

  <div className="max-w-md mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => handleChange('password', e.target.value)} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.password && (
                  <p className="mt-1 text-xs text-slate-600">Strength: <span className="font-medium">{passwordStrength(form.password)}</span></p>
                )}
                <p className="mt-1 text-xs text-slate-500">Use at least 8 characters including a number and a symbol for a strong password.</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="min-h-[14px] flex items-center justify-center -mt-1">
                {error && <p className="text-[11px] text-red-600">{error}</p>}
                {success && <p className="text-[11px] text-green-600">{success}</p>}
              </div>
              <Button type="submit" className="w-full !mt-1" disabled={loading}>
                {loading ? 'Creating...' : 'Register'}
              </Button>
              <p className="text-xs text-center text-slate-600">Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
