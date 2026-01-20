import { motion } from 'framer-motion'
import { TrendingUp, Calculator, DollarSign, Sparkles } from 'lucide-react'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Main Logo Icon - Reduced animation for better LCP */}
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-purple-500/30 blur-xl rounded-2xl"></div>
        
        {/* Main Container */}
        <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-2 sm:p-3 rounded-xl shadow-lg shadow-violet-500/30">
          {/* Calculator Icon */}
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          
          {/* Overlay Graph Icon */}
          <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white/90" strokeWidth={2.5} />
          </div>
          
          {/* Sparkle Effect */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1"
          >
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300" fill="currentColor" />
          </motion.div>
        </div>
      </div>

      {/* Text Logo - No animation delays for better LCP */}
      <div className="flex items-baseline gap-1 sm:gap-2">
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Tomorrow
        </span>
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white relative">
          Worth
          {/* Small Dollar Sign Accent */}
          <span className="absolute -top-0.5 sm:-top-1 -right-3 sm:-right-4 text-violet-400">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" />
          </span>
        </span>
      </div>
    </div>
  )
}