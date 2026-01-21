import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import DividendCalculator from '@/components/DividendCalculator'
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'
import { formatCurrency } from '@/lib/utils'
import { getStockBySlug, fetchStockData } from '@/lib/financialAPI'
import { analytics } from '@/lib/analytics'
import { updateMetaTags } from '@/lib/seo'

export default function CalculatorPage() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [stock, setStock] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const defaultInvestment = 10000
  const estimatedAnnualDividend = stock ? defaultInvestment * (stock.dividendYield / 100) : 0

  const handleProjectionUpdate = useCallback(() => {
    // Projection update handler
  }, [])

  useEffect(() => {
    if (stock) {
      // Normalize URL to always include protocol
      const normalizeUrl = (url) => {
        if (!url) return 'https://tomorrowworth.com'
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        return `https://${url.replace(/^https?:\/\//, '')}`
      }
      const baseUrl = normalizeUrl(import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com')
      const description = `Calculate dividend income from ${stock.name} (${stock.ticker}). Current dividend yield: ${stock.dividendYield}%. Estimate your annual and monthly dividend payments.`
      
      updateMetaTags({
        title: `${stock.name} (${stock.ticker}) Dividend Calculator | Tomorrow Worth`,
        description: description,
        keywords: `${stock.name} dividend calculator, ${stock.ticker} dividend yield, ${stock.name} stock calculator, dividend income calculator`,
        url: `${baseUrl}/calculator/${symbol}`,
        canonical: `${baseUrl}/calculator/${symbol}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `${stock.name} Dividend Calculator`,
          applicationCategory: 'FinanceApplication',
          description: description,
          url: `${baseUrl}/calculator/${symbol}`,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'Real-time dividend calculations',
            '20-year dividend projections',
            'Monthly and annual dividend estimates',
          ],
          about: {
            '@type': 'FinancialProduct',
            name: stock.name,
            tickerSymbol: stock.ticker,
            dividendYield: stock.dividendYield,
            annualDividend: stock.annualDividend,
          },
        },
      })
    }
  }, [stock, symbol])

  useEffect(() => {
    async function loadStockData() {
      setLoading(true)
      setNotFound(false)
      
      let stockData = getStockBySlug(symbol)
      
      if (!stockData) {
        stockData = await fetchStockData(symbol)
      }

      if (!stockData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setStock(stockData)
      setLoading(false)

      if (analytics) {
        analytics.trackPageView('dividend')
      }
    }

    loadStockData()
  }, [symbol])

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Stock Not Found</h1>
          <p className="text-slate-300 mb-6">The stock calculator you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-violet-500 hover:bg-violet-600 rounded-lg text-white transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (loading || !stock) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const stockSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${stock.name} Dividend Calculator`,
    applicationCategory: 'FinanceApplication',
    description: `Calculate dividend income from ${stock.name} (${stock.ticker})`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time dividend calculations',
      '20-year dividend projections',
      'Monthly and annual dividend estimates',
    ],
    about: {
      '@type': 'FinancialProduct',
      name: stock.name,
      tickerSymbol: stock.ticker,
      dividendYield: stock.dividendYield,
      annualDividend: stock.annualDividend,
    },
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-purple-950/20 to-fuchsia-950/20 animate-gradient"></div>
      </div>

      <header className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 group text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back to Calculators</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stockSchema) }}
        />

        <div className="card-modern p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-white">{stock.ticker}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">{stock.name} Dividend Calculator</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-300">
                <span><strong>Ticker:</strong> {stock.ticker}</span>
                <span><strong>Dividend Yield:</strong> {stock.dividendYield}%</span>
                <span><strong>Annual Dividend:</strong> ${stock.annualDividend.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Calculate your dividend income from {stock.name}. With a current dividend yield of {stock.dividendYield}%, 
            a {formatCurrency(defaultInvestment)} investment would generate approximately {formatCurrency(estimatedAnnualDividend)} 
            in annual dividend income ({formatCurrency(estimatedAnnualDividend / 12)} per month).
          </p>
        </div>

        <DividendCalculator 
          onProjectionUpdate={handleProjectionUpdate} 
          defaultValues={{
            investmentAmount: defaultInvestment,
            annualYield: stock.dividendYield,
            dividendGrowth: 5,
          }}
        />

        <HowItWorks calculatorType="dividend" />
        <FAQ calculatorType="dividend" />
      </main>
    </div>
  )
}