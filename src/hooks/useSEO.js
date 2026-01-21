import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { updateMetaTags, seoConfig } from '@/lib/seo'

// Hook to update SEO meta tags on route changes
export function useSEO(config) {
  const location = useLocation()

  useEffect(() => {
    // Update meta tags when route changes
    if (config) {
      updateMetaTags(config)
    }
  }, [location.pathname, config])
}

// Normalize URL to always include protocol
function normalizeUrl(url) {
  if (!url) return 'https://tomorrowworth.com'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url.replace(/^https?:\/\//, '')}`
}

// Hook for page-specific SEO
export function usePageSEO(pageKey, customConfig = {}) {
  const location = useLocation()
  const baseConfig = seoConfig[pageKey] || {}
  
  useEffect(() => {
    const siteUrl = normalizeUrl(import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com')
    const config = {
      ...baseConfig,
      ...customConfig,
      url: `${siteUrl}${location.pathname}`,
      canonical: `${siteUrl}${location.pathname}`,
    }
    
    updateMetaTags(config)
  }, [location.pathname, pageKey, customConfig])
}