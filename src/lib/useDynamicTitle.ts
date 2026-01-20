import { useEffect } from 'react'

interface UseDynamicTitleOptions {
  calculatorType: 'dividend' | 'compound' | '4percent'
  values?: {
    investmentAmount?: number
    annualYield?: number
    dividendGrowth?: number
    annualDividend?: number
    finalValue?: number
    targetAmount?: number
    yearsToFI?: number
  }
}

export function useDynamicTitle({ calculatorType, values }: UseDynamicTitleOptions) {
  useEffect(() => {
    const baseTitle = 'Tomorrow Worth'
    
    if (!values) {
      document.title = baseTitle
      return
    }

    let dynamicTitle = baseTitle

    switch (calculatorType) {
      case 'dividend':
        if (values.annualDividend && values.investmentAmount) {
          const monthlyDiv = values.annualDividend / 12
          dynamicTitle = `Earn $${formatNumber(values.annualDividend)}/year ($${formatNumber(monthlyDiv)}/month) in Dividends | ${baseTitle}`
        } else if (values.investmentAmount) {
          dynamicTitle = `$${formatNumber(values.investmentAmount)} Dividend Calculator | ${baseTitle}`
        }
        break

      case 'compound':
        if (values.finalValue && values.investmentAmount) {
          const growth = ((values.finalValue - values.investmentAmount) / values.investmentAmount * 100).toFixed(0)
          dynamicTitle = `$${formatNumber(values.finalValue)} (${growth}% growth) | ${baseTitle}`
        } else if (values.investmentAmount) {
          dynamicTitle = `$${formatNumber(values.investmentAmount)} Compound Interest Calculator | ${baseTitle}`
        }
        break

      case '4percent':
        if (values.targetAmount) {
          dynamicTitle = `Need $${formatNumber(values.targetAmount)} for Financial Independence | ${baseTitle}`
        } else if (values.yearsToFI !== undefined && values.yearsToFI < 50) {
          dynamicTitle = `${values.yearsToFI.toFixed(0)} Years to Financial Independence | ${baseTitle}`
        }
        break
    }

    document.title = dynamicTitle
  }, [calculatorType, values])
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toFixed(0)
}