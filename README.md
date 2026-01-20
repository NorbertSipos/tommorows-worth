# Tomorrow Worth

A professional, high-converting Dividend, Compound Interest, and 4% Rule Calculator built with Next.js, Tailwind CSS, and modern web technologies.

## Features

- **Three Powerful Calculators:**
  - Dividend Calculator: Calculate dividend income and growth over time
  - Compound Interest Calculator: See how investments grow with compound interest
  - 4% Rule Calculator: Plan your financial independence

- **Modern Design:**
  - Glassmorphism UI with dark theme (Zinc-950 background)
  - Bento Grid style results display
  - Fully responsive design
  - Smooth animations with Framer Motion

- **Interactive Features:**
  - Real-time calculations (no button needed)
  - Interactive sliders (Radix UI)
  - Beautiful 20-year wealth projection charts (Recharts)
  - Lucide React icons

- **SEO Optimized:**
  - Complete meta tags (Open Graph, Twitter Cards)
  - Structured data (JSON-LD) for Schema.org
  - Automatic sitemap generation
  - robots.txt configuration
  - Semantic HTML structure
  - Optimized metadata and descriptions
  - Canonical URLs
  - Web App Manifest for PWA support

- **Monetization Ready:**
  - Google AdSense placeholder slots
  - Edge runtime support for Cloudflare Pages

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Radix UI
- Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
```

## Deployment

This application is optimized for Cloudflare Pages. Simply connect your repository to Cloudflare Pages and deploy.

## SEO Configuration

1. **Set Environment Variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
   ```

2. **Update Metadata:**
   - Edit `app/layout.tsx` to customize your site metadata
   - Update structured data (JSON-LD) schemas
   - Add your Open Graph image at `/public/og-image.jpg` (1200x630px)

3. **Robots & Sitemap:**
   - `app/robots.ts` - Automatically generates robots.txt
   - `app/sitemap.ts` - Automatically generates sitemap.xml
   - Both are automatically served at `/robots.txt` and `/sitemap.xml`

4. **Structured Data:**
   - WebApplication schema in layout
   - WebSite schema for search
   - Calculator-specific schemas
   - ItemList for calculator collection

## Google AdSense Integration

Replace the placeholder components in `components/AdSensePlaceholder.tsx` with your actual AdSense code:

```tsx
<ins className="adsbygoogle"
  style={{display: 'block'}}
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot={slotId}
  data-ad-format="auto"
  data-full-width-responsive="true"></ins>
```

## SEO Best Practices Implemented

✅ **Meta Tags:** Complete Open Graph and Twitter Card metadata  
✅ **Structured Data:** JSON-LD schemas for rich snippets  
✅ **Sitemap:** Automatic XML sitemap generation  
✅ **Robots.txt:** Proper crawling directives  
✅ **Semantic HTML:** Proper heading hierarchy and ARIA labels  
✅ **Canonical URLs:** Prevents duplicate content issues  
✅ **Mobile Optimized:** Responsive design with proper viewport  
✅ **Performance:** Edge runtime for fast loading  
✅ **Accessibility:** ARIA labels and semantic elements

## Advanced SEO Features (2026 Ready)

### 1. Dynamic Title Tags
- Page titles update based on calculations in real-time
- Example: "Earn $3,500/year ($292/month) in Dividends | Tomorrow Worth"
- Encourages users to keep tabs open longer (dwell time signal)

### 2. Interaction Tracking & Analytics
- Tracks slider movements, calculations, chart views, and FAQ interactions
- Monitors dwell time automatically
- Integrated with Google Analytics (optional)
- All tracking is privacy-friendly and GDPR compliant

### 3. Financial API Integration
- Supports Alpha Vantage API for real-time stock data
- Falls back to comprehensive static database (40+ stocks)
- Includes popular dividend stocks, REITs, ETFs, and blue-chip companies
- Easy to extend with additional stocks or API providers

### 4. Programmatic SEO
- Dynamic stock pages: `/calculator/apple`, `/calculator/microsoft`, etc.
- Each page includes:
  - Stock-specific metadata and structured data
  - Pre-filled calculator with actual stock dividend yield
  - Unique content and FAQs
  - Automatic sitemap inclusion

### 5. EEAT Content (YMYL Compliance)
- Comprehensive "How It Works" sections with formulas and citations
- Professional About page with methodology transparency
- Clear disclaimers on all pages
- Citations to authoritative sources (Investopedia, SEC, Trinity Study)

### 6. AI-Ready Content (AEO)
- FAQ sections with data-rich, structured answers
- Key takeaways formatted for AI tool citations
- Clear, concise explanations optimized for AI search engines

## Setup & Configuration

### 1. Environment Variables

Create a `.env.local` file:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Google Services (Recommended)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Financial API (Optional)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your-api-key
```

### 2. Google Analytics Setup

1. Create a Google Analytics 4 property
2. Copy your Measurement ID (G-XXXXXXXXXX)
3. Add it to `.env.local` as `NEXT_PUBLIC_GA_ID`
4. Analytics will automatically track:
   - Slider interactions
   - Calculations performed
   - Chart views
   - FAQ opens
   - Dwell time

### 3. Alpha Vantage API (Optional)

1. Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add to `.env.local` as `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY`
4. The app will fetch real-time dividend data
5. Falls back to static data if API is unavailable

### 4. Adding More Stocks

Edit `lib/financialAPI.ts` and add stocks to the `STOCK_DATABASE`:

```typescript
'your-stock-slug': {
  name: 'Company Name',
  ticker: 'TICKER',
  dividendYield: 3.5,  // Percentage
  annualDividend: 2.50, // Per share
}
```

The stock will automatically:
- Appear in the sitemap
- Generate a dynamic page at `/calculator/your-stock-slug`
- Include proper metadata and structured data

## Stock Database

The app includes 40+ popular dividend stocks:
- **Tech:** Apple, Microsoft
- **REITs:** Realty Income (O), STAG, W.P. Carey
- **ETFs:** SCHD, VYM, SPYD, DGRO
- **Dividend Aristocrats:** JNJ, PG, KO, PEP
- **Energy:** XOM, CVX
- **Finance:** JPM, BAC, WFC
- And many more...

## Analytics Events

The app tracks these events for SEO signals:

- `slider_move` - Every time a user moves a slider
- `calculation` - When calculations complete
- `chart_view` - When users view the wealth projection chart
- `faq_open` - FAQ question interactions
- `page_view` - Page visits
- `dwell_time` - Time spent on page (tracked every 30s)

## Programmatic SEO Pages

Access stock-specific calculators:
- `/calculator/apple`
- `/calculator/microsoft`
- `/calculator/schd`
- `/calculator/realty-income`
- And 35+ more...

Each page is fully optimized with:
- Unique metadata
- Stock-specific structured data
- Pre-filled calculator values
- Relevant content and FAQs

## License

MIT