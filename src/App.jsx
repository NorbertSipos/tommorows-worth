import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import CalculatorPage from './pages/CalculatorPage'
import { initializeAnalytics } from './lib/analytics'

// Component to redirect stock symbols to calculator route
function StockRedirect() {
  const { symbol } = useParams()
  // Check if it's a known route (about, blog, calculator pages, etc.) - if so, let it fall through
  const knownRoutes = [
    'about', 
    'blog', 
    'calculator',
    'dividend-calculator',
    'compound-calculator',
    'compound-interest-calculator',
    '4percent-calculator',
    '4-percent-rule-calculator',
    'latte-factor-calculator',
    'inflation-calculator',
    'inflation-time-machine',
  ]
  if (knownRoutes.includes(symbol?.toLowerCase())) {
    return <Navigate to="/" replace />
  }
  // Otherwise, redirect to calculator route
  return <Navigate to={`/calculator/${symbol}`} replace />
}

function App() {
  useEffect(() => {
    // Initialize Google Analytics if available
    const gaId = import.meta.env.VITE_GA_ID
    if (gaId && typeof window !== 'undefined') {
      // Load Google Analytics script
      const script1 = document.createElement('script')
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
      script1.async = true
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', {
          page_path: window.location.pathname,
        });
      `
      document.head.appendChild(script2)

      // Initialize analytics tracker
      initializeAnalytics()
    }
  }, [])

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/calculator/:symbol" element={<CalculatorPage />} />
        {/* SEO-friendly calculator subpages - must come before catch-all route */}
        <Route path="/dividend-calculator" element={<HomePage />} />
        <Route path="/compound-calculator" element={<HomePage />} />
        <Route path="/compound-interest-calculator" element={<HomePage />} />
        <Route path="/4percent-calculator" element={<HomePage />} />
        <Route path="/4-percent-rule-calculator" element={<HomePage />} />
        <Route path="/latte-factor-calculator" element={<HomePage />} />
        <Route path="/inflation-calculator" element={<HomePage />} />
        <Route path="/inflation-time-machine" element={<HomePage />} />
        {/* Redirect short stock URLs to calculator route */}
        <Route path="/:symbol" element={<StockRedirect />} />
      </Routes>
    </>
  )
}

export default App