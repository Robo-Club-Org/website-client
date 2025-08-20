import React from 'react'
import Script from 'next/script'

interface GoogleVerificationProps {
  searchConsoleVerification?: string
  analyticsId?: string
  adsId?: string
}

export function GoogleServices({ 
  searchConsoleVerification = "REPLACE_WITH_YOUR_VERIFICATION_CODE", 
  analyticsId = "G-REPLACE_WITH_YOUR_ANALYTICS_ID",
  adsId = "AW-REPLACE_WITH_YOUR_ADS_ID"
}: GoogleVerificationProps) {
  return (
    <>
      {/* Google Search Console Verification */}
      {searchConsoleVerification && searchConsoleVerification !== "REPLACE_WITH_YOUR_VERIFICATION_CODE" && (
        <meta name="google-site-verification" content={searchConsoleVerification} />
      )}
      
      {/* Google Analytics */}
      {analyticsId && analyticsId !== "G-REPLACE_WITH_YOUR_ANALYTICS_ID" && (
        <>
          <Script 
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} 
            strategy="afterInteractive" 
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsId}');
            `}
          </Script>
        </>
      )}
      
      {/* Google Ads Conversion Tracking */}
      {adsId && adsId !== "AW-REPLACE_WITH_YOUR_ADS_ID" && (
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${adsId}');
          `}
        </Script>
      )}
    </>
  )
}
