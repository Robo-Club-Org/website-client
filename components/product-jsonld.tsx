import React from 'react'
import Script from 'next/script'

interface ProductJsonLdProps {
  product: {
    id: string
    name: string
    description?: string
    image?: string | string[]
    price: number
    sku?: string
    brand?: { name: string } | string
    category?: { name: string } | string
    stockQuantity?: number
    rating?: number
    reviews?: number
  }
  url: string
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const images = Array.isArray(product.image) 
    ? product.image 
    : (product.image ? [product.image] : [])
  
  // Process image URLs to ensure they're absolute
  const processedImages = images.map(img => 
    img.startsWith('http') ? img : `https://roboclub.lk${img}`
  )

  // Handle brand which could be a string or object
  const brandName = typeof product.brand === 'string' 
    ? product.brand 
    : product.brand?.name

  // Handle category which could be a string or object
  const categoryName = typeof product.category === 'string'
    ? product.category
    : product.category?.name

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Buy ${product.name} online at RoboClub`,
    image: processedImages.length > 0 ? processedImages : undefined,
    sku: product.sku,
    mpn: product.id,
    identifier_exists: "yes",
    gtin: product.sku || product.id,
    productID: `roboclub:${product.id}`,
    brand: brandName
      ? {
          '@type': 'Brand',
          name: brandName
        } 
      : undefined,
    category: categoryName,
    itemCondition: "https://schema.org/NewCondition",
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'LKR',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: product.stockQuantity && product.stockQuantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'RoboClub',
        logo: 'https://roboclub.lk/roboclub-logo.png'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 10000 ? 0 : 400,
          currency: 'LKR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY'
          }
        }
      }
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews || 1,
        bestRating: 5
      }
    })
  }

  return (
    <Script
      id={`product-jsonld-${product.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
