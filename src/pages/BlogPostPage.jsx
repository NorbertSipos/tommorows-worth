import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, BookOpen, Lightbulb, FileText } from 'lucide-react'
import { useState, useEffect, lazy, Suspense } from 'react'
import { blogPosts, blogContent } from '@/data/blogPosts'
import { updateMetaTags } from '@/lib/seo'

// Lazy load AdSensePlaceholder
const AdSensePlaceholder = lazy(() => import('@/components/AdSensePlaceholder'))

const getCategoryIcon = (category) => {
  switch (category) {
    case 'guide':
      return <BookOpen className="w-5 h-5" />
    case 'data-study':
      return <Lightbulb className="w-5 h-5" />
    case 'glossary':
      return <FileText className="w-5 h-5" />
    default:
      return <FileText className="w-5 h-5" />
  }
}

const getCategoryLabel = (category) => {
  switch (category) {
    case 'guide':
      return 'Guide'
    case 'data-study':
      return 'Data Study'
    case 'glossary':
      return 'Glossary'
    default:
      return 'Article'
  }
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    // Find post metadata
    const postMeta = blogPosts.find(p => p.slug === slug)
    if (postMeta) {
      // Use content from blogContent if available, otherwise use description as placeholder
      const content = blogContent[slug] || `# ${postMeta.title}\n\n${postMeta.description}\n\n*Full article content coming soon...*`
      setPost({ ...postMeta, content: content })
      
      // Update SEO meta tags
      // Normalize URL to always include protocol
      const normalizeUrl = (url) => {
        if (!url) return 'https://tomorrowworth.com'
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        return `https://${url.replace(/^https?:\/\//, '')}`
      }
      const baseUrl = normalizeUrl(import.meta.env.VITE_SITE_URL || 'https://tomorrowworth.com')
      updateMetaTags({
        title: `${postMeta.title} | Tomorrow Worth`,
        description: postMeta.description,
        keywords: `investment blog, ${postMeta.category}, financial planning, ${postMeta.title.toLowerCase()}`,
        url: `${baseUrl}/blog/${slug}`,
        type: 'article',
        canonical: `${baseUrl}/blog/${slug}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: postMeta.title,
          description: postMeta.description,
          image: `${baseUrl}/og-image.jpg`,
          datePublished: postMeta.date,
          dateModified: postMeta.date,
          author: {
            '@type': 'Organization',
            name: 'Tomorrow Worth',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Tomorrow Worth',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/icon.svg`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/blog/${slug}`,
          },
        },
      })
    } else {
      setPost(null)
    }
  }, [slug])

  // Show loading only briefly while useEffect runs
  if (post === null) {
    const postExists = blogPosts.find(p => p.slug === slug)
    if (!postExists) {
      return <Navigate to="/blog" replace />
    }
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Markdown-like rendering
  const renderContent = (content) => {
    const lines = content.split('\n')
    const elements = []
    let currentParagraph = []
    let inCodeBlock = false
    let codeContent = []
    let listItems = []
    let inList = false
    let adCount = 0
    let headingCount = 0

    lines.forEach((line, index) => {
      const trimmed = line.trim()

      if (trimmed === '[ADSENSE_INLINE]') {
        adCount++
        elements.push(
          <div key={`ad-${adCount}`} className="my-8">
            <Suspense fallback={<div className="card-input p-4 h-24 md:h-32" />}>
              <AdSensePlaceholder 
                position="sidebar" 
                slotId={`article-inline-${adCount}`}
                className="w-full"
              />
            </Suspense>
          </div>
        )
        return
      }

      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="bg-slate-900 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm text-slate-300">{codeContent.join('\n')}</code>
            </pre>
          )
          codeContent = []
          inCodeBlock = false
        } else {
          if (currentParagraph.length > 0) {
            elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
            currentParagraph = []
          }
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      if (trimmed.startsWith('# ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        headingCount++
        elements.push(<h2 key={`h2-${index}`} className="text-3xl font-bold text-white mt-8 mb-4">{trimmed.slice(2)}</h2>)
        
        if (headingCount % 2 === 0 && headingCount > 0) {
          adCount++
          elements.push(
            <div key={`ad-heading-${adCount}`} className="my-6">
              <Suspense fallback={<div className="card-input p-4 h-24 md:h-32" />}>
                <AdSensePlaceholder 
                  position="sidebar" 
                  slotId={`article-heading-${adCount}`}
                  className="w-full"
                />
              </Suspense>
            </div>
          )
        }
        return
      }

      if (trimmed.startsWith('## ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        headingCount++
        elements.push(<h3 key={`h3-${index}`} className="text-2xl font-bold text-white mt-6 mb-3">{trimmed.slice(3)}</h3>)
        return
      }

      if (trimmed.startsWith('### ')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        elements.push(<h4 key={`h4-${index}`} className="text-xl font-bold text-white mt-4 mb-2">{trimmed.slice(4)}</h4>)
        return
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList && currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        listItems.push(trimmed.slice(2))
        inList = true
        return
      }

      if (inList && trimmed === '') {
        elements.push(
          <ul key={`ul-${index}`} className="list-disc list-inside text-slate-300 mb-4 space-y-2 ml-4">
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        listItems = []
        inList = false
        return
      }

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        elements.push(<p key={`p-bold-${index}`} className="text-slate-300 mb-4 font-semibold">{trimmed.slice(2, -2)}</p>)
        return
      }

      if (trimmed === '') {
        if (currentParagraph.length > 0) {
          elements.push(<p key={`p-${index}`} className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
          currentParagraph = []
        }
        return
      }

      currentParagraph.push(trimmed)
    })

    if (currentParagraph.length > 0) {
      elements.push(<p key="p-final" className="text-slate-300 mb-4">{currentParagraph.join(' ')}</p>)
    }
    if (listItems.length > 0) {
      elements.push(
        <ul key="ul-final" className="list-disc list-inside text-slate-300 mb-4 space-y-2 ml-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    }

    return elements
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800/50 bg-gradient-to-br from-violet-950/20 via-purple-950/20 to-fuchsia-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              {getCategoryIcon(post.category)}
            </div>
            <span className="text-sm font-semibold text-violet-400 uppercase">
              {getCategoryLabel(post.category)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} read
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card-modern p-4 sm:p-6 lg:p-8 prose prose-invert max-w-none">
          {renderContent(post.content)}
        </div>
      </article>
    </div>
  )
}