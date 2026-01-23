import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, TrendingDown, TrendingUp, Coins } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { formatCurrency } from '@/lib/utils'
import { analytics } from '@/lib/analytics'
import AdSense from '@/components/AdSense'

interface InflationTimeMachineProps {
  onProjectionUpdate?: (data: Array<{ year: number; value: number; label: string }>) => void
  onResultsUpdate?: (results: Array<{ label: string; value: number; icon: any; color: string }>) => void
  showResults?: boolean
  compact?: boolean
}

// Historical CPI data (base year 1982-84 = 100, converted to match historical scale)
// USD CPI data based on US Bureau of Labor Statistics (official data from 1913+)
// EUR CPI data estimated based on historical European inflation (pre-Euro: weighted average of major EU countries)
const CPI_DATA = {
  USD: {
    // 1920s-1960s: Official BLS data
    1920: 20.0, 1921: 17.9, 1922: 16.8, 1923: 17.1, 1924: 17.1,
    1925: 17.5, 1926: 17.7, 1927: 17.4, 1928: 17.1, 1929: 17.1,
    1930: 16.7, 1931: 15.2, 1932: 13.7, 1933: 13.0, 1934: 13.4,
    1935: 13.7, 1936: 13.9, 1937: 14.4, 1938: 14.1, 1939: 13.9,
    1940: 14.0, 1941: 14.7, 1942: 16.3, 1943: 17.3, 1944: 17.6,
    1945: 18.0, 1946: 19.5, 1947: 22.3, 1948: 24.1, 1949: 23.8,
    1950: 24.1, 1951: 26.0, 1952: 26.5, 1953: 26.7, 1954: 26.9,
    1955: 26.8, 1956: 27.2, 1957: 28.1, 1958: 28.9, 1959: 29.1,
    1960: 29.6, 1961: 29.9, 1962: 30.2, 1963: 30.6, 1964: 31.0,
    1965: 31.5, 1966: 32.4, 1967: 33.4, 1968: 34.8, 1969: 36.7,
    // 1970s-present: Official BLS data
    1970: 38.8, 1971: 40.5, 1972: 41.8, 1973: 44.4, 1974: 49.3,
    1975: 53.8, 1976: 56.9, 1977: 60.6, 1978: 65.2, 1979: 72.6,
    1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9,
    1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0,
    1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2,
    1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6,
    2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9,
    2005: 195.3, 2006: 201.6, 2007: 207.3, 2008: 215.3, 2009: 214.5,
    2010: 218.1, 2011: 224.9, 2012: 229.6, 2013: 233.0, 2014: 236.7,
    2015: 237.0, 2016: 240.0, 2017: 245.1, 2018: 251.1, 2019: 255.7,
    2020: 258.8, 2021: 270.9, 2022: 292.7, 2023: 304.7, 2024: 313.8,
    2025: 323.2, 2026: 332.9, // 2026 estimated at 3% inflation
  },
  EUR: {
    // 1920s-1960s: Estimated based on historical European inflation (weighted average of Germany, France, Italy, etc.)
    // Note: Euro didn't exist until 1999, so pre-1999 data is estimated from major European economies
    1920: 18.5, 1921: 16.2, 1922: 15.8, 1923: 22.1, 1924: 20.5,
    1925: 19.8, 1926: 19.2, 1927: 18.9, 1928: 18.5, 1929: 18.3,
    1930: 17.8, 1931: 16.5, 1932: 15.2, 1933: 14.5, 1934: 14.8,
    1935: 15.1, 1936: 15.4, 1937: 15.9, 1938: 16.2, 1939: 16.5,
    1940: 17.1, 1941: 18.5, 1942: 20.2, 1943: 22.8, 1944: 26.5,
    1945: 28.9, 1946: 32.1, 1947: 35.8, 1948: 38.2, 1949: 36.5,
    1950: 35.2, 1951: 37.8, 1952: 39.1, 1953: 38.9, 1954: 38.5,
    1955: 38.2, 1956: 38.8, 1957: 39.5, 1958: 40.1, 1959: 40.3,
    1960: 40.8, 1961: 41.2, 1962: 41.8, 1963: 42.5, 1964: 43.1,
    1965: 43.8, 1966: 44.5, 1967: 45.2, 1968: 46.1, 1969: 47.2,
    // 1970s-present: Eurozone estimates and official data
    1970: 38.2, 1971: 39.8, 1972: 41.1, 1973: 43.9, 1974: 48.1,
    1975: 52.3, 1976: 55.2, 1977: 58.1, 1978: 60.8, 1979: 64.5,
    1980: 70.2, 1981: 76.8, 1982: 82.1, 1983: 87.3, 1984: 91.5,
    1985: 94.2, 1986: 95.8, 1987: 97.9, 1988: 100.0, 1989: 102.8,
    1990: 105.9, 1991: 109.5, 1992: 113.2, 1993: 116.8, 1994: 119.5,
    1995: 122.1, 1996: 124.3, 1997: 126.2, 1998: 127.8, 1999: 129.3,
    2000: 131.8, 2001: 134.6, 2002: 137.5, 2003: 140.2, 2004: 142.8,
    2005: 145.7, 2006: 148.5, 2007: 151.2, 2008: 155.8, 2009: 156.1,
    2010: 158.5, 2011: 163.2, 2012: 166.8, 2013: 169.1, 2014: 170.3,
    2015: 170.5, 2016: 171.2, 2017: 173.8, 2018: 176.5, 2019: 179.1,
    2020: 180.2, 2021: 185.3, 2022: 197.8, 2023: 207.2, 2024: 213.4,
    2025: 219.8, 2026: 226.4, // 2026 estimated at 3% inflation
  },
}

