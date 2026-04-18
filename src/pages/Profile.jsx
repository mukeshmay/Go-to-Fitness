import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Weight, Ruler, CalendarDays, Target, Salad,
  Dumbbell, Zap, Heart, TrendingUp, LogOut, RefreshCw,
  Flame, Activity,
} from 'lucide-react'

const GOAL_LABELS = {
  muscle_gain: { label: 'Muscle Gain',  emoji: '💪', color: 'text-brand-400',   bg: 'bg-brand-500/15 border-brand-500/30' },
  weight_loss: { label: 'Weight Loss',  emoji: '🔥', color: 'text-orange-400',  bg: 'bg-orange-500/15 border-orange-500/30' },
  lean:        { label: 'Lean Body',    emoji: '⚡', color: 'text-cyan-400',    bg: 'bg-cyan-500/15 border-cyan-500/30' },
  bulk:        { label: 'Bulk Up',      emoji: '🏋️', color: 'text-purple-400',  bg: 'bg-purple-500/15 border-purple-500/30' },
}

const BODY_TYPE_LABELS = {
  lean_build:  'Lean Build',
  athletic:    'Athletic',
  powerlifter: 'Powerlifter',
}

function getBMIInfo(bmi) {
  const v = parseFloat(bmi)
  if (v < 18.5) return { label: 'Underweight', cls: 'text-yellow-400',  bg: 'bg-yellow-500/15 border-yellow-500/30' }
  if (v < 25)   return { label: 'Normal',      cls: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' }
  if (v < 30)   return { label: 'Overweight',  cls: 'text-orange-400',  bg: 'bg-orange-500/15 border-orange-500/30' }
  return               { label: 'Obese',       cls: 'text-red-400',     bg: 'bg-red-500/15 border-red-500/30' }
}

function formatExperience(months) {
  if (!months && months !== 0) return '—'
  if (months === 0) return 'Beginner'
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
  const yrs = Math.floor(months / 12)
  const mo  = months % 12
  return mo > 0 ? `${yrs}yr ${mo}mo` : `${yrs} year${yrs > 1 ? 's' : ''}`
}

function countAllCompleted(completedExercises) {
  let total = 0
  if (!completedExercises) return 0
  for (const dateData of Object.values(completedExercises)) {
    for (const arr of Object.values(dateData)) {
      total += arr.length
    }
  }
  return total
}

function countAllMeals(completedMeals) {
  if (!completedMeals) return 0
  return Object.values(completedMeals).reduce((sum, arr) => sum + arr.length, 0)
}

function countActiveDays(completedExercises) {
  if (!completedExercises) return 0
  return Object.values(completedExercises).filter(d => Object.values(d).some(arr => arr.length > 0)).length
}

export default function Profile() {
  const { user, profile, goals, plan, milestones, completedExercises, completedMeals, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (!profile || !goals) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center mb-4">
          <User size={28} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-white">Profile not set up yet</h3>
        <p className="text-gray-400 text-sm mt-2">Complete onboarding to see your profile.</p>
      </div>
    )
  }

  const bmi      = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
  const bmiInfo  = getBMIInfo(bmi)
  const goalInfo = GOAL_LABELS[goals.primaryGoal] || GOAL_LABELS.muscle_gain

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const totalExercises = countAllCompleted(completedExercises)
  const totalMeals     = countAllMeals(completedMeals)
  const activeDays     = countActiveDays(completedExercises)
  const milestoneDone  = milestones?.completed?.length || 0

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="space-y-5 animate-slide-up pb-6">

      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div className="card p-5 flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{user?.name}</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={12} className="text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <CalendarDays size={12} className="text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-500">Member since {memberSince}</p>
          </div>
        </div>
      </div>

      {/* ── Goal badge ─────────────────────────────────────────────────────── */}
      <div className={`card p-4 border flex items-center gap-3 ${goalInfo.bg}`}>
        <span className="text-3xl">{goalInfo.emoji}</span>
        <div>
          <p className="text-xs text-gray-400 font-medium">Primary Goal</p>
          <p className={`text-lg font-bold ${goalInfo.color}`}>{goalInfo.label}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500">Target</p>
          <p className="text-base font-bold text-white">{goals.targetWeight} kg</p>
        </div>
      </div>

      {/* ── Physical stats ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-0.5">Physical Stats</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard icon={Weight}  label="Current Weight" value={`${profile.weight} kg`} color="text-brand-400" />
          <StatCard icon={Target}  label="Target Weight"  value={`${goals.targetWeight} kg`} color="text-cyan-400" />
          <StatCard icon={Ruler}   label="Height"         value={`${profile.height} cm`} color="text-purple-400" />
          <StatCard icon={User}    label="Age"            value={`${profile.age} years`} color="text-orange-400" />
        </div>

        {/* BMI card */}
        <div className={`card mt-2.5 p-4 border flex items-center justify-between ${bmiInfo.bg}`}>
          <div>
            <p className="text-xs text-gray-400 font-medium">Body Mass Index (BMI)</p>
            <p className={`text-2xl font-bold mt-0.5 ${bmiInfo.cls}`}>{bmi}</p>
          </div>
          <span className={`badge border px-3 py-1.5 text-sm font-semibold ${bmiInfo.cls} ${bmiInfo.bg}`}>
            {bmiInfo.label}
          </span>
        </div>
      </div>

      {/* ── Fitness profile ────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-0.5">Fitness Profile</h2>
        <div className="card divide-y divide-surface-700">
          <Row icon={Dumbbell} label="Experience"    value={formatExperience(profile.experienceMonths)} />
          <Row icon={Activity} label="Body Type"     value={BODY_TYPE_LABELS[goals.bodyType] || 'Athletic'} />
          <Row icon={Salad}    label="Diet"          value={goals.dietPreference === 'veg' ? '🥦 Vegetarian' : '🍗 Non-Vegetarian'} />
          <Row icon={Zap}      label="Whey Protein"  value={goals.usesWhey !== false ? '✅ Yes' : '❌ No'} />
          {plan?.workoutPlan && (
            <>
              <Row icon={CalendarDays} label="Workout Frequency" value={plan.workoutPlan.frequency} />
              <Row icon={TrendingUp}   label="Fitness Level"     value={plan.workoutPlan.level?.charAt(0).toUpperCase() + plan.workoutPlan.level?.slice(1) || '—'} />
            </>
          )}
          {plan?.dietPlan && (
            <>
              <Row icon={Flame} label="Daily Calories" value={`~${plan.dietPlan.targetCalories} kcal`} />
              <Row icon={Zap}   label="Protein Target" value={plan.dietPlan.targetProtein} />
            </>
          )}
        </div>
      </div>

      {/* ── Health conditions ──────────────────────────────────────────────── */}
      {profile.healthConditions?.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-0.5">Health Conditions</h2>
          <div className="card p-4">
            <div className="flex flex-wrap gap-2">
              {profile.healthConditions.map(c => (
                <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-700 border border-surface-600 rounded-full text-sm text-gray-300">
                  <Heart size={12} className="text-red-400" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Activity stats ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-0.5">Your Activity</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <ActivityCard emoji="🏋️" label="Exercises Done"  value={totalExercises}  color="text-brand-400" />
          <ActivityCard emoji="🥗" label="Meals Eaten"     value={totalMeals}      color="text-emerald-400" />
          <ActivityCard emoji="📅" label="Active Days"     value={activeDays}       color="text-cyan-400" />
          <ActivityCard emoji="🏆" label="Milestones Done" value={milestoneDone}   color="text-yellow-400" />
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-brand-600/10 border border-brand-500/25 text-brand-300 text-sm font-semibold hover:bg-brand-600/20 transition-colors"
        >
          <RefreshCw size={16} />
          Regenerate My Plan
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/15 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4">
      <Icon size={16} className={`${color} mb-2`} />
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function ActivityCard({ emoji, label, value, color }) {
  return (
    <div className="card p-4">
      <span className="text-2xl">{emoji}</span>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon size={16} className="text-gray-500 flex-shrink-0" />
      <p className="text-sm text-gray-400 flex-1">{label}</p>
      <p className="text-sm font-medium text-white text-right">{value}</p>
    </div>
  )
}
