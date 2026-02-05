// SEO Configuration for aasurjya.in
// Centralized SEO settings for consistency across the site

export const siteConfig = {
  name: 'Aasurjya',
  fullName: 'Aasurjya Bikash Handique',
  url: 'https://www.aasurjya.in',
  description: 'Portfolio of Aasurjya Bikash Handique - HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur.',
  
  // Social links - update with your actual profiles
  social: {
    github: 'https://github.com/aasurjya',
    linkedin: 'https://linkedin.com/in/aasurjya',
    twitter: 'https://twitter.com/aasurjya',
    email: 'contact@aasurjya.in',
  },
  
  // Default OG Image
  ogImage: '/og-image.png',
  
  // Author info for structured data
  author: {
    name: 'Aasurjya Bikash Handique',
    jobTitle: ['XR Developer', 'Full Stack Engineer', 'HCI Researcher'],
    organization: 'iHub Drishti, IIT Jodhpur',
    education: [
      { institution: 'IIT Jodhpur', degree: 'M.Tech AR/VR' },
      { institution: 'Tezpur University', degree: 'B.Tech Computer Science' },
    ],
  },
  
  // Keywords by category for easy reference
  keywords: {
    primary: [
      'XR developer portfolio',
      'AR VR developer India',
      'full stack developer portfolio',
      'HCI researcher',
    ],
    xr: [
      'Unity developer',
      'augmented reality developer',
      'virtual reality projects',
      'Gaussian splatting developer',
      'Flutter AR developer',
      'spatial computing',
    ],
    fullstack: [
      'React developer',
      'Next.js developer',
      'Node.js portfolio',
      'React Three Fiber',
      '3D web developer',
      'TypeScript developer',
    ],
    research: [
      'neuro-adaptive XR interfaces',
      'human computer interaction',
      'immersive technology research',
      'interaction design',
    ],
    branded: [
      'Aasurjya Bikash Handique',
      'Aasurjya portfolio',
      'Aasurjya developer',
    ],
  },
}

// Page-specific SEO configurations
export const pagesSEO = {
  home: {
    title: 'Aasurjya - XR Developer & Full Stack Engineer Portfolio',
    description: 'Portfolio of Aasurjya Bikash Handique - HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Building immersive AR/VR experiences and scalable web applications.',
    canonical: siteConfig.url,
  },
  xrDev: {
    title: 'AR/VR Developer Portfolio | XR Projects & Unity Development',
    description: 'Discover AR/VR projects by Aasurjya - Unity, Unreal, Flutter AR development. Specializing in Gaussian splatting, neuro-adaptive interfaces & spatial computing.',
    canonical: `${siteConfig.url}/xr-dev`,
  },
  fullstack: {
    title: 'Full Stack Developer Portfolio | React, Node.js, 3D Web',
    description: 'Full stack development portfolio featuring React, Next.js, Node.js & 3D web experiences. View projects, skills & contact Aasurjya for collaboration.',
    canonical: `${siteConfig.url}/fullstack`,
  },
  research: {
    title: 'HCI Researcher | Neuro-Adaptive XR Interfaces',
    description: 'HCI research portfolio by Aasurjya at IIT Jodhpur. Publications on neuro-adaptive XR, human-computer interaction & immersive technology research.',
    canonical: `${siteConfig.url}/research`,
  },
  story: {
    title: 'My Journey: From Assam to IIT Jodhpur',
    description: 'The story of Aasurjya - from a village in Assam where WiFi arrived in 2022 to building XR systems at IIT Jodhpur. A journey of curiosity and resilience.',
    canonical: `${siteConfig.url}/story`,
  },
}

// Analytics IDs - Replace with your actual IDs
export const analyticsConfig = {
  // Google Analytics 4 Measurement ID
  // Get this from: Google Analytics > Admin > Data Streams > Web > Measurement ID
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID',
  
  // Google Search Console verification
  // Get this from: Google Search Console > Settings > Ownership verification
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  
  // Bing Webmaster Tools verification (optional)
  bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
}

// Image optimization settings
export const imageConfig = {
  // Recommended sizes for different use cases
  sizes: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 400, height: 300 },
    hero: { width: 1920, height: 1080 },
    og: { width: 1200, height: 630 },
    favicon: [16, 32, 48, 180, 192, 512],
  },
  
  // Quality settings
  quality: {
    default: 85,
    thumbnail: 75,
    hero: 90,
  },
  
  // Formats to use
  formats: ['webp', 'avif'] as const,
}
