"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Truck, Shield, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/home/Navigation"
import { Footer } from "@/components/home/Footer"
import { useCartStore } from "@/lib/cart-store"
import { useAuth } from "@/hooks/useAuth"

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  zipCode: string;
  phoneNumber?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  // No card payment; we display bank transfer instructions instead

  const { items: cartItems, getTotalPrice, clearCart } = useCartStore()
  const { isLoggedIn } = useAuth()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 10000 ? 0 : 500 // Free shipping over LKR 10000
  const tax = subtotal * 0.0// 0% tax
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses()
    }
  }, [isLoggedIn])

  const fetchAddresses = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const addressesData = await response.json();
        setAddresses(addressesData);
        
        // Set default address as selected
        const defaultAddress = addressesData.find((addr: Address) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addressesData.length > 0) {
          setSelectedAddressId(addressesData[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  }

  // No payment field handlers needed now

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsLoading(true);
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddressId: selectedAddressId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.orderId) setOrderId(String(data.orderId));
        await clearCart();
        setOrderPlaced(true);
        setTimeout(() => {
          window.location.href = "/my-account?tab=orders";
        }, 4000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h2>
              <p className="text-slate-600 mb-6">
                You need to be logged in to access the checkout page.
              </p>
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-slate-600 mb-6">
                Thank you for your order. You can track your order in your account.
              </p>
              {orderId && (
                <div className="bg-white border border-slate-200 rounded-md p-3 mb-4 text-left">
                  <p className="text-sm text-slate-700">Your Order ID:</p>
                  <div className="flex items-center justify-between mt-1">
                    <code className="text-sm text-slate-900 break-all">{orderId}</code>
                    <button
                      type="button"
                      className="text-blue-600 text-sm hover:underline ml-3"
                      onClick={async () => { try { await navigator.clipboard.writeText(orderId); } catch {} }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
              <p className="text-sm text-slate-500">Redirecting to your orders...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/cart" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-600 mb-4">No saved addresses found.</p>
                      <Link href="/my-account?tab=addresses">
                        <Button variant="outline">Add Address</Button>
                      </Link>
                    </div>
                  ) : (
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                            <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                              <div className="font-semibold text-slate-900">{address.fullName}</div>
                              <div className="text-sm text-slate-600 mt-1">
                                <div>{address.addressLine1}</div>
                                {address.addressLine2 && <div>{address.addressLine2}</div>}
                                <div>{address.city}, {address.district} {address.zipCode}</div>
                                {address.phoneNumber && <div>Phone: {address.phoneNumber}</div>}
                              </div>
                              {address.isDefault && (
                                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                  Default
                                </div>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {/* Bank Transfer Instructions */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Bank Transfer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700">
                  <p className="text-slate-600">
                    Please transfer the total amount to the bank account below and include your Order ID (shown after placing the order) as the payment reference. Your order will be processed once we confirm the payment.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="block font-semibold text-slate-900">Bank Name</span>
                      <span>Hatton National Bank</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">Branch</span>
                      <span>Kurunegala</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">Account Name</span>
                      <span>Imansha Manuka</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">Account Number</span>
                      <span>019020341693</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">SWIFT Code</span>
                      <span>HNBLKLC</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-900">Reference</span>
                      <span>Order ID : {orderId}</span>
                      <code className="text-sm text-slate-900 break-all">{orderId}</code>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-800">
                    After payment, email the slip to <strong>roboclub.main@gmail.com</strong> or upload it in your account order details page.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-600">Your cart is empty</p>
                      <Link href="/products">
                        <Button variant="outline" className="mt-2">Continue Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}

                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Subtotal</span>
                          <span>LKR {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Shipping</span>
                          <span>{shipping === 0 ? "Free" : `LKR ${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Tax</span>
                          <span>LKR {tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-blue-600">LKR {total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isLoading || cartItems.length === 0 || !selectedAddressId}
                      >
                        {isLoading ? 'Processing...' : 'Place Order'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  )
}
