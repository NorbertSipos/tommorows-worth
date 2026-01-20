import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, BookOpen, Users, Target, Home, ArrowLeft } from 'lucide-react'
import { usePageSEO } from '@/hooks/useSEO'

export default function AboutPage() {
  // Set up SEO meta tags
  usePageSEO('about')

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-purple-950/20 to-fuchsia-950/20 animate-gradient"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-900/70 hover:border-slate-600/70 transition-all duration-300 group text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
            <span className="text-slate-300 group-hover:text-white font-medium transition-colors">Back to Calculators</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 gradient-text">About Tomorrow Worth</h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Our mission is to make financial planning accessible, transparent, and accurate
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-modern p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              We believe that financial planning shouldn't be complicated or expensive. Our free investment 
              calculators are designed to help you make informed decisions about your financial future.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every calculator uses industry-standard formulas and methodologies backed by academic research 
              and financial regulatory bodies. We cite our sources and explain our methodology so you can 
              trust the results.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-modern p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Accuracy & Transparency</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              All our calculators are built with precision and transparency:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
              <li><strong>Dividend Calculator:</strong> Uses standard dividend yield formula cited from Investopedia and SEC guidelines</li>
              <li><strong>Compound Interest:</strong> Implements monthly compounding with contributions, following standard financial mathematics</li>
              <li><strong>4% Rule:</strong> Based on the Trinity Study (1998) and subsequent research by financial academics</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-modern p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white">Our Methodology</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              We're passionate about finance and have built these tools with careful attention to detail. 
              Our calculators undergo regular review to ensure they match current financial best practices.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Each calculator includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4 mt-2">
              <li>Clear explanation of the underlying formulas</li>
              <li>Citations to authoritative sources</li>
              <li>Real-world examples to help you understand the results</li>
              <li>Transparent assumptions and limitations</li>
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-modern p-8 bg-red-500/10 border-red-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Important Disclaimers</h2>
            </div>
            <div className="text-slate-300 leading-relaxed space-y-3">
              <p>
                <strong className="text-red-400">Not Financial Advice:</strong> These calculators are for educational 
                purposes only and do not constitute financial, investment, or tax advice.
              </p>
              <p>
                <strong>Past Performance:</strong> Historical data and past performance do not guarantee future results. 
                Market conditions change, and your actual returns may differ.
              </p>
              <p>
                <strong>Consult Professionals:</strong> Always consult with a qualified financial advisor, tax professional, 
                or certified financial planner before making investment decisions.
              </p>
              <p>
                <strong>Your Responsibility:</strong> You are solely responsible for your financial decisions. We are not 
                liable for any losses or damages resulting from the use of these calculators.
              </p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-modern p-4 sm:p-6 lg:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Contact & Feedback</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We're committed to continuously improving our calculators. If you find any errors, have suggestions, 
              or want to report an issue, please reach out. Your feedback helps us serve the community better.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  )
}