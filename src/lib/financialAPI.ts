// Financial API integration
// Supports multiple providers with fallback to static data

export interface StockData {
  name: string
  ticker: string
  dividendYield: number
  annualDividend: number
  price?: number
  lastUpdated?: string
}

// Extended stock database with popular dividend stocks
const STOCK_DATABASE: Record<string, StockData> = {
  'apple': { name: 'Apple Inc.', ticker: 'AAPL', dividendYield: 0.52, annualDividend: 1.00 },
  'microsoft': { name: 'Microsoft Corporation', ticker: 'MSFT', dividendYield: 0.70, annualDividend: 3.00 },
  'realty-income': { name: 'Realty Income Corporation', ticker: 'O', dividendYield: 5.8, annualDividend: 3.06 },
  'schd': { name: 'Schwab U.S. Dividend Equity ETF', ticker: 'SCHD', dividendYield: 3.5, annualDividend: 2.64 },
  'jnj': { name: 'Johnson & Johnson', ticker: 'JNJ', dividendYield: 3.1, annualDividend: 4.76 },
  'pg': { name: 'Procter & Gamble', ticker: 'PG', dividendYield: 2.4, annualDividend: 3.76 },
  'ko': { name: 'The Coca-Cola Company', ticker: 'KO', dividendYield: 3.3, annualDividend: 1.84 },
  'pepsico': { name: 'PepsiCo Inc.', ticker: 'PEP', dividendYield: 2.9, annualDividend: 5.06 },
  'at&t': { name: 'AT&T Inc.', ticker: 'T', dividendYield: 6.8, annualDividend: 1.11 },
  'verizon': { name: 'Verizon Communications Inc.', ticker: 'VZ', dividendYield: 6.5, annualDividend: 2.66 },
  'main': { name: 'Main Street Capital Corporation', ticker: 'MAIN', dividendYield: 7.2, annualDividend: 2.64 },
  'wpc': { name: 'W.P. Carey Inc.', ticker: 'WPC', dividendYield: 5.6, annualDividend: 4.24 },
  'stag': { name: 'STAG Industrial Inc.', ticker: 'STAG', dividendYield: 4.8, annualDividend: 1.54 },
  'abr': { name: 'Arbor Realty Trust Inc.', ticker: 'ABR', dividendYield: 13.5, annualDividend: 1.92 },
  'mo': { name: 'Altria Group Inc.', ticker: 'MO', dividendYield: 8.9, annualDividend: 3.92 },
  'pm': { name: 'Philip Morris International Inc.', ticker: 'PM', dividendYield: 5.4, annualDividend: 5.08 },
  'xom': { name: 'Exxon Mobil Corporation', ticker: 'XOM', dividendYield: 3.8, annualDividend: 3.80 },
  'cvx': { name: 'Chevron Corporation', ticker: 'CVX', dividendYield: 4.1, annualDividend: 6.04 },
  'jpm': { name: 'JPMorgan Chase & Co.', ticker: 'JPM', dividendYield: 2.3, annualDividend: 4.20 },
  'bac': { name: 'Bank of America Corp.', ticker: 'BAC', dividendYield: 2.8, annualDividend: 0.96 },
  'wfc': { name: 'Wells Fargo & Company', ticker: 'WFC', dividendYield: 2.6, annualDividend: 1.40 },
  'hdz': { name: 'Home Depot Inc.', ticker: 'HD', dividendYield: 2.5, annualDividend: 8.36 },
  'lowe': { name: "Lowe's Companies Inc.", ticker: 'LOW', dividendYield: 2.0, annualDividend: 4.20 },
  'mcd': { name: "McDonald's Corporation", ticker: 'MCD', dividendYield: 2.3, annualDividend: 6.68 },
  'sbux': { name: 'Starbucks Corporation', ticker: 'SBUX', dividendYield: 2.4, annualDividend: 2.28 },
  'voo': { name: 'Vanguard S&P 500 ETF', ticker: 'VOO', dividendYield: 1.5, annualDividend: 6.24 },
  'spy': { name: 'SPDR S&P 500 ETF Trust', ticker: 'SPY', dividendYield: 1.5, annualDividend: 6.24 },
  'qqq': { name: 'Invesco QQQ Trust', ticker: 'QQQ', dividendYield: 0.6, annualDividend: 2.11 },
  'dgro': { name: 'iShares Core Dividend Growth ETF', ticker: 'DGRO', dividendYield: 2.5, annualDividend: 1.34 },
  'vym': { name: 'Vanguard High Dividend Yield ETF', ticker: 'VYM', dividendYield: 3.1, annualDividend: 3.32 },
  'spyd': { name: 'SPDR Portfolio S&P 500 High Dividend ETF', ticker: 'SPYD', dividendYield: 4.8, annualDividend: 1.86 },
  'o': { name: 'Realty Income Corporation', ticker: 'O', dividendYield: 5.8, annualDividend: 3.06 },
  'abbv': { name: 'AbbVie Inc.', ticker: 'ABBV', dividendYield: 3.8, annualDividend: 6.04 },
  'lmt': { name: 'Lockheed Martin Corporation', ticker: 'LMT', dividendYield: 2.8, annualDividend: 12.60 },
  'rtx': { name: 'RTX Corporation', ticker: 'RTX', dividendYield: 2.9, annualDividend: 2.36 },
  'mmp': { name: 'Magellan Midstream Partners L.P.', ticker: 'MMP', dividendYield: 6.5, annualDividend: 4.39 },
  'psx': { name: 'Phillips 66', ticker: 'PSX', dividendYield: 3.1, annualDividend: 4.20 },
}

