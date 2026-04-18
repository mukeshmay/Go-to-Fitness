import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Dumbbell, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react'

// Hardcoded admin credentials — change these to secure the admin panel
const ADMIN_EMAIL    = 'admin@gotofitness.com'
const ADMIN_PASSWORD = 'Admin@123'
const ADMIN_SESSION  = 'gtf_admin_session'

export function isAdminLoggedIn() {
  try { return !!JSON.parse(localStorage.getItem(ADMIN_SESSION)) } catch { return false }
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION)
}

export default function AdminLogin() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION, JSON.stringify({ loggedIn: true, at: Date.now() }))
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Invalid admin credentials.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-dvh-safe bg-surface-950 flex items-center justify-center p-5">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center">
            <Shield size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">Go-to-Fitness · Gym Management</p>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="admin@gotofitness.com"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }}
                  className="input pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }}
                  className="input pl-11 pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="tap-compact absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign In as Admin'
              }
            </button>
          </form>

          {/* Hint */}
          <div className="bg-surface-700/40 rounded-lg px-3 py-2.5 text-xs text-gray-500 space-y-0.5">
            <p className="font-semibold text-gray-400">Default credentials</p>
            <p>Email: <span className="text-gray-300">admin@gotofitness.com</span></p>
            <p>Password: <span className="text-gray-300">Admin@123</span></p>
          </div>
        </div>

        <div className="text-center mt-5 space-y-2">
          <Link to="/login" className="block text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to user login
          </Link>
          <Link to="/pricing" className="block text-xs text-gray-600 hover:text-gray-400 transition-colors">
            View subscription plans
          </Link>
        </div>
      </div>
    </div>
  )
}
