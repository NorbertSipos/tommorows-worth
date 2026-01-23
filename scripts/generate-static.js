import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { blogPosts } from '../src/data/blogPosts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const distDir = join(__dirname, '..', 'dist')

// Generate robots.txt with SEO best practices
// Normalize URL to always include protocol
function normalizeUrl(url) {
  if (!url) return 'https://tomorrowworth.com'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url.replace(/^https?:\/\//, '')}`
}

const baseUrl = normalizeUrl(process.env.VITE_SITE_URL || 'https://tomorrowworth.com')
const robotsContent = `# robots.txt for ${baseUrl}
# Generated automatically - Do not edit manually

# Allow all bots to crawl the site
User-agent: *
Allow: /

# Allow access to static assets (images, CSS, JS)
Allow: /icon.svg
Allow: /manifest.json
Allow: /_redirects
Allow: /*.css$
Allow: /*.js$
Allow: /*.svg$
Allow: /*.jpg$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.woff$
Allow: /*.woff2$

# Disallow private/admin areas (if any exist in the future)
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /.git/
Disallow: /node_modules/

# Disallow duplicate parameters or query strings if needed
# Disallow: /*?*utm_*
# Disallow: /*?*ref=*

# Specific rules for Google
User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 0

# Specific rules for Google Image Bot
User-agent: Googlebot-Image
Allow: /
Allow: /*.jpg$
Allow: /*.png$
Allow: /*.svg$
Allow: /*.webp$
Disallow: /api/

# Specific rules for Bing
User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Crawl-delay: 0

# Block bad bots (optional - uncomment if you want to block them)
# User-agent: AhrefsBot
# Disallow: /
# User-agent: SemrushBot
# Disallow: /
# User-agent: MJ12bot
# Disallow: /

# Sitemap location (important for SEO)
Sitemap: ${baseUrl}/sitemap.xml

# Host directive (helps with canonical URLs)
Host: ${baseUrl.replace('https://', '').replace('http://', '')}
`

writeFileSync(join(distDir, 'robots.txt'), robotsContent)

// Generate sitemap.xml
// Extract stock slugs from the STOCK_DATABASE keys
// We'll read them from the TypeScript file directly
let stockSymbols = []
try {
  const financialAPIPath = join(__dirname, '..', 'src', 'lib', 'financialAPI.ts')
  const fileContent = readFileSync(financialAPIPath, 'utf-8')
  
  // Extract stock slugs from STOCK_DATABASE object keys using regex
  const stockKeyRegex = /['"`]([^'"`]+)['"`]:\s*\{/g
  const matches = [...fileContent.matchAll(stockKeyRegex)]
  stockSymbols = matches.map(match => match[1]).filter(slug => slug && slug !== 'apple') // Filter out if needed
} catch (error) {
  console.error('Error loading stocks for sitemap:', error)
  // Fallback to common stocks if file read fails
  stockSymbols = [
    'apple', 'microsoft', 'realty-income', 'schd', 'jnj', 'pg', 'ko', 'pepsico',
    'at&t', 'verizon', 'main', 'wpc', 'stag', 'xom', 'cvx', 'jpm', 'bac', 'wfc'
  ]
}

// Function to escape XML entities in URLs
function escapeXmlEntities(url) {
  return url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Function to ensure proper URL formatting (no double slashes)
function formatUrl(base, path) {
  const cleanBase = base.replace(/\/+$/, '') // Remove trailing slashes
  const cleanPath = path.replace(/^\/+/, '/') // Ensure single leading slash
  return `${cleanBase}${cleanPath}`
}

const staticPages = [
  { url: baseUrl, priority: 1.0, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/about'), priority: 0.8, changeFreq: 'monthly' },
  { url: formatUrl(baseUrl, '/blog'), priority: 0.9, changeFreq: 'weekly' },
  // SEO-friendly calculator subpages
  { url: formatUrl(baseUrl, '/dividend-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/compound-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/compound-interest-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/4percent-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/4-percent-rule-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/latte-factor-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/inflation-calculator'), priority: 0.9, changeFreq: 'weekly' },
  { url: formatUrl(baseUrl, '/inflation-time-machine'), priority: 0.9, changeFreq: 'weekly' },
]

const stockPages = stockSymbols.map((symbol) => ({
  url: formatUrl(baseUrl, `/calculator/${symbol}`),
  priority: 0.9,
  changeFreq: 'weekly',
}))

const blogSlugs = blogPosts.map(post => post.slug)

const blogPages = blogSlugs.map((slug) => ({
  url: formatUrl(baseUrl, `/blog/${slug}`),
  priority: 0.8,
  changeFreq: 'monthly',
}))

const allPages = [...staticPages, ...stockPages, ...blogPages]
const now = new Date().toISOString()

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${escapeXmlEntities(page.url)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

writeFileSync(join(distDir, 'sitemap.xml'), sitemapContent)

console.log('✅ Generated robots.txt and sitemap.xml')