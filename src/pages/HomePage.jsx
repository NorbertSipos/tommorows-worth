import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, PieChart, Target } from 'lucide-react'
import DividendCalculator from '@/components/DividendCalculator'
import CompoundCalculator from '@/components/CompoundCalculator'
import FourPercentRuleCalculator from '@/components/FourPercentRuleCalculator'
import WealthProjectionChart from '@/components/WealthProjectionChart'
import AdSensePlaceholder from '@/components/AdSensePlaceholder'
import AdSense from '@/components/AdSense'
import HowItWorks from '@/components/HowItWorks'
import FAQ from '@/components/FAQ'
import ResultsPanel from '@/components/ResultsPanel'
import Logo from '@/components/Logo'
import { usePageSEO } from '@/hooks/useSEO'

export default function HomePage() {
  // Set up SEO meta tags
  usePageSEO('home')
  const [activeCalculator, setActiveCalculator] = useState('dividend')
  const [projectionData, setProjectionData] = useState([])
  const [calculatorResults, setCalculatorResults] = useState([])

  const handleProjectionUpdate = useCallback((data) => {
    setProjectionData(data)
  }, [])

  const handleResultsUpdate = useCallback((results) => {
    setCalculatorResults(results)
  }, [])

  const calculators = [
    { id: 'dividend', name: 'Dividend', icon: TrendingUp, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
    { id: 'compound', name: 'Compound', icon: PieChart, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10' },
    { id: '4percent', name: '4% Rule', icon: Target, color: 'from-orange-500 to-rose-500', bgColor: 'bg-orange-500/10' },
  ]

  return (
    <>
      {/* Structured Data for Calculators */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Financial Calculators',
            description: 'Collection of free financial calculators for investment planning',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Dividend Calculator',
                description: 'Calculate dividend income and growth projections',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Compound Interest Calculator',
                description: 'Calculate compound interest growth over time',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: '4% Rule Calculator',
                description: 'Calculate financial independence timeline using the 4% rule',
              },
            ],
          }),
        }}
      />
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-purple-950/20 to-fuchsia-950/20 animate-gradient"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header with AdSense Slot */}
      <header className="relative z-10 w-full p-3 sm:p-4 pt-4 sm:pt-6 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          <AdSense 
            position="top" 
            adSlot="9646444122"
            adFormat="auto"
            className="mb-4 sm:mb-6"
          />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Compact Hero Section with Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <Logo />
          </div>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2">
            Plan your financial future with powerful, real-time calculators
          </p>
        </div>

        {/* Main Calculator Grid - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 lg:items-stretch">
          {/* Left Side - Calculator Selection & Inputs */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            {/* Calculator Tabs */}
            <div className="card-modern p-3 sm:p-4">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {calculators.map((calc) => {
                  const Icon = calc.icon
                  const isActive = activeCalculator === calc.id
                  
                  return (
                    <button
                      key={calc.id}
                      onClick={() => setActiveCalculator(calc.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm touch-manipulation ${
                        isActive
                          ? 'bg-gradient-to-r ' + calc.color + ' text-white shadow-lg'
                          : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800/60 border border-slate-700/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="font-semibold">{calc.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Calculator Inputs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCalculator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="card-modern p-4 sm:p-6"
              >
                {activeCalculator === 'dividend' && (
                  <DividendCalculator 
                    onProjectionUpdate={handleProjectionUpdate} 
                    onResultsUpdate={handleResultsUpdate}
                    showResults={false} 
                    compact={true}
                  />
                )}
                {activeCalculator === 'compound' && (
                  <CompoundCalculator 
                    onProjectionUpdate={handleProjectionUpdate} 
                    onResultsUpdate={handleResultsUpdate}
                    showResults={false}
                    compact={true}
                  />
                )}
                {activeCalculator === '4percent' && (
                  <FourPercentRuleCalculator 
                    onProjectionUpdate={handleProjectionUpdate} 
                    onResultsUpdate={handleResultsUpdate}
                    showResults={false}
                    compact={true}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Results (Always Visible) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6 h-full">
              <ResultsPanel 
                key={activeCalculator}
                results={calculatorResults} 
              />
            </div>
          </div>
        </div>

        {/* 20-Year Projection Chart - Full Width Below */}
        <AnimatePresence>
          {projectionData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-modern p-4 sm:p-6 lg:p-8 mb-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-700/50">
                <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">20-Year Wealth Projection</h2>
              </div>
              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                <WealthProjectionChart data={projectionData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google AdSense - Wide Slot Below Chart */}
        <div className="mb-8">
          <AdSensePlaceholder 
            position="sidebar" 
            slotId="sidebar"
            className="w-full"
          />
        </div>

        {/* How It Works & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <HowItWorks calculatorType={activeCalculator} />
          <FAQ calculatorType={activeCalculator} />
        </div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12">
        <div className="card-modern p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">About</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Free investment calculators built with accuracy and transparency. Our tools use 
                industry-standard formulas cited from authoritative sources like Investopedia, 
                the Trinity Study, and financial regulatory bodies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Important Disclaimers</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                <strong className="text-red-400">Not Financial Advice:</strong> These calculators are for educational purposes only. 
                Past performance does not guarantee future results. Always consult with a qualified financial advisor 
                before making investment decisions. This tool does not replace professional financial planning.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-6 text-center">
            <p className="text-slate-400 text-sm">
              Tomorrow Worth © {new Date().getFullYear()} - For educational purposes only
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Free financial calculators for dividend income, compound interest, and financial independence planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}