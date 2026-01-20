import { Link } from 'react-router-dom'
import { BookOpen, Calendar, FileText, Lightbulb, Home, ArrowLeft } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { usePageSEO } from '@/hooks/useSEO'

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

export default function BlogPage() {
  // Set up SEO meta tags
  usePageSEO('blog')
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800/50 bg-gradient-to-br from-violet-950/20 via-purple-950/20 to-fuchsia-950/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Back to Calculators Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 group text-sm sm:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
              <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back to Calculators</span>
            </Link>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
              Tomorrow Worth Blog
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300">
              Deep guides, data studies, and glossary entries to help you master dividend investing, 
              compound interest, and financial independence.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-violet-400" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="card-modern p-4 sm:p-6 hover:border-violet-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
                      {getCategoryIcon(post.category)}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <span>{post.readTime} read</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
            All Articles
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {regularPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                  className="card-modern p-4 sm:p-6 hover:border-violet-500/50 transition-all duration-300 group block"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex-shrink-0">
                    {getCategoryIcon(post.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-violet-400 uppercase">
                        {getCategoryLabel(post.category)}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">{post.readTime} read</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}