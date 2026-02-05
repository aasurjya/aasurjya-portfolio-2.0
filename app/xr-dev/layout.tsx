import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AR/VR Developer Portfolio | XR Projects & Unity Development',
  description: 'Discover AR/VR projects by Aasurjya - Unity, Unreal, Flutter AR development. Specializing in Gaussian splatting, neuro-adaptive interfaces & spatial computing at IIT Jodhpur.',
  keywords: [
    'AR developer portfolio',
    'VR developer India',
    'Unity XR developer',
    'augmented reality projects',
    'virtual reality portfolio',
    'Gaussian splatting',
    'Flutter AR development',
    'spatial computing developer',
    'immersive technology',
    'XR developer IIT',
  ],
  openGraph: {
    title: 'AR/VR Developer Portfolio | Aasurjya',
    description: 'Explore XR projects including AR/VR applications, Gaussian splatting, and neuro-adaptive interfaces.',
    url: 'https://www.aasurjya.in/xr-dev',
    images: [
      {
        url: '/og-xr-dev.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya XR Development Portfolio',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/xr-dev',
  },
}

export default function XRDevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
