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

// Hook for page-specific SEO
export function usePageSEO(pageKey, customConfig = {}) {
  const location = useLocation()
  const baseConfig = seoConfig[pageKey] || {}
  
  useEffect(() => {
    const config = {
      ...baseConfig,
      ...customConfig,
      url: `${import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com'}${location.pathname}`,
      canonical: `${import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com'}${location.pathname}`,
    }
    
    updateMetaTags(config)
  }, [location.pathname, pageKey, customConfig])
}