import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AdSenseProps {
  position: 'top' | 'sidebar'
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  fullWidthResponsive?: boolean
}

export default function AdSense({ 
  position, 
  adSlot, 
  adFormat = 'auto',
  className = '',
  fullWidthResponsive = true
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const adClient = 'ca-pub-3354712515977000'

  useEffect(() => {
    // Push ad to Google AdSense
    if (typeof window !== 'undefined' && adRef.current) {
      try {
        // Initialize adsbygoogle array if it doesn't exist and push ad
        ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [])

  // Determine dimensions based on position and format
  const isWide = className.includes('w-full') || className.includes('full')
  const dimensions = position === 'top' 
    ? 'w-full h-24 md:h-32' 
    : isWide 
      ? 'w-full h-24 md:h-32' 
      : 'w-full h-[250px] md:h-[300px] flex-1 min-h-[200px]'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`${dimensions} ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </motion.div>
  )
}
