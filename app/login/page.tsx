"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://roboclub-server-70e29f041ab3.herokuapp.com'
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token (e.g., in localStorage for now)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data as well
        setSuccess("Login successful");
        setTimeout(() => {
          window.location.href = "/"; // Redirect to home page
        }, 1500);
      } else {
        if (response.status === 403 && (data.message || '').toLowerCase().includes('not verified')) {
          setError('Email not verified.');
          // Offer quick navigation to verify page
          setTimeout(() => {
            window.location.href = `/verify-email?email=${encodeURIComponent(loginForm.email)}`
          }, 800)
        } else {
          setError(data.message || "Invalid credentials");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error or server is unreachable.");
    }
  };

  // Registration moved to separate page

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image src="/roboclub-logo.png" alt="RoboClub Logo" width={40} height={40} className="object-contain" />
              <span className="text-xl font-bold text-black">
                RoboClub
              </span>
            </div>
    <div className="flex items-center gap-6 text-sm font-medium">
      <Link href="/login" className="text-blue-600">Login</Link>
      <Link href="/register" className="hover:text-blue-600 text-slate-700">Register</Link>
    </div>
          </div>
        </div>
      </nav>

  <div className="max-w-md mx-auto px-4 py-12">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome to RoboClub</CardTitle>
          </CardHeader>
          <CardContent>
    <div className="mt-2">
                <form onSubmit={handleLogin} className="space-y-2">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex justify-end mt-1">
                      <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                  </div>

                  <div className="min-h-[14px] flex items-center justify-center -mt-1">
                    {error && <p className="text-[11px] text-red-600">{error}</p>}
                    {success && <p className="text-[11px] text-green-600">{success}</p>}
                  </div>
                  <Button type="submit" className="w-full !mt-1">Login</Button>
                  <p className="text-xs text-center text-slate-600">Don't have an account? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register</Link></p>
                </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
