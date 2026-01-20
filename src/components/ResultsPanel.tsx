import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import AdSensePlaceholder from '@/components/AdSensePlaceholder'

interface ResultItem {
  label: string
  value: number
  icon: any
  color: string
  delay?: number
  isPercentage?: boolean
  suffix?: string
}

interface ResultsPanelProps {
  results: ResultItem[]
  title?: string
}

export default function ResultsPanel({ results, title = 'Results' }: ResultsPanelProps) {
  if (!results || results.length === 0) {
    return (
      <div className="card-modern p-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          {title}
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm text-center">
            Adjust the sliders to see your results here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-modern p-4 sm:p-6 h-full flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
        {title}
      </h2>
      <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
        {results.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (stat.delay || 0) + index * 0.05, duration: 0.3 }}
              className="card-result p-3 sm:p-4 cursor-pointer group relative"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-md flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wide break-words">
                      {stat.label}
                    </div>
                  </div>
                </div>
                <div className="ml-8 sm:ml-11">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">
                    {stat.isPercentage 
                      ? `${(stat.value / 100).toFixed(2)}x`
                      : stat.label.includes('Years') && stat.value > 50
                      ? '∞' + (stat.suffix || '')
                      : stat.label.includes('Years')
                      ? `${stat.value.toFixed(0)}${stat.suffix || ''}`
                      : formatCurrency(stat.value) + (stat.suffix || '')
                    }
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
        
        {/* AdSense Placeholder - Fills remaining space */}
        <div className="mt-auto pt-4">
          <AdSensePlaceholder 
            position="sidebar" 
            slotId="results-sidebar"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}