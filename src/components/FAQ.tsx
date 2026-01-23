import { motion } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { analytics } from '@/lib/analytics'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  calculatorType: 'dividend' | 'compound' | '4percent' | 'latte' | 'inflation'
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
    {
      question: 'How do I find quality dividend-paying stocks?',
      answer: 'Look for companies with: (1) Consistent dividend history (10+ years), (2) Low payout ratio (under 60%), (3) Strong balance sheets, (4) Growing earnings. Dividend Aristocrats (S&P 500 companies with 25+ years of dividend increases) are a good starting point. Research companies like Coca-Cola, Johnson & Johnson, and Procter & Gamble.',
    },
    {
      question: 'Should I choose dividend stocks or growth stocks?',
      answer: 'Both have their place. Dividend stocks provide regular income and tend to be more stable, ideal for retirement income. Growth stocks offer higher capital appreciation potential but less income. Many investors use a balanced approach: dividend stocks for income and growth stocks for long-term wealth building. Your age, risk tolerance, and goals determine the right mix.',
    },
    {
      question: 'How do I know if a dividend is safe and sustainable?',
      answer: 'Check the payout ratio (dividends ÷ earnings). A ratio below 60% is generally safe. Also examine: free cash flow (should cover dividends), debt levels, and dividend coverage ratio. Companies that cut dividends often have payout ratios above 80% or declining earnings. Review the company\'s dividend history—consistent increases are a positive sign.',
    },
    {
      question: 'What is a DRIP and should I use one?',
      answer: 'DRIP (Dividend Reinvestment Plan) automatically reinvests dividends to buy more shares, often commission-free. Benefits include: compound growth, dollar-cost averaging, and convenience. Downsides: less control over purchase timing and potential tax complexity. DRIPs are excellent for long-term investors who want to build wealth automatically without active management.',
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
    {
      question: 'How much difference does starting early make?',
      answer: 'Starting early is crucial due to compound interest. Example: Investing $200/month starting at age 25 vs 35. At 7% return, by age 65: Early starter has $525,000 (invested $96,000), Late starter has $244,000 (invested $72,000). The 10-year head start more than doubles your wealth despite investing only 33% more money. Time is your greatest asset.',
    },
    {
      question: 'How do fees impact compound interest?',
      answer: 'Fees significantly erode compound returns over time. A 1% annual fee on a $100,000 investment over 30 years at 7% return costs approximately $100,000 in lost growth. Always compare expense ratios: index funds (0.03-0.15%) vs actively managed funds (0.5-1.5%). Lower fees mean more money compounds for you. Use low-cost index funds when possible.',
    },
    {
      question: 'Should I prioritize tax-advantaged accounts?',
      answer: 'Yes! Tax-advantaged accounts (401(k), IRA, Roth IRA) accelerate compound growth by deferring or eliminating taxes. In a traditional 401(k), you invest pre-tax dollars and compound without annual tax drag. In a Roth IRA, you pay taxes now but all future growth is tax-free. Max out employer matches first (free money), then contribute to IRAs. Tax savings compound over decades.',
    },
    {
      question: 'How much should I keep in emergency fund vs investing?',
      answer: 'Build an emergency fund first (3-6 months expenses) in a high-yield savings account. This prevents you from withdrawing investments during market downturns. Once your emergency fund is complete, invest everything else. Don\'t let fear of emergencies prevent investing—having the fund allows you to invest confidently and let compound interest work long-term.',
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
    {
      question: 'How does Social Security affect the 4% rule?',
      answer: 'Social Security reduces the amount you need to withdraw from investments. If you need $60,000/year and receive $24,000 in Social Security, you only need to withdraw $36,000 from investments. This means you need $900,000 saved (not $1.5M). Calculate your required savings based on the gap between expenses and guaranteed income sources.',
    },
    {
      question: 'What about healthcare costs in retirement?',
      answer: 'Healthcare is a major retirement expense not fully covered by the 4% rule. Medicare starts at 65, but you\'ll pay premiums, deductibles, and out-of-pocket costs. Estimate $300-600/month per person for healthcare. Consider Health Savings Accounts (HSAs) for tax-free medical savings. Add healthcare costs to your annual expense calculation when using the 4% rule.',
    },
    {
      question: 'What is sequence of returns risk?',
      answer: 'Sequence risk means bad market returns early in retirement can deplete your portfolio faster than expected. If the market drops 30% in your first year of retirement, withdrawing 4% becomes much riskier. The 4% rule assumes average returns, but real retirements face volatility. Consider keeping 2-3 years of expenses in cash/bonds to avoid selling during downturns.',
    },
    {
      question: 'Should I adjust the 4% rule for different market conditions?',
      answer: 'Yes, be flexible. During bull markets, you might withdraw slightly more. During bear markets, reduce withdrawals if possible. Some retirees use a "guardrails" approach: start at 4%, reduce to 3.5% if portfolio drops 20%, increase to 4.5% if portfolio grows 20%. The key is adaptability—the 4% rule is a starting point, not a rigid rule.',
    },
  ],
  latte: [
    {
      question: 'What is the "Latte Factor" concept?',
      answer: 'The Latte Factor, popularized by David Bach, refers to small daily expenses (like a $5 latte) that add up over time. This calculator shows how much wealth you could accumulate if you invested that money instead of spending it on small purchases.',
    },
    {
      question: 'Is this calculator telling me to never buy coffee?',
      answer: 'No! The calculator is about awareness, not deprivation. It helps you understand the long-term impact of spending habits. You can still enjoy coffee—just be mindful of how small expenses compound over decades.',
    },
    {
      question: 'What return rate should I use?',
      answer: 'The default 8% is based on historical stock market averages (S&P 500). Conservative investors might use 6-7%, while optimistic projections use 9-10%. Remember: past performance doesn\'t guarantee future results.',
    },
    {
      question: 'Does this account for inflation?',
      answer: 'The calculator shows nominal (not inflation-adjusted) dollars. In 30 years, $100,000 will have less purchasing power. For real purchasing power, consider using a 5-6% return (which accounts for 2-3% inflation).',
    },
    {
      question: 'What if I only spend this occasionally, not daily?',
      answer: 'Adjust the daily expense to match your actual spending. If you spend $5 on coffee 3 times per week, that\'s roughly $2.14 daily on average. The calculator works with any daily amount.',
    },
    {
      question: 'Can I use this for other expenses besides coffee?',
      answer: 'Absolutely! Use it for any recurring small expense: subscriptions, snacks, parking, convenience store purchases, etc. The concept applies to any money you spend regularly that could be invested instead.',
    },
    {
      question: 'How do I balance enjoying life with saving money?',
      answer: 'The Latte Factor isn\'t about eliminating all small pleasures—it\'s about making conscious choices. Create a budget that includes "fun money" for things you value. Cut expenses you don\'t value (like unused subscriptions) and keep ones that bring genuine joy. The goal is awareness: if you know a daily $5 expense costs $225,000 over 30 years, you can decide if it\'s worth it.',
    },
    {
      question: 'What if I have multiple small expenses?',
      answer: 'Add them up! If you spend $5 on coffee, $3 on snacks, and $2 on parking daily, that\'s $10/day total. Use the calculator with $10 to see the combined impact. Many people discover they\'re spending $200-500/month on small expenses without realizing it. Tracking all small expenses for a month can reveal surprising totals.',
    },
    {
      question: 'How can I apply this concept in real life?',
      answer: 'Start by tracking all small expenses for 30 days. Identify which ones you value and which are habits. Set up automatic investments equal to what you\'re willing to cut. For example, if you skip 3 coffees/week ($15), automatically invest $15/week ($780/year). Use apps to round up purchases and invest the difference. Small changes compound into significant wealth over time.',
    },
    {
      question: 'Does this really make a difference for my financial future?',
      answer: 'Yes! Small expenses compound into large amounts over decades. A $5 daily expense becomes $225,000 in lost wealth over 30 years at 8% return. However, don\'t stress over every dollar—focus on the big wins: housing, transportation, and food costs. The Latte Factor works best when combined with major expense optimization. Small savings accelerate your progress, but they\'re not a substitute for earning more or cutting large expenses.',
    },
  ],
  inflation: [
    {
      question: 'What is the Consumer Price Index (CPI)?',
      answer: 'The Consumer Price Index (CPI) measures the average change in prices paid by consumers for goods and services over time. It\'s the standard measure of inflation used by governments and economists. A CPI of 100 in a base year means prices have doubled if CPI reaches 200. This calculator uses historical CPI data to show purchasing power changes.',
    },
    {
      question: 'How accurate is this calculator?',
      answer: 'The calculator uses official CPI data from the US Bureau of Labor Statistics (for USD) and Eurostat estimates (for EUR). Data from 1970-2024 is based on historical records. 2025-2026 values are estimated based on recent inflation trends (approximately 3% annually). For precise calculations, consult official government sources.',
    },
    {
      question: 'Why does my money lose value over time?',
      answer: 'Inflation erodes purchasing power because prices generally rise over time. If inflation is 3% annually, something that costs $100 today will cost $103 next year. Your $100 can buy less. This is why investments that outpace inflation (like stocks) are important for long-term wealth preservation.',
    },
    {
      question: 'Can purchasing power increase?',
      answer: 'Yes! If you go backward in time (e.g., comparing 2026 to 2000), you\'ll see deflation or lower prices. However, historically, inflation is the norm. Deflation (negative inflation) is rare and usually indicates economic problems. Most of the time, money loses purchasing power over time.',
    },
    {
      question: 'How should I use this for financial planning?',
      answer: 'Use this calculator to understand why you need investments that beat inflation. If you need $1 million in today\'s dollars for retirement, you\'ll need much more in 30 years due to inflation. This helps you set realistic savings goals and understand why "safe" investments like savings accounts may not preserve purchasing power long-term.',
    },
    {
      question: 'What\'s the difference between USD and EUR inflation?',
      answer: 'Different countries and regions experience different inflation rates. The Eurozone (EUR) and United States (USD) have had similar but not identical inflation histories. EUR inflation was generally lower in the 1980s-1990s, while USD had higher inflation in the 1970s. Both currencies have experienced significant inflation since 1970.',
    },
    {
      question: 'Why does the shopping basket shrink or grow?',
      answer: 'The shopping basket visualization represents purchasing power. When going forward in time (inflation), the basket shrinks—your money buys less. When going backward in time, the basket grows—your money bought more. It\'s a visual representation of how inflation affects what you can buy with the same amount of money.',
    },
    {
      question: 'Is 3% inflation normal?',
      answer: 'Yes, 2-3% annual inflation is considered normal and healthy for developed economies. Central banks (like the Federal Reserve) target around 2% inflation. Higher inflation (5%+) erodes purchasing power faster. Very low or negative inflation (deflation) can indicate economic problems. The calculator uses 3% as a reasonable estimate for future years.',
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