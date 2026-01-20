import { motion } from 'framer-motion'

interface AdSensePlaceholderProps {
  position: 'top' | 'sidebar'
  slotId: string
  className?: string
}

export default function AdSensePlaceholder({ position, slotId, className = '' }: AdSensePlaceholderProps) {
  // Google AdSense placeholder component
  // Replace this with actual AdSense code when ready
  // Example structure:
  // <ins className="adsbygoogle"
  //   style="display:block"
  //   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  //   data-ad-slot={slotId}
  //   data-ad-format="auto"
  //   data-full-width-responsive="true"></ins>

  // Check if className contains 'w-full' or similar wide indicators
  const isWide = className.includes('w-full') || className.includes('full')
  
  // For sidebar position, use flex-1 to fill available space when in flex container
  const dimensions = position === 'top' 
    ? 'w-full h-24 md:h-32' 
    : isWide 
      ? 'w-full h-24 md:h-32' 
      : 'w-full h-[250px] md:h-[300px] flex-1 min-h-[200px]'
  
  const adSize = position === 'top' || isWide
    ? '728x90 / 970x250'
    : '300x250 / 300x600'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`card-input p-4 flex items-center justify-center ${dimensions} ${className} relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="text-center text-slate-500 text-sm relative z-10">
        <div className="text-xs mb-2 font-medium">Ad Slot: {slotId}</div>
        <div className="text-xs opacity-50">
          {adSize}
        </div>
      </div>
    </motion.div>
  )
}