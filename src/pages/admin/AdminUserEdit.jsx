import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, User, Shield, CalendarDays, CheckCircle2, RefreshCw,
  Dumbbell, Salad, ChevronDown, ChevronUp, Edit2, Save, X, Trash2,
} from 'lucide-react'
import { generateWorkoutPlan } from '../../utils/workoutGenerator'
import { generateDietPlan }    from '../../utils/dietGenerator'
import { generateMilestones }  from '../../utils/milestoneGenerator'

const USER_DATA_KEY = 'gtf_user_data'
const USERS_KEY     = 'gtf_users'

const PLANS = [
  { id: 'monthly',     label: 'Monthly',     price: 100, days: 30 },
  { id: 'quarterly',   label: 'Quarterly',   price: 200, days: 90 },
  { id: 'half_yearly', label: 'Half Yearly', price: 400, days: 180 },
  { id: 'yearly',      label: 'Yearly',      price: 600, days: 365 },
]

const GOAL_OPTIONS = [
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'lean',        label: 'Lean Body' },
  { value: 'bulk',        label: 'Bulk Up' },
]
const DIET_OPTIONS   = [{ value: 'non_veg', label: 'Non-Vegetarian' }, { value: 'veg', label: 'Vegetarian' }]
const BODY_OPTIONS   = [{ value: 'lean_build', label: 'Lean Build' }, { value: 'athletic', label: 'Athletic' }, { value: 'powerlifter', label: 'Powerlifter' }]

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getSubStatus(sub) {
  if (!sub?.plan) return { label: 'No Plan', cls: 'text-gray-400', bg: 'bg-surface-700 border-surface-600' }
  const now = new Date(), end = sub.endDate ? new Date(sub.endDate) : null
  if (!end || end < now) return { label: 'Expired', cls: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' }
  const d = Math.ceil((end - now) / 86400000)
  if (d <= 7) return { label: `${d} days left`, cls: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' }
  return { label: 'Active', cls: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' }
}

// Read/write helpers
function readUserData(email) {
  const all = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
  return all[email] || {}
}
function writeUserData(email, data) {
  const all = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
  all[email] = data
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(all))
}
function readUserMeta(email) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  return users.find(u => u.email === email) || null
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminUserEdit() {
  const { email: encodedEmail } = useParams()
  const email    = decodeURIComponent(encodedEmail)
  const navigate = useNavigate()

  const meta = readUserMeta(email)
  const [userData, setUserData] = useState(() => readUserData(email))
  const [tab, setTab]           = useState('overview')
  const [saved, setSaved]       = useState(false)

  const persist = (newData) => {
    setUserData(newData)
    writeUserData(email, newData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!meta) {
    return (
      <div className="min-h-dvh-safe bg-surface-950 flex items-center justify-center p-5 text-center">
        <div>
          <p className="text-white font-semibold">User not found</p>
          <button onClick={() => navigate('/admin/dashboard')} className="btn-primary mt-4 px-6 py-2">Back</button>
        </div>
      </div>
    )
  }

  const sub    = userData.subscription
  const status = getSubStatus(sub)

  return (
    <div className="min-h-dvh-safe bg-surface-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-surface-700 bg-surface-900 sticky top-0 z-30">
        <button onClick={() => navigate('/admin/dashboard')} className="tap-compact w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-700 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{meta.name}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 size={13} /> Saved
          </span>
        )}
      </header>

      {/* Tabs */}
      <div className="flex border-b border-surface-700 bg-surface-900 px-4 gap-1 sticky top-[61px] z-20">
        {[
          { id: 'overview',     label: 'Overview' },
          { id: 'subscription', label: 'Subscription' },
          { id: 'plan',         label: 'Edit Plan' },
          { id: 'workout',      label: 'Workout' },
          { id: 'diet',         label: 'Diet' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tap-compact px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {tab === 'overview'     && <OverviewTab meta={meta} userData={userData} status={status} sub={sub} />}
        {tab === 'subscription' && <SubscriptionTab userData={userData} onSave={persist} />}
        {tab === 'plan'         && <EditPlanTab meta={meta} userData={userData} onSave={persist} />}
        {tab === 'workout'      && <WorkoutTab userData={userData} onSave={persist} />}
        {tab === 'diet'         && <DietTab userData={userData} onSave={persist} />}
      </div>
    </div>
  )
}

// ── Tab: Overview ──────────────────────────────────────────────────────────────
function OverviewTab({ meta, userData, status, sub }) {
  const p = userData.profile
  const g = userData.goals
  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={`card p-4 border flex items-center justify-between ${status.bg}`}>
        <div>
          <p className="text-xs text-gray-400">Subscription Status</p>
          <p className={`text-lg font-bold ${status.cls}`}>{status.label}</p>
        </div>
        {sub?.plan && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Plan</p>
            <p className="text-sm font-semibold text-white capitalize">{sub.plan.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500 mt-0.5">Expires {fmtDate(sub.endDate)}</p>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="card divide-y divide-surface-700">
        <div className="px-4 py-3 flex items-center gap-2">
          <User size={15} className="text-gray-500" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Profile</p>
        </div>
        {p ? (
          <>
            <InfoRow label="Age"        value={`${p.age} years`} />
            <InfoRow label="Weight"     value={`${p.weight} kg`} />
            <InfoRow label="Height"     value={`${p.height} cm`} />
            <InfoRow label="Experience" value={`${p.experienceMonths} months`} />
            <InfoRow label="Conditions" value={p.healthConditions?.join(', ') || 'None'} />
          </>
        ) : (
          <div className="px-4 py-4 text-sm text-gray-500">No profile yet — user needs to complete onboarding.</div>
        )}
      </div>

      {/* Goals */}
      {g && (
        <div className="card divide-y divide-surface-700">
          <div className="px-4 py-3 flex items-center gap-2">
            <Shield size={15} className="text-gray-500" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Goals</p>
          </div>
          <InfoRow label="Primary Goal"   value={g.primaryGoal?.replace('_', ' ')} />
          <InfoRow label="Target Weight"  value={`${g.targetWeight} kg`} />
          <InfoRow label="Body Type"      value={g.bodyType} />
          <InfoRow label="Diet"           value={g.dietPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'} />
          <InfoRow label="Whey Protein"   value={g.usesWhey !== false ? 'Yes' : 'No'} />
        </div>
      )}
    </div>
  )
}

// ── Tab: Subscription ──────────────────────────────────────────────────────────
function SubscriptionTab({ userData, onSave }) {
  const existing = userData.subscription
  const [selectedPlan, setSelectedPlan] = useState(existing?.plan || '')
  const [saving, setSaving] = useState(false)

  const activatePlan = async () => {
    if (!selectedPlan) return
    setSaving(true)
    const plan = PLANS.find(p => p.id === selectedPlan)
    const start = new Date()
    const end   = new Date(Date.now() + plan.days * 86400000)
    onSave({
      ...userData,
      subscription: {
        plan:        plan.id,
        startDate:   start.toISOString().split('T')[0],
        endDate:     end.toISOString().split('T')[0],
        price:       plan.price,
        activatedAt: new Date().toISOString(),
      },
    })
    setSaving(false)
  }

  const revoke = () => {
    onSave({ ...userData, subscription: null })
    setSelectedPlan('')
  }

  const sub    = userData.subscription
  const status = getSubStatus(sub)

  return (
    <div className="space-y-4">
      {/* Current */}
      {sub?.plan && (
        <div className={`card p-4 border ${status.bg} space-y-2`}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Plan</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-white capitalize">{sub.plan.replace('_', ' ')}</p>
              <p className="text-xs text-gray-500 mt-0.5">{fmtDate(sub.startDate)} → {fmtDate(sub.endDate)}</p>
              <p className="text-xs text-gray-500">₹{sub.price} paid</p>
            </div>
            <span className={`badge border px-3 py-1.5 font-semibold ${status.cls} ${status.bg}`}>{status.label}</span>
          </div>
          <button onClick={revoke} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mt-1 px-0">
            <Trash2 size={13} /> Revoke subscription
          </button>
        </div>
      )}

      {/* Select new plan */}
      <div className="card p-5 space-y-4">
        <p className="text-sm font-semibold text-white">{sub?.plan ? 'Change / Renew Plan' : 'Activate Plan'}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`tap-compact p-3.5 rounded-xl border text-left transition-all ${
                selectedPlan === plan.id
                  ? 'bg-brand-600/20 border-brand-500 ring-1 ring-brand-500/30'
                  : 'bg-surface-700 border-surface-600 hover:border-surface-500'
              }`}
            >
              <p className="font-semibold text-white text-sm">{plan.label}</p>
              <p className="text-brand-400 font-bold text-base mt-0.5">₹{plan.price}</p>
              <p className="text-xs text-gray-500 mt-0.5">{plan.days} days</p>
            </button>
          ))}
        </div>

        <button
          onClick={activatePlan}
          disabled={!selectedPlan || saving}
          className="btn-primary w-full py-3 disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <CheckCircle2 size={16} />
          }
          {sub?.plan ? 'Renew / Change Plan' : 'Activate Plan'}
        </button>
      </div>
    </div>
  )
}

// ── Tab: Edit Plan (goals + profile → regenerate) ──────────────────────────────
function EditPlanTab({ meta, userData, onSave }) {
  const [profile, setProfile] = useState({ ...userData.profile } || {})
  const [goals,   setGoals]   = useState({ ...userData.goals }   || {})
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const setG = (k, v) => setGoals(g => ({ ...g, [k]: v }))

  const regenerate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    try {
      const workoutPlan = generateWorkoutPlan(profile, goals)
      const dietPlan    = generateDietPlan(profile, goals)
      const milestones  = generateMilestones(profile.experienceMonths || 0)
      onSave({ ...userData, profile, goals, plan: { workoutPlan, dietPlan }, milestones })
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (!userData.profile) {
    return <p className="text-gray-400 text-sm py-6 text-center">User hasn't completed onboarding yet.</p>
  }

  return (
    <div className="space-y-4">
      {done && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400 font-medium">Plan regenerated successfully!</p>
        </div>
      )}

      {/* Profile fields */}
      <div className="card p-5 space-y-4">
        <p className="text-sm font-semibold text-white flex items-center gap-2"><User size={15} className="text-gray-400" /> Physical Profile</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Age</label>
            <input type="number" value={profile.age || ''} onChange={e => setP('age', +e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" value={profile.weight || ''} onChange={e => setP('weight', +e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <input type="number" value={profile.height || ''} onChange={e => setP('height', +e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Experience (months)</label>
          <input type="number" value={profile.experienceMonths || 0} onChange={e => setP('experienceMonths', +e.target.value)} className="input" />
        </div>
      </div>

      {/* Goals fields */}
      <div className="card p-5 space-y-4">
        <p className="text-sm font-semibold text-white flex items-center gap-2"><Shield size={15} className="text-gray-400" /> Fitness Goals</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Primary Goal</label>
            <select value={goals.primaryGoal || ''} onChange={e => setG('primaryGoal', e.target.value)} className="input">
              {GOAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Target Weight (kg)</label>
            <input type="number" value={goals.targetWeight || ''} onChange={e => setG('targetWeight', +e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Body Type</label>
            <select value={goals.bodyType || 'athletic'} onChange={e => setG('bodyType', e.target.value)} className="input">
              {BODY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Diet</label>
            <select value={goals.dietPreference || 'non_veg'} onChange={e => setG('dietPreference', e.target.value)} className="input">
              {DIET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-300">Uses Whey Protein</span>
          <button
            onClick={() => setG('usesWhey', !(goals.usesWhey !== false))}
            className={`tap-compact relative w-12 h-7 rounded-full overflow-hidden transition-colors ${goals.usesWhey !== false ? 'bg-brand-600' : 'bg-surface-600'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${goals.usesWhey !== false ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <button
        onClick={regenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-colors disabled:opacity-50"
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <RefreshCw size={16} />
        }
        Regenerate Workout + Diet Plan
      </button>
      <p className="text-xs text-gray-600 text-center">This will overwrite the user's current plan immediately.</p>
    </div>
  )
}

// ── Tab: Workout Plan viewer + inline sets/reps editor ─────────────────────────
function WorkoutTab({ userData, onSave }) {
  const [expanded, setExpanded] = useState(null)
  const [editing,  setEditing]  = useState(null) // "dayLabel-idx"
  const [editVals, setEditVals] = useState({})

  const days = userData.plan?.workoutPlan?.days

  if (!days) return <p className="text-gray-400 text-sm py-6 text-center">No workout plan generated yet.</p>

  const saveExercise = (dayLabel, idx) => {
    const key = `${dayLabel}-${idx}`
    const { sets, reps, rest } = editVals[key] || {}
    const newDays = days.map(d => {
      if (d.label !== dayLabel) return d
      const exs = d.exercises.map((ex, i) => {
        if (i !== idx) return ex
        return { ...ex, ...(sets ? { sets } : {}), ...(reps ? { reps } : {}), ...(rest ? { rest } : {}) }
      })
      return { ...d, exercises: exs }
    })
    onSave({ ...userData, plan: { ...userData.plan, workoutPlan: { ...userData.plan.workoutPlan, days: newDays } } })
    setEditing(null)
  }

  return (
    <div className="space-y-2.5">
      {days.map(day => {
        const isOpen = expanded === day.day
        return (
          <div key={day.day} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : day.day)}
              className="tap-compact w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-700/30 text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${day.isRest ? 'bg-surface-700' : 'bg-brand-600/20'}`}>
                <span className="text-gray-300">{day.day.slice(0, 3).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{day.label}</p>
                <p className="text-xs text-gray-500">{day.exercises?.length} exercises</p>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {isOpen && (
              <div className="border-t border-surface-700 divide-y divide-surface-700/60 animate-fade-in">
                {day.exercises?.map((ex, idx) => {
                  const key = `${day.label}-${idx}`
                  const isEdit = editing === key
                  return (
                    <div key={idx} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ex.name}</p>
                          {!isEdit && (
                            <p className="text-xs text-gray-500 mt-0.5">{ex.sets} sets · {ex.reps} · rest {ex.rest}</p>
                          )}
                        </div>
                        {ex.name !== 'Complete Rest Day' && (
                          <button
                            onClick={() => {
                              if (isEdit) { saveExercise(day.label, idx) }
                              else { setEditing(key); setEditVals(v => ({ ...v, [key]: { sets: ex.sets, reps: ex.reps, rest: ex.rest } })) }
                            }}
                            className="tap-compact flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 px-2 py-1 rounded-lg hover:bg-brand-500/10 flex-shrink-0"
                          >
                            {isEdit ? <><Save size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
                          </button>
                        )}
                      </div>
                      {isEdit && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['sets', 'reps', 'rest'].map(field => (
                            <div key={field}>
                              <label className="text-xs text-gray-500 capitalize">{field}</label>
                              <input
                                type="text"
                                value={editVals[key]?.[field] || ''}
                                onChange={e => setEditVals(v => ({ ...v, [key]: { ...v[key], [field]: e.target.value } }))}
                                className="input py-1.5 text-xs mt-0.5"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Tab: Diet Plan viewer + inline macro editor ────────────────────────────────
function DietTab({ userData, onSave }) {
  const [expanded, setExpanded] = useState(null)
  const [editing,  setEditing]  = useState(null)
  const [editVals, setEditVals] = useState({})

  const meals = userData.plan?.dietPlan?.meals
  if (!meals) return <p className="text-gray-400 text-sm py-6 text-center">No diet plan generated yet.</p>

  const saveMeal = (key) => {
    const vals = editVals[key] || {}
    const newMeals = meals.map(m => {
      if (m.key !== key) return m
      return {
        ...m,
        macros: { ...m.macros, ...vals },
      }
    })
    onSave({ ...userData, plan: { ...userData.plan, dietPlan: { ...userData.plan.dietPlan, meals: newMeals } } })
    setEditing(null)
  }

  return (
    <div className="space-y-2">
      {meals.map(meal => {
        const isOpen = expanded === meal.key
        const isEdit = editing === meal.key
        return (
          <div key={meal.key} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : meal.key)}
              className="tap-compact w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-700/30 text-left"
            >
              <span className="text-xl flex-shrink-0">🍽️</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{meal.label}</p>
                <p className="text-xs text-gray-500">{meal.macros?.cal} kcal · {meal.macros?.protein} protein</p>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {isOpen && (
              <div className="border-t border-surface-700 px-4 py-3 animate-fade-in space-y-3">
                <p className="text-sm font-semibold text-brand-300">{meal.name}</p>
                <ul className="space-y-1">
                  {meal.items?.map((item, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-brand-500">•</span>{item}
                    </li>
                  ))}
                </ul>

                {/* Macro editor */}
                {isEdit ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-300">Edit Macros</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['cal', 'protein', 'carbs', 'fat'].map(field => (
                        <div key={field}>
                          <label className="text-xs text-gray-500 capitalize">{field === 'cal' ? 'Calories' : field}</label>
                          <input
                            type="text"
                            value={editVals[meal.key]?.[field] ?? meal.macros?.[field] ?? ''}
                            onChange={e => setEditVals(v => ({ ...v, [meal.key]: { ...v[meal.key], [field]: e.target.value } }))}
                            className="input py-1.5 text-xs mt-0.5"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveMeal(meal.key)} className="flex-1 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5">
                        <Save size={13} /> Save Macros
                      </button>
                      <button onClick={() => setEditing(null)} className="px-3 py-2 bg-surface-700 text-gray-400 text-xs rounded-lg">
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(meal.key)}
                    className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 px-0 py-1"
                  >
                    <Edit2 size={12} /> Edit macros
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-3">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white text-right">{value || '—'}</p>
    </div>
  )
}
