"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from "lucide-react" // Added ArrowRight import
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useState, useEffect } from "react"
import { Product } from "@/lib/constants"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const totalSlides = Math.ceil(products.length / 8)

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlay, totalSlides])

  const nextSlide = () => {
    setCurrentSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1)
  }

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1)
  }

  return (
    <section className="py-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Handpicked components and development boards loved by makers worldwide
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
            aria-label="Next products"
          >
            <ChevronRight className="h-6 w-6 text-slate-700" />
          </button>

          {/* Slideshow Content */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
                    {products.slice(slideIndex * 8, (slideIndex + 1) * 8).map((product) => (
                      <Card
                        key={product.id}
                        className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm p-2"
                      >
                        <CardContent className="p-2">
                          <Link href={`/products/product/${(product as any).slug || product.id}`}> 
                            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-1 flex items-center justify-center overflow-hidden cursor-pointer" style={{ minHeight: 120, maxHeight: 300 }}>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={300}
                                height={300}
                                unoptimized
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          </Link>

                          <Badge variant="secondary" className="mb-1 text-xs">
                            {product.category}
                          </Badge>

                          <Link href={`/products/product/${(product as any).slug || product.id}`}>
                            <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-slate-600 mb-2 line-clamp-2 text-xs">{product.description}</p>
                          {Boolean((product as any).itemCode) && (
                            <p className="text-[11px] text-slate-500 -mt-1 mb-2">Item Code: {(product as any).itemCode}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">LKR {product.price.toFixed(2)}</span>
                            
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index ? "bg-blue-600 scale-110" : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="flex justify-center mt-2">
            <span className="text-sm text-slate-500">
              {currentSlide + 1} of {totalSlides}
            </span>
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAutoPlay ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isAutoPlay ? "Pause" : "Play"} Slideshow</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}