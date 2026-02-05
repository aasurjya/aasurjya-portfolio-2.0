import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Journey: From Assam to IIT Jodhpur',
  description: 'The story of Aasurjya Bikash Handique - from a village in Assam where WiFi arrived in 2022 to building XR systems at IIT Jodhpur. A journey of curiosity, resilience, and growth.',
  keywords: [
    'Aasurjya story',
    'developer journey',
    'IIT Jodhpur student',
    'tech journey India',
    'from village to IIT',
    'Assam to IIT',
    'developer biography',
    'tech career story',
    'inspiration story',
  ],
  openGraph: {
    title: 'My Journey: From Assam to IIT Jodhpur | Aasurjya',
    description: 'From a village where WiFi arrived in 2022 to building XR systems at IIT Jodhpur. A story of curiosity and resilience.',
    url: 'https://www.aasurjya.in/story',
    images: [
      {
        url: '/og-story.png',
        width: 1200,
        height: 630,
        alt: 'Aasurjya Journey Story',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.aasurjya.in/story',
  },
}

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
