import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModeProvider } from '@/components/providers/mode-provider'
import AnalyticsTracker from '@/components/providers/analytics-tracker'
import AmbientSound from '@/components/ui/ambient-sound'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const siteUrl = 'https://www.aasurjya.in'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Aasurjya - XR Developer & Full Stack Engineer Portfolio',
    template: '%s | Aasurjya',
  },
  description: 'Portfolio of Aasurjya Bikash Handique - HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Building immersive AR/VR experiences and scalable web applications.',
  keywords: [
    'XR developer portfolio',
    'AR VR developer India',
    'full stack developer portfolio',
    'HCI researcher',
    'Unity developer',
    'React Three Fiber',
    'augmented reality developer IIT',
    'virtual reality projects',
    'neuro-adaptive XR interfaces',
    'Gaussian splatting developer',
    'Flutter AR developer',
    'Aasurjya Bikash Handique',
    '3D web developer',
    'immersive technology',
    'spatial computing',
  ],
  authors: [{ name: 'Aasurjya Bikash Handique', url: siteUrl }],
  creator: 'Aasurjya Bikash Handique',
  publisher: 'Aasurjya Bikash Handique',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Aasurjya Portfolio',
    title: 'Aasurjya - XR Developer & Full Stack Engineer Portfolio',
    description: 'HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Building immersive AR/VR experiences and scalable web applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya - XR Developer & Full Stack Engineer Portfolio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aasurjya - XR Developer & Full Stack Engineer',
    description: 'HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Building immersive AR/VR experiences.',
    images: ['/og-image.png'],
    creator: '@aasurjya',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Structured Data
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aasurjya Bikash Handique',
  url: siteUrl,
  image: `${siteUrl}/profile-image.jpg`,
  jobTitle: ['XR Developer', 'Full Stack Engineer', 'HCI Researcher'],
  worksFor: {
    '@type': 'Organization',
    name: 'iHub Drishti, IIT Jodhpur',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'IIT Jodhpur',
      department: 'M.Tech AR/VR',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'Tezpur University',
      department: 'B.Tech Computer Science',
    },
  ],
  knowsAbout: [
    'Augmented Reality',
    'Virtual Reality',
    'Full Stack Development',
    'Human-Computer Interaction',
    'Unity',
    'React',
    'Next.js',
    'Three.js',
    'Flutter',
    'Gaussian Splatting',
  ],
  sameAs: [
    'https://github.com/aasurjya',
    'https://linkedin.com/in/aasurjya',
    'https://twitter.com/aasurjya',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Aasurjya Portfolio',
  url: siteUrl,
  description: 'Portfolio of Aasurjya - HCI Researcher, XR Developer & Full Stack Engineer',
  author: {
    '@type': 'Person',
    name: 'Aasurjya Bikash Handique',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics - Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <ThemeProvider>
          <ModeProvider>
            {/* Skip to main content link for keyboard users */}
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium focus:text-sm"
            >
              Skip to main content
            </a>
            <main id="main">
              {children}
            </main>
            <AnalyticsTracker />
            <AmbientSound />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
