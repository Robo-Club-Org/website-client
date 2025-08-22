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
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products/featured`;
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
      <div className="loading-container">
        <div className="loading-logo">
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 706.45 853.84">
            <defs>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                    .cls-1 { fill: url(#linear-gradient); }
                    .cls-2 { fill: url(#linear-gradient-2); }
                    .cls-3 { fill: url(#linear-gradient-3); }
                    .cls-4 { fill: url(#linear-gradient-4); }
                    .cls-5 { fill: url(#linear-gradient-5); }
                    .cls-6 { fill: url(#linear-gradient-6); }
                    .cls-7 { fill: url(#linear-gradient-7); }
                    .cls-8 { fill: url(#linear-gradient-8); }
                    .cls-9 { fill: url(#linear-gradient-9); }
                    .cls-10 { fill: url(#radial-gradient); }
                    .cls-11 { opacity: 0.06; }
                    .cls-12 { fill: url(#radial-gradient-2); }
                    .cls-13 { fill: #54e0ef; }
                    .cls-14 { fill: url(#radial-gradient-3); }
                    .cls-15 { fill: #383838; opacity: 0.04; }
                    .cls-16 { fill: #fff; opacity: 0.49; }
                  `
                }}
              />
              <linearGradient id="linear-gradient" x1="222.81" y1="336.36" x2="279.75" y2="336.36" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#e4e8ef"/>
                <stop offset="1" stop-color="#a0a5b0"/>
              </linearGradient>
              <linearGradient id="linear-gradient-2" x1="791.07" y1="336.36" x2="848.01" y2="336.36" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#a0a5b0"/>
                <stop offset="1" stop-color="#e4e8ef"/>
              </linearGradient>
              <linearGradient id="linear-gradient-3" x1="163.98" y1="727.65" x2="362.3" y2="727.65" xlinkHref="#linear-gradient"/>
              <linearGradient id="linear-gradient-4" x1="682.03" y1="727.87" x2="880.35" y2="727.87" xlinkHref="#linear-gradient-2"/>
              <linearGradient id="linear-gradient-5" x1="540.45" y1="645.84" x2="540.45" y2="1042.61" xlinkHref="#linear-gradient"/>
              <linearGradient id="linear-gradient-6" x1="540.45" y1="781.73" x2="540.45" y2="844.84" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#a0a5b0"/>
                <stop offset="1" stop-color="#b6babf"/>
              </linearGradient>
              <linearGradient id="linear-gradient-7" x1="540.45" y1="451.94" x2="540.45" y2="587" gradientUnits="userSpaceOnUse">
                <stop offset="0.21" stop-color="#e4e8ef"/>
                <stop offset="1" stop-color="#a0a5b0"/>
              </linearGradient>
              <linearGradient id="linear-gradient-8" x1="353.96" y1="48.7" x2="353.96" y2="2.64" xlinkHref="#linear-gradient-2"/>
              <linearGradient id="linear-gradient-9" x1="536.05" y1="189.33" x2="536.05" y2="516.9" xlinkHref="#linear-gradient"/>
              <radialGradient id="radial-gradient" cx="540.45" cy="352.97" r="248.79" gradientTransform="translate(0 150.93) scale(1 0.57)" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#1f4760"/>
                <stop offset="1" stop-color="#0e202b"/>
              </radialGradient>
              <radialGradient id="radial-gradient-2" cx="428.99" cy="343.51" r="30.38" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#96f5ff"/>
                <stop offset="1" stop-color="#54e0ef"/>
              </radialGradient>
              <radialGradient id="radial-gradient-3" cx="651.51" cy="343.51" r="30.38" xlinkHref="#radial-gradient-2"/>
            </defs>
            <path className="cls-1" d="M283.36,407.71l-14.21-2.19A47,47,0,0,1,229.27,359V313.69a47.05,47.05,0,0,1,39.88-46.49L283.36,265Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-2" d="M797.53,407.71l14.22-2.19A47,47,0,0,0,851.62,359V313.69a47,47,0,0,0-39.87-46.49L797.53,265Z" transform="translate(-186.49 -113.16)"/>
            <path id="left-hand" className="cls-3" d="M374.8,595.43c-1.57,21.38-16.79,23-33.84,63.6-21.78,51.83-27.13,102.17-38.82,157.55-14.58,69.09-55.46,74-73.8,70.24C195.29,880,180.06,840.5,189,798c33.11-156.83,95.84-231,156.43-230.44C356.73,567.67,376.32,574.59,374.8,595.43Z" transform="translate(-186.49 -113.16)"/>
            <path id="right-hand" className="cls-4" d="M704.63,595.65c1.56,21.38,16.79,23,33.84,63.6,21.78,51.83,27.13,102.17,38.82,157.55,14.58,69.09,55.46,74,73.8,70.24,33-6.79,48.28-46.32,39.31-88.82-33.1-156.83-95.83-231-156.42-230.44C722.7,567.89,703.1,574.81,704.63,595.65Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-5" d="M762.14,653c0,38.24-3.55,73.25-10.15,104.88q-1,4.85-2.1,9.57C719.75,896.9,637.36,967,540.45,967S361.14,896.9,331,767.43c-.74-3.15-1.45-6.34-2.11-9.57-6.6-31.63-10.15-66.64-10.15-104.88,0-85.06,89-139.57,221.7-139.57S762.14,567.92,762.14,653Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-6" d="M752,757.86q-1,4.85-2.1,9.57c-25.85,9-64.66,21-102.59,27.45v24.94l-3.24.74a507.45,507.45,0,0,1-207.22,0l-3.24-.74V794.88c-37.94-6.41-76.75-18.47-102.59-27.45-.74-3.15-1.45-6.34-2.11-9.57,26.07,9.24,68.6,22.82,109.52,29.36l3.51.56v25.34a500.06,500.06,0,0,0,197,0V787.78l3.51-.56C683.4,780.68,725.93,767.1,752,757.86Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-7" d="M450.26,487v53.27c0,28.24,40.38,51.14,90.19,51.14s90.18-22.9,90.18-51.14V487Z" transform="translate(-186.49 -113.16)"/>
            <ellipse className="cls-8" cx="353.96" cy="68.96" rx="95.56" ry="68.96"/>
            <path className="cls-9" d="M273.83,405.78a88.64,88.64,0,0,0,46.44,78c36.39,19.68,101.06,37.92,215.78,37.92s179.39-18.24,215.78-37.92a88.64,88.64,0,0,0,46.44-78V263.09a88.63,88.63,0,0,0-46.44-78c-36.39-19.68-101.06-37.92-215.78-37.92s-179.39,18.24-215.78,37.92a88.63,88.63,0,0,0-46.44,78Z" transform="translate(-186.49 -113.16)"/>
            <path id="face" className="cls-10" d="M540.45,495.85c-114.59,0-173.41-18.8-202.58-34.58A60.81,60.81,0,0,1,306,407.71V298.24a60.83,60.83,0,0,1,31.89-53.57c29.17-15.77,88-34.58,202.58-34.58S713.86,228.9,743,244.67a60.83,60.83,0,0,1,31.89,53.57V407.71A60.81,60.81,0,0,1,743,461.27C713.86,477.05,655,495.85,540.45,495.85Z" transform="translate(-186.49 -113.16)"/>
            <path id="left-eye" className="cls-12" d="M464.63,355.17c0,19.68-16,9.89-35.64,9.89s-35.65,9.79-35.65-9.89a35.65,35.65,0,1,1,71.29,0Z" transform="translate(-186.49 -113.16)"/>
            <path id="mouth" className="cls-13" d="M581.09,421.77c0,5.38-4.55,10.26-11.91,13.79s-17.51,5.71-28.73,5.71c-22.45,0-40.64-8.73-40.64-19.5,0-.77.65-1.47,1.7-2a9.67,9.67,0,0,1,4.1-.82h69.67C578.48,419,581.09,420.23,581.09,421.77Z" transform="translate(-186.49 -113.16)"/>
            <path id="right-eye" className="cls-14" d="M687.15,355.17c0,19.68-15.95,9.89-35.64,9.89s-35.64,9.79-35.64-9.89a35.64,35.64,0,1,1,71.28,0Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-15" d="M762.14,653c0,38.24-3.55,73.25-10.14,104.88q-1,4.85-2.11,9.57C719.75,896.9,637.36,967,540.45,967c-45.34,0-87.5-15.35-122.62-44.93,33.61,7.84,69.29,4.86,102.42-5C599.94,893.33,666.06,828.23,691,748.92,713.69,677,701.92,595.28,661,532.12,724.23,555,762.14,597.46,762.14,653Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-16" d="M438,598.73c-4.28,9.33-13.12,15.54-21,22.18A145.94,145.94,0,0,0,369,702.7c-1.28,6.44-4.83,14.95-11.23,13.45-3.85-.91-5.72-5.21-6.83-9a124.37,124.37,0,0,1,57.62-142.93,20,20,0,0,1,24.81,3.73l.12.13A29,29,0,0,1,438,598.73Z" transform="translate(-186.49 -113.16)"/>
            <path className="cls-16" d="M394.68,205.16c-53.19,12.41-80.9,35.67-94.45,52a5,5,0,0,1-8.72-4.41c7-27.4,25.61-44.65,44.39-55.23,16.31-9.18,34.26-14.65,52.56-18.92a13.5,13.5,0,0,1,15.81,8.66l.09.26A13.52,13.52,0,0,1,394.68,205.16Z" transform="translate(-186.49 -113.16)"/>
          </svg>
        </div>
        <div className="loading-text" aria-label="Robo Club">
          <span>robo</span>
          <span>club</span>
        </div>
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