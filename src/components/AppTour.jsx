import { useState, useEffect } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Per-user key so every new account sees the tour exactly once
const tourKey = (email) => `gtf_tour_done_${email}`

const SLIDES = [
  {
    emoji: '🏠',
    emojiAnim: 'tour-bounce',
    title: 'Welcome to Go-to-Fitness',
    description: 'Your personalised fitness hub. Every section is built around your goals — let\'s show you around.',
    accent: 'from-brand-600 to-cyan-500',
    dot: 'bg-brand-400',
    hint: null,
  },
  {
    emoji: '🏋️',
    emojiAnim: 'tour-pump',
    title: 'Log Your Workouts',
    description: 'Tap the circle next to any exercise to mark it done. Your progress bar fills up in real time, and tapping ℹ️ shows step-by-step instructions + a YouTube tutorial.',
    accent: 'from-orange-500 to-amber-400',
    dot: 'bg-orange-400',
    hint: { icon: '📋', text: 'Workout tab' },
  },
  {
    emoji: '🥗',
    emojiAnim: 'tour-spin',
    title: 'Track Every Meal',
    description: 'Open a meal, check the macros and ingredients, then tap "Mark as eaten". Your daily progress bar keeps you on track.',
    accent: 'from-emerald-500 to-teal-400',
    dot: 'bg-emerald-400',
    hint: { icon: '🥗', text: 'Diet tab' },
  },
  {
    emoji: '⚡',
    emojiAnim: 'tour-zap',
    title: 'Hit Your Protein Goal',
    description: 'Add foods from 40+ Indian options across 10 categories. The ring fills as you log servings — switch between veg and non-veg anytime.',
    accent: 'from-brand-500 to-purple-500',
    dot: 'bg-brand-400',
    hint: { icon: '⚡', text: 'Protein tab' },
  },
  {
    emoji: '🏆',
    emojiAnim: 'tour-bounce',
    title: 'Goals & Progress',
    description: 'Complete milestones to unlock new ones. The Records section shows your daily log and updates your target date based on how consistent you\'ve been.',
    accent: 'from-yellow-500 to-orange-500',
    dot: 'bg-yellow-400',
    hint: { icon: '🎯', text: 'Goals tab' },
  },
]

export default function AppTour() {
  const { user } = useApp()
  const [visible, setVisible] = useState(false)
  const [slide, setSlide] = useState(0)
  const [animDir, setAnimDir] = useState('') // 'enter-right' | 'enter-left'

  useEffect(() => {
    if (!user?.email) return
    if (!localStorage.getItem(tourKey(user.email))) {
      const t = setTimeout(() => setVisible(true), 700)
      return () => clearTimeout(t)
    }
  }, [user?.email])

  if (!visible) return null

  const dismiss = () => {
    if (user?.email) localStorage.setItem(tourKey(user.email), '1')
    setVisible(false)
  }

  const goTo = (next) => {
    setAnimDir(next > slide ? 'enter-right' : 'enter-left')
    setSlide(next)
  }

  const next = () => {
    if (slide < SLIDES.length - 1) goTo(slide + 1)
    else dismiss()
  }

  const s = SLIDES[slide]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center tour-backdrop">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-sm mx-auto tour-sheet rounded-t-3xl sm:rounded-2xl overflow-hidden bg-surface-900 border border-surface-700 shadow-2xl">
        {/* Gradient bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${s.accent} transition-all duration-500`} />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors z-10"
        >
          <X size={15} />
        </button>

        {/* Slide content */}
        <div key={slide} className={`px-6 pt-8 pb-2 text-center tour-slide ${animDir}`}>
          {/* Animated emoji */}
          <div className={`text-6xl mb-5 inline-block tour-emoji ${s.emojiAnim}`}>
            {s.emoji}
          </div>

          <h2 className="text-xl font-bold text-white mb-2 leading-tight">{s.title}</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{s.description}</p>

          {/* Section hint */}
          {s.hint && (
            <div className="mt-4 inline-flex items-center gap-2 bg-surface-700/60 rounded-full px-4 py-2 border border-surface-600">
              <span className="text-base">{s.hint.icon}</span>
              <span className="text-xs text-gray-400 font-medium">Find it in the <span className="text-white font-semibold">{s.hint.text}</span></span>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 py-5">
          {SLIDES.map((sl, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slide
                  ? `w-6 h-2 ${sl.dot}`
                  : 'w-2 h-2 bg-surface-600 hover:bg-surface-500'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-8">
          <button
            onClick={dismiss}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 bg-surface-700/50 hover:bg-surface-700 border border-surface-600 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={next}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${s.accent} hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg`}
          >
            {slide < SLIDES.length - 1 ? (
              <>Next <ChevronRight size={15} /></>
            ) : (
              "Let's go! 🚀"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
