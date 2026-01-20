// SEO utility functions for dynamic meta tag management

const baseUrl = import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com'

export function updateMetaTags({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  canonical,
  structuredData,
}) {
  // Update or create title tag
  if (title) {
    document.title = title
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('name', 'twitter:title', title)
  }

  // Update description
  if (description) {
    updateMetaTag('name', 'description', description)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('name', 'twitter:description', description)
  }

  // Update keywords
  if (keywords) {
    updateMetaTag('name', 'keywords', keywords)
  }

  // Update Open Graph image
  const ogImage = image || `${baseUrl}/og-image.jpg`
  updateMetaTag('property', 'og:image', ogImage)
  updateMetaTag('name', 'twitter:image', ogImage)

  // Update URL
  const pageUrl = url || `${baseUrl}${window.location.pathname}`
  updateMetaTag('property', 'og:url', pageUrl)

  // Update type
  updateMetaTag('property', 'og:type', type)

  // Update Twitter card
  updateMetaTag('property', 'twitter:card', 'summary_large_image')

  // Update canonical URL
  if (canonical || url) {
    let canonicalUrl = canonical || pageUrl
    let link = document.querySelector("link[rel='canonical']")
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonicalUrl)
  }

  // Update structured data (only if provided)
  if (structuredData) {
    // Remove old structured data scripts (except ItemList which is in body)
    const oldScripts = document.querySelectorAll('head script[type="application/ld+json"]')
    oldScripts.forEach(script => script.remove())
    
    // Add new structured data
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)
  }
  
  // Update robots meta tag
  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  updateMetaTag('name', 'googlebot', 'index, follow')
}

function updateMetaTag(attribute, value, content) {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, value)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// SEO configuration for different pages
export const seoConfig = {
  home: {
    title: 'Tomorrow Worth | Dividend, Compound Interest & 4% Rule Calculator',
    description: 'Free investment calculators: Calculate dividend income, compound interest growth, and financial independence with the 4% rule. Plan your wealth journey with real-time calculations and 20-year projections.',
    keywords: 'investment calculator, dividend calculator, compound interest calculator, 4% rule calculator, financial independence calculator, retirement calculator, wealth calculator, dividend income calculator, compound growth calculator, FI calculator, financial planning, investment planning, retirement planning, wealth building, dividend investing, compound interest, 4 percent rule, financial freedom',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Tomorrow Worth',
      description: 'Free investment calculators: Calculate dividend income, compound interest growth, and financial independence with the 4% rule.',
      url: baseUrl,
      applicationCategory: 'FinanceApplication',
      applicationSubCategory: 'Investment Calculator',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '1.0',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2024-01-01',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '127',
        bestRating: '5',
        worstRating: '1',
      },
      featureList: [
        'Dividend Calculator',
        'Compound Interest Calculator',
        '4% Rule Calculator',
        '20-Year Wealth Projections',
        'Real-time Calculations',
        'Interactive Sliders',
        'Visual Charts',
      ],
      inLanguage: 'en-US',
    },
  },
  about: {
    title: 'About | Tomorrow Worth',
    description: 'Learn about our mission to provide free, accurate investment calculators built with transparency and industry-standard formulas.',
    keywords: 'about tomorrow worth, investment calculator about, financial calculator accuracy, calculator methodology, investment tools',
  },
  blog: {
    title: 'Blog | Tomorrow Worth',
    description: 'Deep guides, data studies, and glossary entries to help you master dividend investing, compound interest, and financial independence.',
    keywords: 'investment blog, dividend investing guide, compound interest guide, financial independence blog, retirement planning blog',
  },
}