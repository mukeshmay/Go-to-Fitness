import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Users, CheckCircle2, AlertTriangle, Search, Plus, LogOut, ChevronRight, X, Eye, IndianRupee } from 'lucide-react'
import { adminLogout } from './AdminLogin'

const USER_DATA_KEY = 'gtf_user_data'
const USERS_KEY     = 'gtf_users'

const PLAN_LABELS = {
  monthly:     { label: 'Monthly',     color: 'text-brand-400',   bg: 'bg-brand-500/15 border-brand-500/30' },
  quarterly:   { label: 'Quarterly',   color: 'text-cyan-400',    bg: 'bg-cyan-500/15 border-cyan-500/30' },
  half_yearly: { label: 'Half Yearly', color: 'text-purple-400',  bg: 'bg-purple-500/15 border-purple-500/30' },
  yearly:      { label: 'Yearly',      color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
}

const PLAN_PRICES = { monthly: 100, quarterly: 200, half_yearly: 400, yearly: 600 }

function getSubStatus(sub) {
  if (!sub?.plan) return { label: 'No Plan', cls: 'text-gray-500', bg: 'bg-surface-700 border-surface-600' }
  const now = new Date()
  const end = sub.endDate ? new Date(sub.endDate) : null
  if (!end || end < now) return { label: 'Expired', cls: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' }
  const daysLeft = Math.ceil((end - now) / 86400000)
  if (daysLeft <= 7) return { label: `${daysLeft}d left`, cls: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' }
  return { label: 'Active', cls: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' }
}

function readAll() {
  const users   = JSON.parse(localStorage.getItem(USERS_KEY)     || '[]')
  const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
  return users.map(u => ({ ...u, data: allData[u.email] || {} }))
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [search, setSearch]     = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [refresh, setRefresh]   = useState(0)

  const users = useMemo(() => readAll(), [refresh])

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
  }, [users, search])

  // Stats
  const activeCount  = users.filter(u => getSubStatus(u.data?.subscription).label === 'Active').length
  const expiredCount = users.filter(u => getSubStatus(u.data?.subscription).label === 'Expired').length
  const revenue      = users.reduce((sum, u) => sum + (u.data?.subscription?.price || 0), 0)

  const handleLogout = () => {
    adminLogout()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-dvh-safe bg-surface-950">
      {/* Admin header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-surface-700 bg-surface-900 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Admin Panel</p>
            <p className="text-xs text-gray-500">Go-to-Fitness</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/pricing" className="tap-compact text-xs text-gray-500 hover:text-gray-300 px-2 py-1 hidden sm:block">
            Pricing
          </Link>
          <button onClick={handleLogout} className="tap-compact flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Members', value: users.length,   icon: Users,         color: 'text-brand-400',   bg: 'bg-brand-500/10' },
            { label: 'Active Plans',  value: activeCount,    icon: CheckCircle2,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Expired',       value: expiredCount,   icon: AlertTriangle, color: 'text-orange-400',  bg: 'bg-orange-500/10' },
            { label: 'Total Revenue', value: `₹${revenue}`, icon: IndianRupee,   color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="card p-4">
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon size={16} className={s.color} />
                </div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10 py-2.5"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* User list */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-700 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Members <span className="text-gray-500 font-normal">({filtered.length})</span></p>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Users size={28} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">{search ? 'No members found' : 'No members yet. Add your first member.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-700/60">
              {filtered.map(u => {
                const sub    = u.data?.subscription
                const status = getSubStatus(sub)
                const plan   = sub?.plan ? PLAN_LABELS[sub.plan] : null
                return (
                  <button
                    key={u.email}
                    onClick={() => navigate(`/admin/user/${encodeURIComponent(u.email)}`)}
                    className="tap-compact w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-700/30 active:bg-surface-700/50 transition-colors text-left"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-brand-600/20 rounded-full flex items-center justify-center text-brand-300 font-bold text-sm flex-shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {plan && (
                        <span className={`hidden sm:inline-flex badge text-xs px-2 py-0.5 border ${plan.bg} ${plan.color}`}>
                          {plan.label}
                        </span>
                      )}
                      <span className={`badge text-xs px-2 py-0.5 border ${status.bg} ${status.cls}`}>
                        {status.label}
                      </span>
                      <ChevronRight size={15} className="text-gray-600" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && <AddUserModal onClose={() => { setShowAdd(false); setRefresh(r => r + 1) }} />}
    </div>
  )
}

// ── Add User Modal ─────────────────────────────────────────────────────────────

function AddUserModal({ onClose }) {
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [done, setDone]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('All fields required.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.find(u => u.email === form.email)) { setError('Email already registered.'); return }

    users.push({ name: form.name, email: form.email, password: form.password })
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white">Add New Member</h2>
          <button onClick={onClose} className="tap-compact w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-gray-400 hover:text-white">
            <X size={15} />
          </button>
        </div>

        {done ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <p className="font-semibold text-white">Member added!</p>
            <p className="text-sm text-gray-400">{form.name} can now log in and complete onboarding.</p>
            <button onClick={onClose} className="btn-primary w-full py-2.5">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            <div>
              <label className="label">Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError('') }} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" placeholder="john@email.com" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }} className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }} className="input" />
            </div>
            <button type="submit" className="btn-primary w-full py-2.5">Create Member Account</button>
          </form>
        )}
      </div>
    </div>
  )
}
