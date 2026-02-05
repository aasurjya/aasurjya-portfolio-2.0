import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Full Stack Developer Portfolio | React, Node.js, 3D Web',
  description: 'Full stack development portfolio featuring React, Next.js, Node.js & 3D web experiences. View projects, skills & contact Aasurjya for collaboration.',
  keywords: [
    'full stack developer portfolio',
    'React developer India',
    'Next.js developer',
    'Node.js portfolio',
    'MERN stack developer',
    '3D web developer',
    'React Three Fiber',
    'TypeScript developer',
    'MongoDB developer',
    'web application developer',
  ],
  openGraph: {
    title: 'Full Stack Developer Portfolio | Aasurjya',
    description: 'Full stack development portfolio featuring React, Next.js, Node.js & 3D web experiences.',
    url: 'https://www.aasurjya.in/fullstack',
    images: [
      {
        url: '/og-fullstack.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya Full Stack Development Portfolio',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/fullstack',
  },
}

export default function FullStackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
