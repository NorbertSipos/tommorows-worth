import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Percent, Target, TrendingUp, Sparkles, ArrowUpRight, Calendar, Flag } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { formatCurrency } from '@/lib/utils'
import { useDynamicTitle } from '@/lib/useDynamicTitle'

interface FourPercentRuleCalculatorProps {
  onProjectionUpdate: (data: Array<{ year: number; value: number; label: string }>) => void
  onResultsUpdate?: (results: Array<{ label: string; value: number; icon: any; color: string; suffix?: string }>) => void
  showResults?: boolean
  compact?: boolean
}

export default function FourPercentRuleCalculator({ onProjectionUpdate, onResultsUpdate, showResults = true, compact = false }: FourPercentRuleCalculatorProps) {
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000)
  const [currentSavings, setCurrentSavings] = useState(100000)
  const [expectedReturn, setExpectedReturn] = useState(7)

  useEffect(() => {
    const annualExpenses = monthlyExpenses * 12
    const targetAmount = annualExpenses * 25 // 4% rule: 25x annual expenses
    const projection = []
    
    let currentValue = currentSavings
    const monthlyRate = expectedReturn / 100 / 12
    const monthlyContribution = (targetAmount - currentSavings) / (20 * 12) // Assuming 20 years to reach target

    for (let year = 0; year <= 20; year++) {
      if (year > 0) {
        // Compound with monthly contributions
        for (let month = 0; month < 12; month++) {
          currentValue = currentValue * (1 + monthlyRate) + monthlyContribution
        }
      }
      projection.push({
        year,
        value: currentValue,
        label: `Year ${year}`
      })
    }

    onProjectionUpdate(projection)
  }, [monthlyExpenses, currentSavings, expectedReturn, onProjectionUpdate])

  const annualExpenses = monthlyExpenses * 12
  const targetAmount = annualExpenses * 25 // 4% rule
  const safeWithdrawal = targetAmount * 0.04

  function calculateYearsToFI(
    current: number,
    returnRate: number,
    target: number
  ): { years: number; monthlyContribution: number } {
    if (current >= target) return { years: 0, monthlyContribution: 0 }
    
    // Estimate monthly contribution needed
    // We'll use a binary search approach to find the right contribution
    let low = 0
    let high = (target - current) / 12 // Maximum monthly needed if no growth
    let monthlyContribution = high / 2
    let years = 0
    
    for (let iteration = 0; iteration < 100; iteration++) {
      monthlyContribution = (low + high) / 2
      let savings = current
      years = 0
      const monthlyRate = returnRate / 100 / 12
      
      while (savings < target && years < 50) {
        for (let month = 0; month < 12; month++) {
          savings = savings * (1 + monthlyRate) + monthlyContribution
        }
        years++
      }
      
      if (Math.abs(savings - target) < 1000 || years >= 50) {
        break
      }
      
      if (savings > target) {
        high = monthlyContribution
      } else {
        low = monthlyContribution
      }
    }
    
    return { years, monthlyContribution }
  }

  const { years: yearsToFI, monthlyContribution: monthlyNeeded } = calculateYearsToFI(
    currentSavings,
    expectedReturn,
    targetAmount
  )

  // Dynamic title based on calculations
  useDynamicTitle({
    calculatorType: '4percent',
    values: {
      targetAmount,
      yearsToFI: yearsToFI > 50 ? undefined : yearsToFI,
    },
  })

  // Memoize stats array to prevent infinite loop - only recreate when actual values change
  const stats = useMemo(() => [
    { label: 'Target Amount (FI)', value: targetAmount, icon: Target, color: 'from-orange-500 to-amber-500', delay: 0.1 },
    { label: 'Safe Withdrawal (4%)', value: safeWithdrawal, icon: DollarSign, color: 'from-amber-500 to-yellow-500', delay: 0.2, suffix: '/year' },
    { label: 'Years to Financial Independence', value: yearsToFI > 50 ? 50 : yearsToFI, icon: Calendar, color: 'from-yellow-500 to-orange-500', delay: 0.3, suffix: yearsToFI > 50 ? ' (∞)' : ' years' },
    { label: 'Monthly Contribution Needed', value: monthlyNeeded, icon: TrendingUp, color: 'from-orange-500 to-rose-500', delay: 0.4 },
  ], [targetAmount, safeWithdrawal, yearsToFI, monthlyNeeded])

  // Update results callback when stats change
  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(stats.map(stat => {
        if (stat.label.includes('Years')) {
          return {
            ...stat,
            value: yearsToFI > 50 ? 50 : yearsToFI,
            suffix: yearsToFI > 50 ? ' (∞)' : ' years',
          }
        }
        return stat
      }))
    }
  }, [stats, onResultsUpdate, yearsToFI])

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">4% Rule Calculator</h2>
              <p className="text-slate-400 text-sm">Calculate financial independence</p>
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
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-orange-500/10 border border-orange-500/20">
                <DollarSign className="w-4 h-4 text-orange-400" />
              </div>
              <span className="truncate">Monthly Expenses</span>
            </label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setMonthlyExpenses(Math.max(1000, Math.min(20000, value)))
              }}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 5000
                setMonthlyExpenses(Math.max(1000, Math.min(20000, value)))
              }}
              className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-orange-500/50 focus:border-orange-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[120px] sm:max-w-[160px] px-1 sm:px-2 py-1"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
              min={1000}
              max={20000}
              step={100}
            />
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[monthlyExpenses]}
            onValueChange={([value]) => setMonthlyExpenses(value)}
            min={1000}
            max={20000}
            step={100}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full h-full shadow-lg shadow-orange-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-orange-500/50 border-2 border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>$1K</span>
            <span>$20K</span>
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
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="truncate">Current Savings</span>
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setCurrentSavings(Math.max(0, Math.min(5000000, value)))
              }}
              onBlur={(e) => {
                const value = parseFloat(e.target.value) || 100000
                setCurrentSavings(Math.max(0, Math.min(5000000, value)))
              }}
              className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-amber-500/50 focus:border-amber-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[120px] sm:max-w-[160px] px-1 sm:px-2 py-1"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
              min={0}
              max={5000000}
              step={1000}
            />
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[currentSavings]}
            onValueChange={([value]) => setCurrentSavings(value)}
            min={0}
            max={5000000}
            step={10000}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-full h-full shadow-lg shadow-amber-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-amber-500/50 border-2 border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>$0</span>
            <span>$5M</span>
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
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-rose-500/10 border border-rose-500/20">
                <Percent className="w-4 h-4 text-rose-400" />
              </div>
              <span className="truncate">Expected Annual Return</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setExpectedReturn(Math.max(3, Math.min(12, value)))
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 7
                  setExpectedReturn(Math.max(3, Math.min(12, value)))
                }}
                className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-rose-500/50 focus:border-rose-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[80px] sm:max-w-[100px] px-1 sm:px-2 py-1"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                min={3}
                max={12}
                step={0.1}
              />
              <span className="text-base sm:text-lg md:text-xl font-bold text-white flex-shrink-0">%</span>
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[expectedReturn]}
            onValueChange={([value]) => setExpectedReturn(value)}
            min={3}
            max={12}
            step={0.1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-full h-full shadow-lg shadow-rose-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-rose-500/50 border-2 border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>3%</span>
            <span>12%</span>
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
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-right flex-shrink-0">
                    {stat.label.includes('Years') && yearsToFI > 50 
                      ? '∞' 
                      : stat.label.includes('Years')
                      ? `${yearsToFI.toFixed(0)}${stat.suffix || ''}`
                      : formatCurrency(stat.value) + (stat.suffix || '')
                    }
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
