import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/toaster"
import { OrderProvider } from "@/context/OrderContext";
import { metadata } from "./metadata"
import { OrganizationJsonLd } from "@/components/organization-jsonld"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
          <body className={inter.className}>
            <OrganizationJsonLd />
            <OrderProvider>
              {children}
              <CartDrawer />
              <Toaster />
            </OrderProvider>
          </body>
        </html>
  )
}
