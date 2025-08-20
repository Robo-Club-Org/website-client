"use client"
import { useEffect, useState } from 'react'
import { Navigation } from "@/components/home/Navigation"
import { HeroSection } from "@/components/home/HeroSection"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { BrandsSection } from "@/components/home/BrandsSection"
import { NewsletterSection } from "@/components/home/NewsletterSection"
import { Footer } from "@/components/home/Footer"
import { brands ,  mockProducts } from "@/lib/constants" 
import Image from "next/image"
import gif from "../public/Spinner.gif"

import type { Product as FeaturedCardProduct } from "@/lib/constants"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedCardProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const fetchFeaturedProducts = async () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/featured`;
      console.log('Fetching featured products from:', apiUrl);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const mapped: FeaturedCardProduct[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p.id?.toString() || '',
          name: p.name || '',
          price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
          image: (Array.isArray(p.imageUrls) && p.imageUrls[0]) || p.imageUrl || '/placeholder.svg',
          category: (p.category?.name || p.categories?.[0]?.category?.name || p.categories?.[0]?.name || 'Uncategorized'),
          description: p.description || '',
          rating: p.rating || 4.8,
          reviews: p.reviews || 120,
          brand: p.brand?.name || 'Generic',
          inStock: (p.stockQuantity ?? 0) > 0,
          sku: p.sku || undefined,
          // attach itemCode for display (component reads it via any)
          ...(p.itemCode ? { itemCode: p.itemCode } : {}),
          // Also pass slug if present so links work
          ...(p.slug ? { slug: p.slug } : {}),
        }))
        setFeaturedProducts(mapped)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }


  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Image src={gif} alt="Loading..." width={256} height={256} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <BrandsSection brands={brands} />
      <NewsletterSection />
      <Footer />
    </div>
  )
}