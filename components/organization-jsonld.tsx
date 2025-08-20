import React from 'react'
import Script from 'next/script'

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RoboClub',
    url: 'https://roboclub-client-938d32cbf571.herokuapp.com',
    logo: 'https://roboclub-client-938d32cbf571.herokuapp.com/roboclub-logo.png',
    description: "Sri Lanka's trusted online store for electronics, robotics components, development boards, sensors, and maker supplies.",
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Sri Lanka'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@roboclub.lk'
    },
    sameAs: [
      'https://www.facebook.com/roboclub',
      'https://www.instagram.com/roboclub.lk',
      'https://twitter.com/roboclublk'
    ]
  }

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
