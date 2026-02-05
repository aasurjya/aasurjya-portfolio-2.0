'use client'

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Project/CreativeWork Schema Generator
export function generateProjectSchema({
  name,
  description,
  url,
  image,
  dateCreated,
  technologies,
  author = 'Aasurjya Bikash Handique',
}: {
  name: string
  description: string
  url: string
  image?: string
  dateCreated?: string
  technologies?: string[]
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    image,
    dateCreated,
    author: {
      '@type': 'Person',
      name: author,
    },
    keywords: technologies?.join(', '),
  }
}

// Article/Blog Post Schema Generator
export function generateArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = 'Aasurjya Bikash Handique',
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://www.aasurjya.in',
    },
    publisher: {
      '@type': 'Person',
      name: author,
      url: 'https://www.aasurjya.in',
    },
  }
}

// FAQ Schema Generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
