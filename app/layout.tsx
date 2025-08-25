import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartDrawer } from "@/components/cart-drawer"
import { Toaster } from "@/components/toaster"
import { OrderProvider } from "@/context/OrderContext";
import { OrganizationJsonLd } from "@/components/organization-jsonld"
import { WebSiteJsonLd } from "@/components/website-jsonld"
import { LocalBusinessJsonLd } from "@/components/localbusiness-jsonld"
import GoogleServices from "@/components/google-services"


const inter = Inter({ subsets: ["latin"] })


export { metadata } from "./metadata"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="image_src" href="/og-image.jpg" />
            <GoogleServices />
          </head>
          <body className={inter.className}>
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <LocalBusinessJsonLd />
            <OrderProvider>
              {children}
              <CartDrawer />
              <Toaster />
            </OrderProvider>
          </body>
        </html>
  )
}
