import { motion } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { analytics } from '@/lib/analytics'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  calculatorType: 'dividend' | 'compound' | '4percent'
}

const faqs: Record<string, FAQItem[]> = {
  dividend: [
    {
      question: 'How much do I need to invest to earn $1,000 per month in dividends?',
      answer: 'To earn $1,000 per month ($12,000 annually), you would need approximately $342,857 invested at a 3.5% dividend yield. The formula is: Annual Dividend Goal ÷ Dividend Yield = Investment Needed. Example: $12,000 ÷ 0.035 = $342,857.',
    },
    {
      question: 'What is a good dividend yield percentage?',
      answer: 'A good dividend yield typically ranges from 2-6%. Yields above 6% may indicate higher risk. The S&P 500 average is around 1.5-2%. Focus on companies with consistent dividend growth, not just high yields.',
    },
    {
      question: 'Do dividends compound automatically?',
      answer: 'Dividends compound when you reinvest them (DRIP - Dividend Reinvestment Plan). This calculator assumes reinvestment, which accelerates growth. Without reinvestment, you only earn the base dividend yield each year.',
    },
    {
      question: 'How is dividend income taxed?',
      answer: 'Qualified dividends are taxed at long-term capital gains rates (0%, 15%, or 20% depending on income). Non-qualified dividends are taxed as ordinary income. Consult a tax professional for your specific situation.',
    },
    {
      question: 'What dividend stocks pay monthly?',
      answer: 'Most stocks pay quarterly, but some REITs and ETFs like O (Realty Income), MAIN (Main Street Capital), and SPHD (S&P High Dividend Low Volatility ETF) pay monthly dividends.',
    },
  ],
  compound: [
    {
      question: 'How much will $10,000 be worth in 20 years with compound interest?',
      answer: 'At a 7% annual return, $10,000 would grow to approximately $38,697 in 20 years without additional contributions. With $500 monthly contributions, it would grow to approximately $299,000.',
    },
    {
      question: 'What is the rule of 72?',
      answer: 'The Rule of 72 estimates how long it takes to double your money: 72 ÷ Interest Rate = Years to Double. At 7% return, your money doubles in about 10.3 years (72 ÷ 7 = 10.3).',
    },
    {
      question: 'How often is interest compounded?',
      answer: 'This calculator compounds interest monthly, which is standard for most investment accounts. More frequent compounding (daily) yields slightly more, but the difference is minimal.',
    },
    {
      question: 'What is a realistic annual return expectation?',
      answer: 'Historical stock market average is 7-10% annually (adjusted for inflation). Conservative portfolios: 4-6%. Aggressive portfolios: 8-12%. Past performance doesn\'t guarantee future results.',
    },
    {
      question: 'Should I invest monthly or annually?',
      answer: 'Monthly investing (dollar-cost averaging) is generally better because it reduces timing risk and allows compound interest to work more frequently. This calculator assumes monthly contributions.',
    },
  ],
  '4percent': [
    {
      question: 'How much do I need to retire using the 4% rule?',
      answer: 'To retire using the 4% rule, you need 25 times your annual expenses saved. For example, if you need $60,000 per year, you need $1.5 million saved. The formula: Annual Expenses × 25 = Retirement Nest Egg.',
    },
    {
      question: 'Is the 4% rule still valid in 2026?',
      answer: 'The 4% rule was based on historical data from 1926-1995. Some experts suggest 3-3.5% might be safer due to lower expected returns. However, it remains a widely-used benchmark. Adjust based on your age, health, and market conditions.',
    },
    {
      question: 'What if I want to retire earlier than 30 years?',
      answer: 'For early retirement (40+ years), consider a 3-3.5% withdrawal rate for extra safety. The longer your retirement timeline, the more conservative you should be. Use a lower withdrawal rate or save more.',
    },
    {
      question: 'Does the 4% rule account for taxes?',
      answer: 'No, the 4% rule doesn\'t account for taxes. Your withdrawal rate should be after-tax. If you need $60,000 after taxes, account for your tax bracket when calculating your required savings.',
    },
    {
      question: 'What portfolio allocation does the 4% rule assume?',
      answer: 'The Trinity Study tested 50-75% stock allocations. The 4% rule works best with 60-70% stocks and 30-40% bonds. This diversification helps weather market volatility during retirement.',
    },
  ],
}

export default function FAQ({ calculatorType }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const items = faqs[calculatorType] || []

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card-modern p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="border border-slate-700/50 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => {
                const newIndex = openIndex === index ? null : index
                setOpenIndex(newIndex)
                if (newIndex !== null) {
                  analytics?.trackFAQOpen(calculatorType, item.question)
                }
              }}
              className="w-full text-left p-3 sm:p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors touch-manipulation"
            >
              <span className="font-semibold text-white pr-3 sm:pr-4 text-sm sm:text-base">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="p-3 sm:p-4 pt-0 text-slate-300 text-sm sm:text-base border-t border-slate-700/50">
                {item.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}