/**
 * Fetch stock data from API or return cached/static data
 * Supports Alpha Vantage API with fallback to static database
 */
export async function fetchStockData(symbol: string): Promise<StockData | null> {
  const normalizedSymbol = symbol.toLowerCase().replace(/\s+/g, '-')
  
  // Check static database first
  if (STOCK_DATABASE[normalizedSymbol]) {
    return STOCK_DATABASE[normalizedSymbol]
  }

  // Try API if available
  const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
  if (apiKey) {
    try {
      const data = await fetchFromAlphaVantage(symbol, apiKey)
      if (data) return data
    } catch (error) {
      console.error('API fetch failed, using static data:', error)
    }
  }

  // Fallback to static data lookup by ticker
  const stockByTicker = Object.values(STOCK_DATABASE).find(
    s => s.ticker.toLowerCase() === symbol.toUpperCase()
  )
  
  return stockByTicker || null
}

/**
 * Fetch stock data from Alpha Vantage API
 */
async function fetchFromAlphaVantage(symbol: string, apiKey: string): Promise<StockData | null> {
  try {
    // Fetch overview (company info and dividend data)
    const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`
    const overviewResponse = await fetch(overviewUrl, { next: { revalidate: 3600 } })
    const overviewData = await overviewResponse.json()

    if (overviewData['Error Message'] || overviewData['Note']) {
      return null
    }

    const dividendYield = parseFloat(overviewData['DividendYield'] || '0')
    const dividendPerShare = parseFloat(overviewData['DividendPerShare'] || '0')
    const companyName = overviewData['Name'] || symbol

    if (dividendYield === 0 && dividendPerShare === 0) {
      return null // Stock doesn't pay dividends
    }

    return {
      name: companyName,
      ticker: symbol.toUpperCase(),
      dividendYield: dividendYield * 100, // Convert to percentage
      annualDividend: dividendPerShare,
      price: parseFloat(overviewData['52WeekHigh'] || '0'),
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Alpha Vantage API error:', error)
    return null
  }
}

/**
 * Get all available stocks for programmatic SEO
 */
export function getAllStocks(): StockData[] {
  return Object.values(STOCK_DATABASE)
}

/**
 * Get stock by slug (URL-friendly identifier)
 */
export function getStockBySlug(slug: string): StockData | null {
  return STOCK_DATABASE[slug.toLowerCase()] || null
}