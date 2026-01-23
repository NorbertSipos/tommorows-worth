import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Percent, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { formatCurrency } from '@/lib/utils'
import { useDynamicTitle } from '@/lib/useDynamicTitle'
import { analytics } from '@/lib/analytics'

interface DividendCalculatorProps {
  onProjectionUpdate: (data: Array<{ year: number; value: number; label: string }>) => void
  onResultsUpdate?: (results: Array<{ label: string; value: number; icon: any; color: string }>) => void
  defaultValues?: {
    investmentAmount?: number
    annualYield?: number
    dividendGrowth?: number
  }
  showResults?: boolean
  compact?: boolean
}

export default function DividendCalculator({ onProjectionUpdate, onResultsUpdate, defaultValues, showResults = true, compact = false }: DividendCalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState(defaultValues?.investmentAmount ?? 100000)
  const [annualYield, setAnnualYield] = useState(defaultValues?.annualYield ?? 3.5)
  const [dividendGrowth, setDividendGrowth] = useState(defaultValues?.dividendGrowth ?? 5)

  const currentDividend = investmentAmount * (annualYield / 100)
  const monthlyDividend = currentDividend / 12

  // Dynamic title based on calculations
  useDynamicTitle({
    calculatorType: 'dividend',
    values: {
      investmentAmount,
      annualYield,
      annualDividend: currentDividend,
      dividendGrowth,
    },
  })

  useEffect(() => {
    const projection: Array<{ year: number; value: number; label: string }> = []
    let currentValue = investmentAmount
    let annualDividend = investmentAmount * (annualYield / 100)

    for (let year = 0; year <= 20; year++) {
      if (year > 0) {
        annualDividend *= (1 + dividendGrowth / 100)
        currentValue += annualDividend
      }
      projection.push({
        year,
        value: currentValue,
        label: `Year ${year}`
      })
    }

    onProjectionUpdate(projection)
    
    // Track calculation event
    if (projection.length > 0) {
      const finalValue = projection[projection.length - 1].value
      analytics?.trackCalculation('dividend', formatCurrency(finalValue))
    }
  }, [investmentAmount, annualYield, dividendGrowth, onProjectionUpdate])

  // Calculate projection for display
  const calculateProjection = () => {
    const projection: Array<{ year: number; value: number; label: string }> = []
    let currentValue = investmentAmount
    let annualDividend = investmentAmount * (annualYield / 100)

    for (let year = 0; year <= 20; year++) {
      if (year > 0) {
        annualDividend *= (1 + dividendGrowth / 100)
        currentValue += annualDividend
      }
      projection.push({
        year,
        value: currentValue,
        label: `Year ${year}`
      })
    }
    return projection
  }

  const projection = calculateProjection()

  const dividendAfter20Years = currentDividend * Math.pow(1 + dividendGrowth / 100, 20)
  const totalValueAfter20Years = projection[20]?.value || investmentAmount

  // Memoize stats array to prevent infinite loop - only recreate when actual values change
  const stats = useMemo(() => [
    { label: 'Annual Dividend', value: currentDividend, icon: DollarSign, color: 'from-blue-500 to-cyan-500', delay: 0.1 },
    { label: 'Monthly Dividend', value: monthlyDividend, icon: TrendingUp, color: 'from-cyan-500 to-teal-500', delay: 0.2 },
    { label: 'Dividend in 20 Years', value: dividendAfter20Years, icon: Sparkles, color: 'from-teal-500 to-emerald-500', delay: 0.3 },
    { label: 'Total Value (20Y)', value: totalValueAfter20Years, icon: ArrowUpRight, color: 'from-emerald-500 to-green-500', delay: 0.4 },
  ], [currentDividend, monthlyDividend, dividendAfter20Years, totalValueAfter20Years])

  // Update results callback when stats change
  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(stats)
    }
  }, [stats, onResultsUpdate])

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {/* Header - Only show if not compact */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Dividend Calculator</h2>
              <p className="text-slate-400 text-sm">Calculate your dividend income and growth</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Input Sliders */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <span className="truncate">Investment Amount</span>
            </label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setInvestmentAmount(Math.max(1000, Math.min(1000000, value)))
              }}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 1000
                setInvestmentAmount(Math.max(1000, Math.min(1000000, value)))
              }}
              className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-blue-500/50 focus:border-blue-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[120px] sm:max-w-[160px] px-1 sm:px-2 py-1"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
              min={1000}
              max={1000000}
              step={100}
            />
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6 group"
            value={[investmentAmount]}
            onValueChange={([value]) => {
              setInvestmentAmount(value)
              analytics?.trackSliderMove('dividend', value)
            }}
            min={1000}
            max={1000000}
            step={1000}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full h-full shadow-lg shadow-blue-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-blue-500/50 border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:scale-125 touch-manipulation" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>$1K</span>
            <span>$1M</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
              </div>
              <span className="truncate">Annual Yield</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={annualYield}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setAnnualYield(Math.max(0.5, Math.min(15, value)))
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 3.5
                  setAnnualYield(Math.max(0.5, Math.min(15, value)))
                }}
                className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[80px] sm:max-w-[100px] px-1 sm:px-2 py-1"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                min={0.5}
                max={15}
                step={0.1}
              />
              <span className="text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">%</span>
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[annualYield]}
            onValueChange={([value]) => {
              setAnnualYield(value)
              analytics?.trackSliderMove('dividend', value)
            }}
            min={0.5}
            max={15}
            step={0.1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 rounded-full h-full shadow-lg shadow-cyan-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-cyan-500/50 border-2 border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 hover:scale-125 touch-manipulation" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>0.5%</span>
            <span>15%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 flex-shrink-0">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
              </div>
              <span className="truncate">Dividend Growth Rate</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={dividendGrowth}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setDividendGrowth(Math.max(0, Math.min(20, value)))
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 5
                  setDividendGrowth(Math.max(0, Math.min(20, value)))
                }}
                className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-teal-500/50 focus:border-teal-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[80px] sm:max-w-[100px] px-1 sm:px-2 py-1"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                min={0}
                max={20}
                step={0.5}
              />
              <span className="text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">%</span>
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[dividendGrowth]}
            onValueChange={([value]) => {
              setDividendGrowth(value)
              analytics?.trackSliderMove('dividend', value)
            }}
            min={0}
            max={20}
            step={0.5}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-full h-full shadow-lg shadow-teal-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-teal-500/50 border-2 border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/30 hover:scale-125 touch-manipulation" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>0%</span>
            <span>20%</span>
          </div>
        </motion.div>
      </div>

      {/* Results - Only show if showResults is true */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: stat.delay, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="card-result p-5 cursor-pointer group relative"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-md`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">{stat.label}</div>
                  <div className={`text-2xl font-bold text-white`}>
                    {formatCurrency(stat.value)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}