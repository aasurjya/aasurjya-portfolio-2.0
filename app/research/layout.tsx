import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HCI Researcher | Neuro-Adaptive XR Interfaces',
  description: 'HCI research portfolio by Aasurjya at IIT Jodhpur. Publications on neuro-adaptive XR, human-computer interaction & immersive technology research.',
  keywords: [
    'HCI researcher',
    'human computer interaction',
    'neuro-adaptive interfaces',
    'XR research',
    'IIT Jodhpur researcher',
    'immersive technology research',
    'AR VR research',
    'interaction design',
    'user experience research',
    'PhD researcher India',
  ],
  openGraph: {
    title: 'HCI Researcher Portfolio | Aasurjya',
    description: 'HCI research portfolio featuring publications on neuro-adaptive XR and human-computer interaction.',
    url: 'https://www.aasurjya.in/research',
    images: [
      {
        url: '/og-research.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya HCI Research Portfolio',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/research',
  },
}

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
