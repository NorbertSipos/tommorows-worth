import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Calendar, TrendingUp, DollarSign, AlertCircle, Home, Car, Plane, Gem } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { formatCurrency } from '@/lib/utils'
import { analytics } from '@/lib/analytics'

interface LatteFactorCalculatorProps {
  onProjectionUpdate?: (data: Array<{ year: number; value: number; label: string }>) => void
  onResultsUpdate?: (results: Array<{ label: string; value: number; icon: any; color: string }>) => void
  showResults?: boolean
  compact?: boolean
}

// Helper function to get insight based on future wealth
function getInsight(futureWealth: number): { text: string; icon: any } {
  if (futureWealth < 10000) {
    return { text: 'This could have been a nice vacation', icon: Plane }
  } else if (futureWealth < 50000) {
    return { text: 'This could have been a luxury watch', icon: Gem }
  } else if (futureWealth < 100000) {
    return { text: 'This could have been a luxury car', icon: Car }
  } else if (futureWealth < 500000) {
    return { text: 'This could have been a house down payment', icon: Home }
  } else {
    return { text: 'You just spent a house on small expenses', icon: AlertCircle }
  }
}

// Animated counter component
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (displayValue === value) return // Already at target
    
    let startTime: number | null = null
    let animationFrame: number
    const startValue = displayValue
    const endValue = value
    const duration = 800 // milliseconds

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(current)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value]) // Only depend on value, not displayValue

  return <span>{formatCurrency(Math.round(displayValue))}</span>
}

