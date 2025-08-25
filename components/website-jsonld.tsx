import Script from 'next/script'

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RoboClub',
    url: 'https://roboclub.lk',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://roboclub.lk/products?query={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
  return (
    <Script id="website-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  )
}
