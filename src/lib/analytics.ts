// Analytics and interaction tracking
// Tracks user engagement for SEO signals

export interface InteractionEvent {
  type: 'slider_move' | 'calculation' | 'chart_view' | 'faq_open' | 'page_view' | 'dwell_time'
  calculator: 'dividend' | 'compound' | '4percent'
  value?: number | string
  timestamp: number
  duration?: number
}

class AnalyticsTracker {
  private events: InteractionEvent[] = []
  private sessionStartTime: number = Date.now()
  private lastInteractionTime: number = Date.now()
  private isTracking: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionStartTime = Date.now()
      this.lastInteractionTime = Date.now()
      
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackDwellTime()
        } else {
          this.lastInteractionTime = Date.now()
        }
      })

      // Track before page unload
      window.addEventListener('beforeunload', () => {
        this.trackDwellTime()
        this.sendToAnalytics()
      })

      // Track dwell time every 30 seconds
      setInterval(() => {
        if (!document.hidden) {
          this.trackDwellTime()
        }
      }, 30000)
    }
  }

  track(event: Omit<InteractionEvent, 'timestamp'>) {
    if (!this.isTracking) return

    const fullEvent: InteractionEvent = {
      ...event,
      timestamp: Date.now(),
    }

    this.events.push(fullEvent)
    this.lastInteractionTime = Date.now()

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', fullEvent)
    }

    // Send critical events immediately
    if (event.type === 'calculation' || event.type === 'chart_view') {
      this.sendEventImmediate(fullEvent)
    }
  }

  trackSliderMove(calculator: InteractionEvent['calculator'], value: number) {
    this.track({
      type: 'slider_move',
      calculator,
      value,
    })
  }

  trackCalculation(calculator: InteractionEvent['calculator'], result: string) {
    this.track({
      type: 'calculation',
      calculator,
      value: result,
    })
  }

  trackChartView(calculator: InteractionEvent['calculator']) {
    this.track({
      type: 'chart_view',
      calculator,
    })
  }

  trackFAQOpen(calculator: InteractionEvent['calculator'], question: string) {
    this.track({
      type: 'faq_open',
      calculator,
      value: question,
    })
  }

  trackPageView(calculator: InteractionEvent['calculator']) {
    this.track({
      type: 'page_view',
      calculator,
    })
  }

  trackDwellTime() {
    const now = Date.now()
    const duration = now - this.lastInteractionTime
    
    if (duration > 2000) { // Only track if user was active for 2+ seconds
      // Determine active calculator from URL or state
      const activeCalculator = this.getActiveCalculator()
      
      this.track({
        type: 'dwell_time',
        calculator: activeCalculator,
        duration,
      })
    }

    this.lastInteractionTime = now
  }

  private getActiveCalculator(): InteractionEvent['calculator'] {
    if (typeof window === 'undefined') return 'dividend'
    
    const path = window.location.pathname
    if (path.includes('calculator')) return 'dividend'
    
    // Could be enhanced to detect from page state
    return 'dividend'
  }

  private sendEventImmediate(event: InteractionEvent) {
    // Send to analytics service (Google Analytics, Plausible, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', event.type, {
        calculator: event.calculator,
        value: event.value,
        event_category: 'calculator_interaction',
      })
    }
  }

  private async sendToAnalytics() {
    if (this.events.length === 0) return

    const sessionDuration = Date.now() - this.sessionStartTime
    const interactionCount = this.events.length

    // Send to your analytics endpoint or Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'session_summary', {
        session_duration: sessionDuration,
        interaction_count: interactionCount,
        event_category: 'engagement',
      })
    }

    // Reset for new session
    this.events = []
  }

  getSessionStats() {
    const duration = Date.now() - this.sessionStartTime
    return {
      duration,
      interactionCount: this.events.length,
      events: this.events,
    }
  }
}

// Singleton instance
export const analytics = typeof window !== 'undefined' ? new AnalyticsTracker() : null

// React hook for analytics
export function useAnalytics() {
  return analytics
}

// Initialize analytics (call from App)
export function initializeAnalytics() {
  if (typeof window !== 'undefined' && analytics) {
    // Analytics is already initialized via singleton
    return analytics
  }
  return null
}