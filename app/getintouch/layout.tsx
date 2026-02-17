import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get In Touch | Contact Aasurjya',
  description: 'Contact Aasurjya Bikash Handique - HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Open for research, fullstack, and XR development opportunities.',
  keywords: [
    'contact Aasurjya',
    'hire XR developer',
    'full stack developer contact',
    'IIT Jodhpur developer',
    'freelance developer India',
    'AR VR developer hire',
  ],
  openGraph: {
    title: 'Get In Touch | Aasurjya',
    description: 'Let\'s create something extraordinary together. Open for research, fullstack, and XR development opportunities.',
    url: 'https://www.aasurjya.in/getintouch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Aasurjya',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/getintouch',
  },
}

export default function GetInTouchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
