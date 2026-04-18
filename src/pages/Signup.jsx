import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useApp()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, confirm } = form

    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const stored = JSON.parse(localStorage.getItem('gtf_users') || '[]')
    if (stored.find(u => u.email === email)) {
      setError('An account with this email already exists.')
      setLoading(false)
      return
    }

    stored.push({ name, email, password })
    localStorage.setItem('gtf_users', JSON.stringify(stored))

    setUser({ name, email })
    setLoading(false)
    navigate('/onboarding', { replace: true })
  }

  return (
    <div className="min-h-dvh-safe flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-surface-950 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <Dumbbell size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Go-to-Fitness</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Start your<br />
            <span className="text-gradient">transformation</span><br />
            today.
          </h1>
          <p className="text-lg text-blue-200/80 max-w-md">
            Answer a few quick questions and get a fully personalised workout + diet plan within minutes.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              'Personalised plan based on age & fitness level',
              'Separate veg & non-veg diet plans',
              'Weekly milestones that evolve as you grow',
              'Full 7-day workout schedule',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-blue-200">
                <span className="w-5 h-5 bg-brand-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 bg-brand-400 rounded-full" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-blue-300/50">
          © {new Date().getFullYear()} Go-to-Fitness. Built for results.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-6 bg-surface-950 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-4">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Dumbbell size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold">Go-to-Fitness</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Create account</h2>
            <p className="text-gray-400 mt-2">It's free. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="input pl-11" autoComplete="name" />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} className="input pl-11" autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-11 pr-12"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" name="confirm" placeholder="Repeat password" value={form.confirm} onChange={handleChange} className="input pl-11" autoComplete="new-password" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account & Start'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
