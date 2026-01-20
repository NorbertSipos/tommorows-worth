import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import CalculatorPage from './pages/CalculatorPage'
import { initializeAnalytics } from './lib/analytics'

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
      </Routes>
    </>
  )
}

export default App