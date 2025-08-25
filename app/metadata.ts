import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RoboClub - Premium Electronics & Robotics Store in Sri Lanka",
  description: "Sri Lanka's trusted online store for premium electronics and robotics components. Shop Arduino, Raspberry Pi, sensors, development boards, and maker supplies. Free shipping over LKR 10,000.",
  keywords: "robotics, electronics, Arduino, Raspberry Pi, sensors, Sri Lanka, online store, development boards, maker supplies, electronic components, modules, DIY , passive electronics,ICs , connectors, capacitors,resistors,transistors,inductors,mosfet,bjt,Lanka",
  authors: [{ name: "RoboClub" }],
  creator: "RoboClub",
  publisher: "RoboClub",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://roboclub.lk'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "RoboClub - Premium Electronics & Robotics Store in Sri Lanka",
    description: "Sri Lanka's trusted online store for premium electronics and robotics components. Shop Arduino, Raspberry Pi, sensors, development boards, and maker supplies.",
    url: 'https://roboclub.lk',
    siteName: 'RoboClub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://roboclub.lk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RoboClub - Premium Electronics & Robotics Store in Sri Lanka',
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: "RoboClub - Premium Electronics & Robotics Store in Sri Lanka",
    description: "Sri Lanka's trusted online store for premium electronics and robotics components. Shop Arduino, Raspberry Pi, sensors, and maker supplies.",
    images: ['https://roboclub.lk/og-image.jpg'],
  }
}
