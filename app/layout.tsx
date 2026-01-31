import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModeProvider } from '@/components/providers/mode-provider'
import AnalyticsTracker from '@/components/providers/analytics-tracker'
import AmbientSound from '@/components/ui/ambient-sound'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aasurjya - Portfolio',
  description: 'HCI Researcher | XR Developer | Full Stack Engineer',
  keywords: 'portfolio, developer, XR, VR, AR, full-stack, researcher, HCI',
  authors: [{ name: 'Aasurjya' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aasurjya.com',
    siteName: 'Aasurjya Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya Portfolio',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
