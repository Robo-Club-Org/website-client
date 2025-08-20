import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "RoboClub - Premium Electronics & Robotics Store in Sri Lanka",
  description: "Sri Lanka's trusted online store for electronics, robotics components, development boards, sensors, and maker supplies. Free shipping on orders over LKR 10,000.",
  keywords: "robotics, electronics, Arduino, Raspberry Pi, sensors, Sri Lanka, online store, development boards, maker supplies, electronic components",
  authors: [{ name: "RoboClub" }],
  creator: "RoboClub",
  publisher: "RoboClub",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL('https://roboclub-client-938d32cbf571.herokuapp.com'),
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
    description: "Sri Lanka's trusted online store for electronics, robotics components, development boards, sensors, and maker supplies.",
    url: 'https://roboclub-client-938d32cbf571.herokuapp.com',
    siteName: 'RoboClub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/roboclub-logo.png',
        width: 1200,
        height: 630,
        alt: 'RoboClub Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "RoboClub - Premium Electronics & Robotics Store in Sri Lanka",
    description: "Sri Lanka's trusted online store for electronics, robotics components, and maker supplies.",
    images: ['/roboclub-logo.png'],
  }
}
