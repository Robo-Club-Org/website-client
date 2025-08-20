"use client"

import { useState } from "react"
import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/home/Navigation"
import { Footer } from "@/components/home/Footer"

export function ProductDetailContent({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const router = useRouter()
  const { addItem } = useCartStore()

  // Normalize stock quantity
  const stockQty: number = typeof product?.stockQuantity === 'number' ? product.stockQuantity : Number(product?.stockQuantity || 0)
  const maxQty = stockQty > 0 ? stockQty : 1

  const handleBuyNow = async () => {
    if (!product?.inStock) return
    const clampedQty = Math.min(Math.max(1, quantity), maxQty)
    const cartProduct = {
      id: String(product.id || ""),
      name: product.name || "Product",
      price: typeof product.price === 'number' ? product.price : 0,
      image: product.image || "/placeholder.svg",
    }
    try {
      await addItem(cartProduct, clampedQty)
      router.push('/checkout')
    } catch (e) {
      console.error('Buy Now failed:', e)
    }
  }
  // Use provided imageUrls when available; fall back to single image or placeholder
  const images: string[] = Array.isArray(product?.imageUrls) && product.imageUrls.length > 0
    ? product.imageUrls
    : [product?.image || "/placeholder.svg"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl p-8 flex items-center justify-center">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === index ? "border-blue-500" : "border-slate-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{product.name}</h1>
              {product.itemCode && (
                <p className="text-sm text-slate-500 mb-3">Item Code: {product.itemCode}</p>
              )}
              <p className="text-slate-600 mb-4">{product.description}</p>
              {/* Reviews removed */}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-blue-600">LKR {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}</span>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <label className="text-sm font-medium text-slate-700">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10)
                    const clamped = isNaN(value) ? 1 : Math.max(1, Math.min(value, maxQty))
                    setQuantity(clamped)
                  }}
                  onBlur={() => setQuantity((q) => Math.max(1, Math.min(q, maxQty)))}
                  disabled={!product.inStock}
                  className="w-24 text-center border rounded-lg h-10 disabled:bg-slate-100"
                />
                {product.inStock && (
                  <span className="text-xs text-slate-500">Only {stockQty} left</span>
                )}
              </div>
              <div className="space-y-3">
                <AddToCartButton
                  product={{
                    id: product.id || 0,
                    name: product.name || 'Product',
                    price: typeof product.price === 'number' ? product.price : 0,
                    image: product.image || '/placeholder.svg',
                    category: product.category || 'Uncategorized',
                    brand: product.brand || 'Generic',
                    inStock: Boolean(product.inStock),
                  }}
                  quantity={quantity}
                  className="w-full"
                  size="lg"
                />
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent" 
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.longDescription}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
