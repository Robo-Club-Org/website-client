import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/toaster"
import { OrderProvider } from "@/context/OrderContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RoboClub - Electronics & Robotics Store",
  description: "Your trusted partner for electronics, robotics, and maker supplies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
          <body className={inter.className}>
            <OrderProvider>
              {children}
              <CartDrawer />
              <Toaster />
            </OrderProvider>
          </body>
        </html>
  )
}
