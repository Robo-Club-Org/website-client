"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number | string
  name: string
  price: number
  image: string
  category: string
  brand: string
  inStock: boolean
}

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
  showIcon?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = "default",
  variant = "default",
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsAdding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

  // Add with desired quantity in a single call
  await addItem({ ...product, id: product.id.toString() }, quantity)

    setIsAdding(false)
    setJustAdded(true)

    // Show success state briefly
    setTimeout(() => setJustAdded(false), 2000)

    // Show toast notification
    toast({
      title: "Added to cart!",
      description: `${product.name} ${quantity > 1 ? `(${quantity})` : ""} has been added to your cart.`,
  // Removed direct open-cart action; user can navigate manually
    })
  }

  if (!product.inStock) {
    return (
      <Button disabled className={className} size={size} variant="outline">
        Out of Stock
      </Button>
    )
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={className} size={size} variant={variant}>
      {isAdding ? (
        <>
          <div className="spinner mr-2" />
          Adding...
        </>
      ) : justAdded ? (
        <>
          {showIcon && <Check className="h-4 w-4 mr-2" />}
          Added!
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="h-4 w-4 mr-2" />}
          Add to Cart
        </>
      )}
    </Button>
  )
}
