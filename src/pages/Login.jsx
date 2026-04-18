import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useApp()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    // Simulate auth delay
    await new Promise(r => setTimeout(r, 800))

    // Check stored users
    const stored = JSON.parse(localStorage.getItem('gtf_users') || '[]')
    const found = stored.find(u => u.email === form.email && u.password === form.password)

    if (!found) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    // Restore all saved data for this user (profile, plan, milestones, etc.)
    loginUser({ name: found.name, email: found.email })
    setLoading(false)

    // Check if this user already has a saved profile
    const allData = JSON.parse(localStorage.getItem('gtf_user_data') || '{}')
    const hasProfile = !!allData[found.email]?.profile
    navigate(hasProfile ? '/dashboard' : '/onboarding', { replace: true })
  }

  return (
    <div className="min-h-dvh-safe flex">
      {/* Left panel — hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-surface-950 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <Dumbbell size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Go-to-Fitness</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Your Personal<br />
            <span className="text-gradient">Fitness Coach</span>
          </h1>
          <p className="text-lg text-blue-200/80 max-w-md">
            Personalised workout plans, smart diet guidance, and weekly milestones — all built around <em>you</em>.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: 'Workout Plans', value: 'Age-based' },
              { label: 'Diet Plans', value: 'Veg & Non-Veg' },
              { label: 'Milestones', value: '5 per Month' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-blue-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-blue-300/50">
          © {new Date().getFullYear()} Go-to-Fitness. Built for results.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-6 bg-surface-950 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-4">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Dumbbell size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold">Go-to-Fitness</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400 mt-2">Sign in to continue your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-11 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