export default function LatteFactorCalculator({ 
  onProjectionUpdate, 
  onResultsUpdate, 
  showResults = true, 
  compact = false 
}: LatteFactorCalculatorProps) {
  const [dailyExpense, setDailyExpense] = useState(5)
  const [years, setYears] = useState(30)
  const [expectedReturn, setExpectedReturn] = useState(8)

  // Calculate monthly expense
  const monthlyExpense = dailyExpense * 30.4375

  // Calculate Future Value using annuity formula: FV = P * [((1 + r)^n - 1) / r]
  // Where P = monthly payment, r = monthly interest rate, n = total months
  const calculateFutureValue = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12
    const totalMonths = years * 12
    
    if (monthlyRate === 0) {
      // If no return, just sum of all payments
      return monthlyExpense * totalMonths
    }
    
    const futureValue = monthlyExpense * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate))
    return futureValue
  }, [monthlyExpense, years, expectedReturn])

  // Calculate total spent (linear, no compounding)
  const totalSpent = monthlyExpense * years * 12

  // Get insight based on future wealth
  const insight = useMemo(() => getInsight(calculateFutureValue), [calculateFutureValue])

  // Generate projection data for charts
  useEffect(() => {
    if (onProjectionUpdate) {
      const projection: Array<{ year: number; value: number; label: string }> = []
      const monthlyRate = expectedReturn / 100 / 12
      
      let accumulatedValue = 0
      
      for (let year = 0; year <= Math.min(years, 20); year++) {
        if (year > 0) {
          // Add 12 months of contributions and growth
          for (let month = 0; month < 12; month++) {
            accumulatedValue = accumulatedValue * (1 + monthlyRate) + monthlyExpense
          }
        }
        projection.push({
          year,
          value: accumulatedValue,
          label: `Year ${year}`
        })
      }
      
      onProjectionUpdate(projection)
    }
  }, [dailyExpense, years, expectedReturn, monthlyExpense, onProjectionUpdate])

  // Prepare results for ResultsPanel
  const stats = useMemo(() => [
    { 
      label: 'Total Spent', 
      value: totalSpent, 
      icon: DollarSign, 
      color: 'from-slate-500 to-slate-600', 
      delay: 0.1 
    },
    { 
      label: 'Potential Wealth', 
      value: calculateFutureValue, 
      icon: TrendingUp, 
      color: 'from-emerald-500 to-teal-500', 
      delay: 0.2 
    },
  ], [totalSpent, calculateFutureValue])

  // Update results callback
  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(stats)
    }
  }, [stats, onResultsUpdate])

  // Track calculation
  useEffect(() => {
    if (calculateFutureValue > 0) {
      analytics?.trackCalculation('latte-factor', formatCurrency(calculateFutureValue))
    }
  }, [calculateFutureValue])

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">The Cost of Today's Comfort</h2>
              <p className="text-slate-400 text-sm">Calculate the opportunity cost of daily expenses</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Input Sliders */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
              <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                  <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <span>Daily Expense</span>
              </label>
              <input
                type="number"
                value={dailyExpense}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setDailyExpense(Math.max(1, Math.min(200, value)))
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 5
                  setDailyExpense(Math.max(1, Math.min(200, value)))
                }}
                className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-emerald-500/50 focus:border-emerald-500 focus:outline-none w-full sm:w-auto sm:min-w-0 sm:flex-shrink-0 sm:max-w-[120px] md:max-w-[140px] px-1 sm:px-2 py-1 self-end sm:self-auto"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                min={1}
                max={200}
                step={0.5}
              />
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-8 sm:h-6 group"
              value={[dailyExpense]}
              onValueChange={([value]) => {
                setDailyExpense(value)
                analytics?.trackSliderMove('latte-factor', value)
              }}
              min={1}
              max={200}
              step={0.5}
            >
              <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
                <Slider.Range className="absolute bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full h-full shadow-lg shadow-emerald-500/50" />
              </Slider.Track>
              <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-emerald-500/50 border-2 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 hover:scale-125 touch-manipulation" />
            </Slider.Root>
            <div className="flex justify-between text-xs sm:text-sm text-slate-400">
              <span>$1</span>
              <span>$200</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
              <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
                <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
                </div>
                <span>Time Horizon</span>
              </label>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setYears(Math.max(1, Math.min(50, value)))
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value) || 30
                    setYears(Math.max(1, Math.min(50, value)))
                  }}
                  className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-teal-500/50 focus:border-teal-500 focus:outline-none w-full sm:w-auto sm:min-w-0 sm:flex-shrink-0 sm:max-w-[80px] md:max-w-[100px] px-1 sm:px-2 py-1"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                  min={1}
                  max={50}
                  step={1}
                />
                <span className="text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">{years === 1 ? 'year' : 'years'}</span>
              </div>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
              value={[years]}
              onValueChange={([value]) => {
                setYears(value)
                analytics?.trackSliderMove('latte-factor', value)
              }}
              min={1}
              max={50}
              step={1}
            >
              <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
                <Slider.Range className="absolute bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full h-full shadow-lg shadow-teal-500/50" />
              </Slider.Track>
              <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-teal-500/50 border-2 border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/30 hover:scale-125 touch-manipulation" />
            </Slider.Root>
            <div className="flex justify-between text-xs sm:text-sm text-slate-400">
              <span>1 year</span>
              <span>50 years</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
                <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                </div>
                <span>Expected Annual Return</span>
              </label>
              <div className="flex items-center gap-1 self-end sm:self-auto sm:ml-2">
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0
                    setExpectedReturn(Math.max(3, Math.min(15, value)))
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value) || 8
                    setExpectedReturn(Math.max(3, Math.min(15, value)))
                  }}
                  className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-500 focus:outline-none w-full sm:w-auto sm:min-w-0 sm:flex-shrink-0 sm:max-w-[80px] md:max-w-[100px] px-1 sm:px-2 py-1"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                  min={3}
                  max={15}
                  step={0.1}
                />
                <span className="text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">%</span>
              </div>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
              value={[expectedReturn]}
              onValueChange={([value]) => {
                setExpectedReturn(value)
                analytics?.trackSliderMove('latte-factor', value)
              }}
              min={3}
              max={15}
              step={0.1}
            >
              <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
                <Slider.Range className="absolute bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full h-full shadow-lg shadow-cyan-500/50" />
              </Slider.Track>
              <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-cyan-500/50 border-2 border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 hover:scale-125 touch-manipulation" />
            </Slider.Root>
            <div className="flex justify-between text-xs sm:text-sm text-slate-400">
              <span>3%</span>
              <span>15%</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Future Wealth Display */}
        <div className="space-y-4">
          {/* Large Future Wealth Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="card-modern p-6 sm:p-8 relative"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-50 blur-2xl rounded-2xl overflow-hidden" />
            
            <div className="relative z-10 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">
                  Future Wealth Lost
                </span>
              </div>
              
              <motion.div
                key={calculateFutureValue}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-4 w-full"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 leading-tight whitespace-nowrap">
                  <AnimatedNumber value={calculateFutureValue} />
                </div>
              </motion.div>
              
              {/* Insight Text */}
              <motion.div
                key={insight.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-slate-300 text-sm sm:text-base"
              >
                {(() => {
                  const Icon = insight.icon
                  return <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
                })()}
                <span className="italic">{insight.text}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Comparison Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-modern p-4 sm:p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-400" />
              Comparison
            </h3>
            
            <div className="space-y-4">
              {/* Total Spent */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-600/50">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">Total Spent</span>
                </div>
                <span className="text-xl font-bold text-slate-300">
                  {formatCurrency(totalSpent)}
                </span>
              </div>

              {/* Potential Wealth */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="p-1.5 rounded bg-gradient-to-br from-emerald-500 to-teal-500 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-emerald-300 text-sm font-medium">Potential Wealth</span>
                </div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 flex-shrink-0 ml-2">
                  {formatCurrency(calculateFutureValue)}
                </span>
              </div>

              {/* Difference */}
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                    Opportunity Cost
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    {formatCurrency(calculateFutureValue - totalSpent)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results Grid - Only show if showResults is true */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {stats.map((stat) => {
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
                  <div className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(stat.value)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