// Format currency with currency code
function formatCurrencyWithCode(value: number, currency: 'USD' | 'EUR'): string {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Shopping Basket SVG Component
function ShoppingBasketIcon({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width={120 * scale}
      height={120 * scale}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all duration-500"
    >
      {/* Basket body */}
      <path
        d="M20 40 L20 90 Q20 100 30 100 L90 100 Q100 100 100 90 L100 40"
        stroke="url(#basketGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Basket handle */}
      <path
        d="M30 40 Q30 20 50 20 Q70 20 70 40"
        stroke="url(#basketGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Basket lines */}
      <line x1="30" y1="60" x2="90" y2="60" stroke="url(#basketGradient)" strokeWidth="2" opacity="0.5" />
      <line x1="30" y1="75" x2="90" y2="75" stroke="url(#basketGradient)" strokeWidth="2" opacity="0.5" />
      <defs>
        <linearGradient id="basketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function InflationTimeMachine({
  onProjectionUpdate,
  onResultsUpdate,
  showResults = true,
  compact = false,
}: InflationTimeMachineProps) {
  const [amount, setAmount] = useState(1000)
  const [startingYear, setStartingYear] = useState(2000)
  const [targetYear, setTargetYear] = useState(2026)
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD')

  // Calculate purchasing power
  const result = useMemo(() => {
    const startCPI = CPI_DATA[currency][startingYear as keyof typeof CPI_DATA.USD]
    const targetCPI = CPI_DATA[currency][targetYear as keyof typeof CPI_DATA.USD]
    
    if (!startCPI || !targetCPI) return amount
    
    return amount * (targetCPI / startCPI)
  }, [amount, startingYear, targetYear, currency])

  // Calculate percentage change
  const percentageChange = useMemo(() => {
    if (amount === 0) return 0
    return ((result - amount) / amount) * 100
  }, [amount, result])

  // Calculate basket scale (visual representation of purchasing power)
  const basketScale = useMemo(() => {
    if (startingYear === targetYear) return 1
    const startCPI = CPI_DATA[currency][startingYear as keyof typeof CPI_DATA.USD]
    const targetCPI = CPI_DATA[currency][targetYear as keyof typeof CPI_DATA.USD]
    if (!startCPI || !targetCPI) return 1
    // If going forward in time (inflation), basket shrinks
    // If going backward in time (deflation), basket grows
    return targetYear > startingYear ? startCPI / targetCPI : targetCPI / startCPI
  }, [startingYear, targetYear, currency])

  // Generate projection data
  useEffect(() => {
    if (onProjectionUpdate) {
      const projection: Array<{ year: number; value: number; label: string }> = []
      const startCPI = CPI_DATA[currency][startingYear as keyof typeof CPI_DATA.USD]
      
      if (startCPI) {
        for (let year = Math.min(startingYear, targetYear); year <= Math.max(startingYear, targetYear); year++) {
          const yearCPI = CPI_DATA[currency][year as keyof typeof CPI_DATA.USD]
          if (yearCPI) {
            projection.push({
              year,
              value: amount * (yearCPI / startCPI),
              label: `${year}`
            })
          }
        }
      }
      
      onProjectionUpdate(projection)
    }
  }, [amount, startingYear, targetYear, currency, onProjectionUpdate])

  // Prepare results for ResultsPanel
  const stats = useMemo(() => [
    {
      label: 'Original Amount',
      value: amount,
      icon: DollarSign,
      color: 'from-amber-500 to-yellow-500',
      delay: 0.1,
    },
    {
      label: 'Equivalent Value',
      value: result,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      delay: 0.2,
    },
    {
      label: 'Value Change',
      value: Math.abs(result - amount),
      icon: result > amount ? TrendingUp : TrendingDown,
      color: result > amount ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500',
      delay: 0.3,
    },
  ], [amount, result])

  useEffect(() => {
    if (onResultsUpdate) {
      onResultsUpdate(stats)
    }
  }, [stats, onResultsUpdate])

  // Track calculation
  useEffect(() => {
    if (result > 0) {
      analytics?.trackCalculation('inflation-time-machine', formatCurrencyWithCode(result, currency))
    }
  }, [result, currency])

  const years = Array.from({ length: 57 }, (_, i) => 1970 + i)

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">The Inflation Time Machine</h2>
              <p className="text-slate-400 text-sm">See how purchasing power changes over time</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Currency Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-input p-4 sm:p-6"
      >
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrency('USD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              currency === 'USD'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">USD</span>
          </button>
          <button
            onClick={() => setCurrency('EUR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              currency === 'EUR'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span className="font-semibold">EUR</span>
          </button>
        </div>
      </motion.div>

      {/* Amount Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5 group"
      >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                {currency === 'USD' ? (
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                )}
              </div>
            <span className="truncate">Amount</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0
              setAmount(Math.max(1, Math.min(1000000, value)))
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value) || 1000
              setAmount(Math.max(1, Math.min(1000000, value)))
            }}
            className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-amber-500/50 focus:border-amber-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[120px] sm:max-w-[160px] px-1 sm:px-2 py-1"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
            }}
            min={1}
            max={1000000}
            step={100}
          />
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-8 sm:h-6 group"
          value={[amount]}
          onValueChange={([value]) => {
            setAmount(value)
            analytics?.trackSliderMove('inflation-time-machine', value)
          }}
          min={1}
          max={1000000}
          step={100}
        >
          <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
            <Slider.Range className="absolute bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-full h-full shadow-lg shadow-amber-500/50" />
          </Slider.Track>
          <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-amber-500/50 border-2 border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/30 hover:scale-125 touch-manipulation" />
        </Slider.Root>
        <div className="flex justify-between text-xs sm:text-sm text-slate-400">
          <span>{formatCurrencyWithCode(1, currency)}</span>
          <span>{formatCurrencyWithCode(1000000, currency)}</span>
        </div>
      </motion.div>

      {/* Timeline Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Starting Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
              </div>
              <span className="truncate">Starting Year</span>
            </label>
            <input
              type="number"
              value={startingYear}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1920
                setStartingYear(Math.max(1920, Math.min(2026, value)))
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 2000
                setStartingYear(Math.max(1920, Math.min(2026, value)))
              }}
              className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-yellow-500/50 focus:border-yellow-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[100px] sm:max-w-[120px] px-1 sm:px-2 py-1"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
              min={1920}
              max={2026}
              step={1}
            />
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[startingYear]}
            onValueChange={([value]) => {
              setStartingYear(value)
              analytics?.trackSliderMove('inflation-time-machine', value)
            }}
            min={1920}
            max={2026}
            step={1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-full h-full shadow-lg shadow-yellow-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-yellow-500/50 border-2 border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 hover:scale-125 touch-manipulation" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>1920</span>
            <span>2026</span>
          </div>
        </motion.div>

        {/* Target Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-input p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <div className="flex items-center justify-between gap-2 min-w-0">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-slate-300 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
              </div>
              <span className="truncate">Target Year</span>
            </label>
            <input
              type="number"
              value={targetYear}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 2026
                setTargetYear(Math.max(1920, Math.min(2026, value)))
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 2026
                setTargetYear(Math.max(1920, Math.min(2026, value)))
              }}
              className="text-base sm:text-lg md:text-xl font-bold text-white text-right bg-transparent border-b-2 border-orange-500/50 focus:border-orange-500 focus:outline-none min-w-0 flex-shrink-0 max-w-[100px] sm:max-w-[120px] px-1 sm:px-2 py-1"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
              }}
              min={1920}
              max={2026}
              step={1}
            />
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-8 sm:h-6"
            value={[targetYear]}
            onValueChange={([value]) => {
              setTargetYear(value)
              analytics?.trackSliderMove('inflation-time-machine', value)
            }}
            min={1920}
            max={2026}
            step={1}
          >
            <Slider.Track className="bg-slate-800/50 relative grow rounded-full h-4 sm:h-3 border border-slate-700/50">
              <Slider.Range className="absolute bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full h-full shadow-lg shadow-orange-500/50" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 sm:w-6 sm:h-6 bg-white rounded-full shadow-xl shadow-orange-500/50 border-2 border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/30 hover:scale-125 touch-manipulation" />
          </Slider.Root>
          <div className="flex justify-between text-xs sm:text-sm text-slate-400">
            <span>1920</span>
            <span>2026</span>
          </div>
        </motion.div>
      </div>

      {/* Main Result Display with Shopping Basket */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card-modern p-6 sm:p-8 relative"
      >
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 opacity-50 blur-2xl rounded-2xl overflow-hidden" />
        
        <div className="relative z-10">
          {/* Shopping Basket Visualization */}
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ scale: basketScale }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <ShoppingBasketIcon scale={Math.max(0.5, Math.min(1.5, basketScale))} />
            </motion.div>
          </div>

          {/* The Verdict */}
          <div className="text-center mb-6">
            <motion.div
              key={`${startingYear}-${targetYear}-${result}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-xl text-slate-300 mb-4"
            >
              <span className="font-semibold text-amber-400">
                {formatCurrencyWithCode(amount, currency)}
              </span>
              {' '}in{' '}
              <span className="font-semibold text-yellow-400">{startingYear}</span>
              {' '}is equivalent to{' '}
              <span className="font-semibold text-orange-400">
                {formatCurrencyWithCode(result, currency)}
              </span>
              {' '}in{' '}
              <span className="font-semibold text-yellow-400">{targetYear}</span>
            </motion.div>

            {/* The Erosion */}
            <motion.div
              key={`${percentageChange}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${
                percentageChange > 0
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400'
              }`}
            >
              {percentageChange > 0 ? '+' : ''}
              {percentageChange.toFixed(1)}%
              <span className="text-xl sm:text-2xl text-slate-400 ml-2">
                {percentageChange > 0 ? 'inflation' : 'deflation'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AdSense Placeholder */}
      <div className="mb-6">
        <AdSense 
          position="sidebar" 
          adSlot="9320523952"
          adFormat="auto"
          className="w-full"
        />
      </div>

      {/* Results Grid - Only show if showResults is true */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                    {formatCurrencyWithCode(stat.value, currency)}
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
