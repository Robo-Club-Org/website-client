import Script from 'next/script'

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'RoboClub',
    url: 'https://roboclub.lk',
    image: 'https://roboclub.lk/roboclub-logo.png',
    telephone: '+94-000-000000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Katubadda',
      addressLocality: 'Moratuwa',
      addressRegion: 'Western Province',
      postalCode: '10400',
      addressCountry: 'LK'
    },
    areaServed: 'LK',
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    }]
  }
  return (
    <Script id="localbusiness-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}
