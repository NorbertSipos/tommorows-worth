import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'

// This is a fallback component for static meta tags
// Dynamic tags are handled by useSEO hook
export default function SEOHead() {
  return (
    <Helmet>
      {/* Default meta tags that don't change */}
      <html lang="en" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0f172a" />
      <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      <link rel="apple-touch-icon" href="/icon.svg" />
    </Helmet>
  )
}