import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Percent, Calendar, TrendingUp, Sparkles, ArrowUpRight, PiggyBank, PieChart } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { formatCurrency } from '@/lib/utils'
import { useDynamicTitle } from '@/lib/useDynamicTitle'

interface CompoundCalculatorProps {
  onProjectionUpdate: (data: Array<{ year: number; value: number; label: string }>) => void
  onResultsUpdate?: (results: Array<{ label: string; value: number; icon: any; color: string; isPercentage?: boolean }>) => void
  showResults?: boolean
  compact?: boolean
}

export default function CompoundCalculator({ onProjectionUpdate, onResultsUpdate, showResults = true, compact = false }: CompoundCalculatorProps) {
  const [initialAmount, setInitialAmount] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(7)
  const [years, setYears] = useState(20)

  useEffect(() => {
    const projection = []
    let currentValue = initialAmount
    const monthlyRate = annualReturn / 100 / 12

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        // Compound monthly contributions
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
  }, [initialAmount, monthlyContribution, annualReturn, years, onProjectionUpdate])

  // Calculate final values
  let finalValue = initialAmount
  const monthlyRate = annualReturn / 100 / 12
  for (let year = 0; year < years; year++) {
    for (let month = 0; month < 12; month++) {
      finalValue = finalValue * (1 + monthlyRate) + monthlyContribution
    }
  }

  const totalContributions = initialAmount + (monthlyContribution * 12 * years)
  const totalInterest = finalValue - totalContributions

  // Dynamic title based on calculations
  useDynamicTitle({
    calculatorType: 'compound',
    values: {
      investmentAmount: initialAmount,
      finalValue,
    },
  })

  // Memoize stats array to prevent infinite loop - only recreate when actual values change
  const stats = useMemo(() => [
    { label: 'Final Value', value: finalValue, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', delay: 0.1 },
    { label: 'Total Contributions', value: totalContributions, icon: PiggyBank, color: 'from-teal-500 to-cyan-500', delay: 0.2 },
    { label: 'Interest Earned', value: totalInterest, icon: Sparkles, color: 'from-cyan-500 to-blue-500', delay: 0.3 },
    { label: 'Return Multiple', value: (finalValue / totalContributions) * 100, icon: ArrowUpRight, color: 'from-blue-500 to-indigo-500', delay: 0.4, isPercentage: true },
  ], [finalValue, totalContributions, totalInterest])

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Compound Interest Calculator</h2>
              <p className="text-slate-400 text-sm">See how your investments grow</p>
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
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="whitespace-nowrap">Initial Investment</span>
            </label>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-right flex-shrink-0">
              {formatCurrency(initialAmount)}
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[initialAmount]}
            onValueChange={([value]) => setInitialAmount(value)}
            min={0}
            max={500000}
            step={1000}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full h-full shadow-lg shadow-emerald-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-emerald-500/50 border-2 border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>$0</span>
            <span>$500K</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-teal-500/10 border border-teal-500/20">
                <PiggyBank className="w-4 h-4 text-teal-400" />
              </div>
              <span className="whitespace-nowrap">Monthly Contribution</span>
            </label>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-right flex-shrink-0">
              {formatCurrency(monthlyContribution)}
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[monthlyContribution]}
            onValueChange={([value]) => setMonthlyContribution(value)}
            min={0}
            max={5000}
            step={50}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full h-full shadow-lg shadow-teal-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-teal-500/50 border-2 border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>$0</span>
            <span>$5K</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-cyan-500/10 border border-cyan-500/20">
                <Percent className="w-4 h-4 text-cyan-400" />
              </div>
              <span>Expected Annual Return</span>
            </label>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-right flex-shrink-0">
              {annualReturn.toFixed(2)}%
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[annualReturn]}
            onValueChange={([value]) => setAnnualReturn(value)}
            min={1}
            max={20}
            step={0.1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full h-full shadow-lg shadow-cyan-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-cyan-500/50 border-2 border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>1%</span>
            <span>20%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
        >
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300">
              <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 bg-blue-500/10 border border-blue-500/20">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <span>Investment Period</span>
            </label>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white text-right flex-shrink-0">
              {years} years
            </div>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[years]}
            onValueChange={([value]) => setYears(value)}
            min={1}
            max={40}
            step={1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full h-full shadow-lg shadow-blue-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full touch-manipulation shadow-xl shadow-blue-500/50 border-2 border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 hover:scale-125" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>1 year</span>
            <span>40 years</span>
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
                  {stat.isPercentage ? (
                    <div className="text-2xl font-bold text-white">
                      {(stat.value / 100).toFixed(2)}x
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(stat.value)}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
