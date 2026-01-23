import { motion } from 'framer-motion'
import { BookOpen, ExternalLink } from 'lucide-react'

interface HowItWorksProps {
  calculatorType: 'dividend' | 'compound' | '4percent' | 'latte' | 'inflation'
}

export default function HowItWorks({ calculatorType }: HowItWorksProps) {
  const content = {
    dividend: {
      title: 'How the Dividend Calculator Works',
      content: `
        <p class="mb-4">
          The dividend calculator uses compound growth mathematics to project your dividend income over time. Here's the formula:
        </p>
        <div class="bg-slate-800/50 p-4 rounded-lg mb-4 font-mono text-sm">
          Annual Dividend = Investment Amount × Annual Yield %<br/>
          Future Dividend = Current Dividend × (1 + Growth Rate)<sup>years</sup>
        </div>
        <p class="mb-4">
          <strong>Example:</strong> If you invest $100,000 at a 3.5% yield, you'll earn $3,500 in the first year. 
          If dividends grow at 5% annually, in 10 years you'll earn $5,701 annually, and in 20 years: $9,291.
        </p>
        <p class="mb-4">
          This calculator assumes dividends are reinvested, compounding your returns. The math is based on the 
          <a href="https://www.investopedia.com/terms/d/dividendyield.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            standard dividend yield formula
          </a> and compound growth principles used throughout finance.
        </p>
        <p>
          <strong>Key Sources:</strong>
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><a href="https://www.investopedia.com/terms/d/dividendyield.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Dividend Yield Definition
          </a></li>
          <li><a href="https://www.sec.gov/investor/pubs/begfinstmtguide.htm" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            SEC: Understanding Dividends
          </a></li>
        </ul>
      `,
    },
    compound: {
      title: 'How the Compound Interest Calculator Works',
      content: `
        <p class="mb-4">
          Compound interest is the "eighth wonder of the world" according to Albert Einstein. Our calculator uses the 
          standard compound interest formula with monthly compounding:
        </p>
        <div class="bg-slate-800/50 p-4 rounded-lg mb-4 font-mono text-sm">
          Future Value = Principal × (1 + Rate/12)<sup>months</sup> + Monthly Contributions × [((1 + Rate/12)<sup>months</sup> - 1) / (Rate/12)]
        </div>
        <p class="mb-4">
          <strong>Example:</strong> Invest $10,000 initially, add $500 monthly at 7% annual return. 
          After 20 years, you'll have approximately $299,000 from just $130,000 in contributions. 
          That's $169,000 in compound interest alone!
        </p>
        <p class="mb-4">
          The calculator compounds interest monthly and adds your contributions at the end of each month, 
          which is how most investment accounts work in practice.
        </p>
        <p>
          <strong>Key Sources:</strong>
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><a href="https://www.investopedia.com/terms/c/compoundinterest.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Compound Interest Explained
          </a></li>
          <li><a href="https://www.federalreserve.gov/newsevents/speech/bernanke20130301a.htm" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Federal Reserve: Understanding Interest Rates
          </a></li>
        </ul>
      `,
    },
    '4percent': {
      title: 'How the 4% Rule Calculator Works',
      content: `
        <p class="mb-4">
          The 4% Rule comes from the <strong>Trinity Study</strong>, published in 1998 by three finance professors. 
          The study analyzed historical market data and found that withdrawing 4% of your portfolio annually 
          (adjusted for inflation) would have sustained a 30-year retirement 95% of the time.
        </p>
        <div class="bg-slate-800/50 p-4 rounded-lg mb-4 font-mono text-sm">
          Target Amount = Annual Expenses × 25<br/>
          Safe Withdrawal = Target Amount × 4%<br/>
          4% = 1 ÷ 25 (inverse relationship)
        </div>
        <p class="mb-4">
          <strong>Example:</strong> If you need $60,000 annually ($5,000/month), you need $1.5 million saved. 
          At 4% withdrawal, that's $60,000 per year, which should last 30+ years based on historical data.
        </p>
        <p class="mb-4">
          The calculator helps you determine:
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li>How much you need to save (25× annual expenses)</li>
          <li>How long it will take to reach that goal</li>
          <li>How much you need to save monthly to get there</li>
        </ul>
        <p class="mb-4">
          <strong>Important:</strong> The 4% rule assumes a diversified portfolio (60% stocks, 40% bonds), 
          30-year retirement, and historical market returns. Your situation may vary.
        </p>
        <p>
          <strong>Key Sources:</strong>
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><a href="https://www.aaii.com/files/pdf/6794_retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable.pdf" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Trinity Study (1998): Sustainable Withdrawal Rates
          </a></li>
          <li><a href="https://www.investopedia.com/terms/f/four-percent-rule.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: 4% Rule Explained
          </a></li>
          <li><a href="https://www.bogleheads.org/wiki/Safe_withdrawal_rates" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Bogleheads: Safe Withdrawal Rates
          </a></li>
        </ul>
      `,
    },
    latte: {
      title: 'How the Latte Factor Calculator Works',
      content: `
        <p class="mb-4">
          The "Latte Factor" concept, popularized by financial author David Bach, demonstrates how small daily expenses 
          can compound into significant lost wealth over time. This calculator shows the opportunity cost of spending 
          money on small purchases instead of investing it.
        </p>
        <div class="bg-slate-800/50 p-4 rounded-lg mb-4 font-mono text-sm">
          Monthly Expense = Daily Expense × 30.4375<br/>
          Future Value = Monthly × [((1 + r)^n - 1) / r]<br/>
          Where r = monthly interest rate, n = total months
        </div>
        <p class="mb-4">
          <strong>Example:</strong> Spending $5 daily on coffee ($150/month) for 30 years at 8% annual return 
          means you've spent $54,000, but lost $225,000 in potential wealth. That's $171,000 in opportunity cost!
        </p>
        <p class="mb-4">
          The calculator uses the <strong>future value of an annuity formula</strong>, which calculates how much 
          a series of regular payments would be worth if invested at a given interest rate over time. This is the 
          standard formula used in finance for calculating retirement savings, loan payments, and investment growth.
        </p>
        <p class="mb-4">
          <strong>Key Insight:</strong> The difference between "Total Spent" and "Potential Wealth" shows the true 
          cost of small expenses. This isn't about never buying coffee—it's about understanding the long-term 
          impact of spending habits and making informed choices.
        </p>
        <p>
          <strong>Key Sources:</strong>
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><a href="https://www.investopedia.com/terms/a/annuity.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Annuity Formula Explained
          </a></li>
          <li><a href="https://www.investopedia.com/terms/o/opportunitycost.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Opportunity Cost Definition
          </a></li>
          <li><a href="https://www.finra.org/investors/learn-to-invest/types-of-investments" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            FINRA: Understanding Investment Returns
          </a></li>
        </ul>
      `,
    },
    inflation: {
      title: 'How the Inflation Time Machine Works',
      content: `
        <p class="mb-4">
          The Inflation Time Machine uses the Consumer Price Index (CPI) to calculate how purchasing power changes over time. 
          CPI measures the average change in prices for goods and services, which is the standard measure of inflation.
        </p>
        <div class="bg-slate-800/50 p-4 rounded-lg mb-4 font-mono text-sm">
          Equivalent Value = Original Amount × (CPI_Target_Year / CPI_Starting_Year)<br/>
          Percentage Change = ((Equivalent Value - Original Amount) / Original Amount) × 100
        </div>
        <p class="mb-4">
          <strong>Example:</strong> $1,000 in 2000 (CPI: 172.2) is equivalent to $1,933 in 2026 (CPI: 332.9). 
          That's a 93.3% increase, meaning you need almost double the money to buy the same goods today.
        </p>
        <p class="mb-4">
          The calculator uses official CPI data from the US Bureau of Labor Statistics (for USD) and Eurostat estimates (for EUR). 
          Historical data spans from 1970 to 2024, with 2025-2026 estimated based on recent inflation trends (approximately 3% annually).
        </p>
        <p class="mb-4">
          <strong>Key Insight:</strong> The shopping basket visualization shows how inflation affects purchasing power. 
          When going forward in time, the basket shrinks—your money buys less. This is why investments that outpace 
          inflation are crucial for long-term wealth preservation.
        </p>
        <p>
          <strong>Key Sources:</strong>
        </p>
        <ul class="list-disc list-inside space-y-2 mb-4 ml-4">
          <li><a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            US Bureau of Labor Statistics: Consumer Price Index
          </a></li>
          <li><a href="https://www.investopedia.com/terms/c/consumerpriceindex.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Consumer Price Index (CPI) Explained
          </a></li>
          <li><a href="https://www.investopedia.com/terms/i/inflation.asp" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">
            Investopedia: Inflation Definition and Impact
          </a></li>
        </ul>
      `,
    },
  }

  const selected = content[calculatorType] || content.dividend

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card-modern p-4 sm:p-6 lg:p-8 mt-6 sm:mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <BookOpen className="w-5 h-5 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
      </div>
      <div 
        className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: selected.content }}
      />
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-sm text-amber-200">
          <strong>Disclaimer:</strong> These calculators are for educational purposes only and do not constitute financial advice. 
          Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </motion.section>
  )
}