import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/toaster"
import { OrderProvider } from "@/context/OrderContext";
import { metadata } from "./metadata"
import { OrganizationJsonLd } from "@/components/organization-jsonld"
import { GoogleServices } from "@/components/google-services"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en">
          <head>
            <GoogleServices 
              searchConsoleVerification="REPLACE_WITH_YOUR_VERIFICATION_CODE" 
              analyticsId="G-REPLACE_WITH_YOUR_ANALYTICS_ID" 
            />
          </head>
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
