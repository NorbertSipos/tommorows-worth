import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { analytics } from '@/lib/analytics'
import { useEffect } from 'react'

interface WealthProjectionChartProps {
  data: Array<{ year: number; value: number; label: string }>
}

export default function WealthProjectionChart({ data }: WealthProjectionChartProps) {
  const chartData = data.map(item => ({
    year: item.year,
    value: Math.round(item.value),
    label: item.label
  }))

  useEffect(() => {
    // Track chart view when component mounts
    analytics?.trackChartView('dividend')
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glassmorphism-strong p-4 rounded-xl border border-white/20 shadow-xl"
        >
          <p className="text-slate-300 mb-2 font-semibold">{`Year ${payload[0].payload.year}`}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {formatCurrency(payload[0].value)}
          </p>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[550px] relative"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
              <stop offset="50%" stopColor="#a855f7" stopOpacity={1}/>
              <stop offset="100%" stopColor="#ec4899" stopOpacity={1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8"
            style={{ fontSize: '13px', fontWeight: '500' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '13px', fontWeight: '500' }}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
              return `$${value}`
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="url(#lineColor)"
            strokeWidth={3}
            fill="url(#colorValue)"
            name="Wealth Projection"
            dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}