import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XR Developer & HCI Researcher Portfolio | AR/VR, Spatial Computing & Research',
  description: 'XR development and HCI research portfolio by Aasurjya at IIT Jodhpur. AR/VR projects, Unity development, Gaussian splatting, neuro-adaptive interfaces & published research.',
  keywords: [
    'XR developer portfolio',
    'AR developer portfolio',
    'VR developer India',
    'Unity XR developer',
    'HCI researcher',
    'human computer interaction',
    'augmented reality projects',
    'virtual reality portfolio',
    'Gaussian splatting',
    'spatial computing developer',
    'immersive technology research',
    'neuro-adaptive interfaces',
    'IIT Jodhpur researcher',
  ],
  openGraph: {
    title: 'XR Developer & Researcher Portfolio | Aasurjya',
    description: 'Explore XR projects and HCI research including AR/VR applications, Gaussian splatting, and neuro-adaptive interfaces.',
    url: 'https://www.aasurjya.in/xr-research',
    images: [
      {
        url: '/og-xr-dev.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya XR & Research Portfolio',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/xr-research',
  },
}

export default function XRResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
