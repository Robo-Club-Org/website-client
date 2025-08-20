import React from 'react'
import Script from 'next/script'

export function UsedProductsJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Used Electronics & Robotics Products',
    description: 'Browse our collection of second-hand robotics components, development boards, and electronic equipment at discounted prices.',
    url: 'https://roboclub-client-938d32cbf571.herokuapp.com/used-products',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Product',
            name: 'Used Electronics Collection',
            description: 'Pre-owned and refurbished electronics and robotics components verified by our technicians.',
            url: 'https://roboclub-client-938d32cbf571.herokuapp.com/used-products',
            category: 'Used Electronics',
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'LKR',
              lowPrice: '500',
              highPrice: '15000',
              offerCount: '25',
              availability: 'https://schema.org/InStock'
            }
          }
        }
      ]
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://roboclub-client-938d32cbf571.herokuapp.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Used Products',
          item: 'https://roboclub-client-938d32cbf571.herokuapp.com/used-products'
        }
      ]
    }
  }

  return (
    <Script
      id="used-products-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
