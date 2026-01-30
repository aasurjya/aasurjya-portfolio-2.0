import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModeProvider } from '@/components/providers/mode-provider'
import AnalyticsTracker from '@/components/providers/analytics-tracker'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aasurjya - Portfolio',
  description: 'PhD Researcher | XR Developer | Full Stack Engineer',
  keywords: 'portfolio, developer, XR, VR, AR, full-stack, PhD, HCI',
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
            {children}
            <AnalyticsTracker />
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
