import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CalendarDays, Salad, Target, Zap, TrendingUp, ChevronRight, Award, LogOut, User } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import BottomNav from '../components/BottomNav'
import AppTour from '../components/AppTour'
import WorkoutPlan from '../components/WorkoutPlan'
import DietPlan from '../components/DietPlan'
import Milestones from '../components/Milestones'
import Records from './Records'
import ProteinTracker from './ProteinTracker'
import { useApp } from '../context/AppContext'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })
const TODAY_KEY = new Date().toISOString().split('T')[0]

const GOAL_LABELS = {
  muscle_gain: 'Muscle Gain',
  weight_loss:  'Weight Loss',
  lean:         'Lean Body',
  bulk:         'Bulk Up',
}

function MobileHeader() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-surface-700 bg-surface-900 flex-shrink-0 relative">
      <span className="font-bold text-white">Go-to-Fitness</span>

      {/* Avatar button */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-full right-4 mt-1 w-48 bg-surface-800 border border-surface-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-surface-700">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </>
      )}
    </header>
  )
}

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <MobileHeader />

        {/* Scrollable content — bottom padding leaves room for bottom nav on mobile */}
        <main className="flex-1 overflow-y-auto main-mobile-pad lg:pb-0">
          <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-5">
            <Routes>
              <Route index           element={<Overview />} />
              <Route path="workout"  element={<WorkoutPlan />} />
              <Route path="diet"     element={<DietPlan />} />
              <Route path="milestones" element={<Milestones />} />
              <Route path="records"   element={<Records />} />
              <Route path="protein"  element={<ProteinTracker />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* First-launch guided tour */}
      <AppTour />
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────

function Overview() {
  const { user, profile, goals, plan, milestones, completedExercises, completedMeals } = useApp()
  const navigate = useNavigate()

  const todayWorkout = plan?.workoutPlan?.days?.find(d => d.day === TODAY)

  // Today's exercise progress
  const doneExercises = completedExercises?.[TODAY_KEY]?.[todayWorkout?.label] || []
  const totalExercises = todayWorkout?.exercises?.filter(e => e.name !== 'Complete Rest Day').length || 0

  // Today's meal progress
  const doneMeals = completedMeals?.[TODAY_KEY] || []
  const totalMeals = plan?.dietPlan?.meals?.filter(m => m.key !== 'lateNight').length || 0

  const completedMilestoneCount = milestones?.completed?.length || 0
  const activeMilestoneCount = milestones?.active?.length || 0

  const bmi = profile ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : null
  const getBMILabel = (b) => {
    const v = parseFloat(b)
    if (v < 18.5) return { label: 'Underweight', cls: 'text-yellow-400' }
    if (v < 25)   return { label: 'Normal',      cls: 'text-emerald-400' }
    if (v < 30)   return { label: 'Overweight',  cls: 'text-orange-400' }
    return               { label: 'Obese',       cls: 'text-red-400' }
  }
  const bmiInfo = bmi ? getBMILabel(bmi) : null

  return (
    <div className="space-y-5 animate-slide-up pb-2">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Today's progress — 2 cards side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Workout progress */}
        <button
          onClick={() => navigate('/dashboard/workout')}
          className="card p-4 text-left hover:border-brand-500/40 active:bg-surface-700/60 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-brand-600/20 rounded-lg flex items-center justify-center">
              <CalendarDays size={17} className="text-brand-400" />
            </div>
            <ChevronRight size={14} className="text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-white">{doneExercises.length}<span className="text-base text-gray-500 font-normal">/{totalExercises}</span></p>
          <p className="text-xs text-gray-500 mt-0.5">Exercises done</p>
          {totalExercises > 0 && (
            <div className="mt-2 h-1.5 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all"
                style={{ width: `${(doneExercises.length / totalExercises) * 100}%` }}
              />
            </div>
          )}
        </button>

        {/* Meals progress */}
        <button
          onClick={() => navigate('/dashboard/diet')}
          className="card p-4 text-left hover:border-emerald-500/40 active:bg-surface-700/60 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-emerald-600/20 rounded-lg flex items-center justify-center">
              <Salad size={17} className="text-emerald-400" />
            </div>
            <ChevronRight size={14} className="text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-white">{doneMeals.filter(k => k !== 'lateNight').length}<span className="text-base text-gray-500 font-normal">/{totalMeals}</span></p>
          <p className="text-xs text-gray-500 mt-0.5">Meals eaten</p>
          {totalMeals > 0 && (
            <div className="mt-2 h-1.5 bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${(doneMeals.filter(k => k !== 'lateNight').length / totalMeals) * 100}%` }}
              />
            </div>
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { icon: Target,    label: 'Goal',        value: GOAL_LABELS[goals?.primaryGoal] || '—', color: 'text-brand-400',   bg: 'bg-brand-500/10' },
          { icon: TrendingUp,label: 'BMI',          value: bmi ? `${bmi}` : '—',                  color: bmiInfo?.cls || 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Award,     label: 'Experience',  value: profile ? (profile.experienceMonths >= 12 ? `${Math.floor(profile.experienceMonths/12)}yr ${profile.experienceMonths%12}mo` : `${profile.experienceMonths}mo`) : '—', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { icon: Zap,       label: 'Milestones',  value: `${completedMilestoneCount}/${activeMilestoneCount + completedMilestoneCount}`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-3.5">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mb-2.5`}>
                <Icon size={16} className={stat.color} />
              </div>
              <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Today's workout preview */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white text-sm">Today — {TODAY}</h2>
          </div>
          <button onClick={() => navigate('/dashboard/workout')} className="text-xs text-brand-400 flex items-center gap-0.5">
            Full plan <ChevronRight size={14} />
          </button>
        </div>

        {todayWorkout ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${todayWorkout.isRest ? 'bg-surface-700' : 'bg-brand-600'}`}>
                {todayWorkout.isRest ? '😴' : '🏋️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{todayWorkout.label}</p>
                <p className="text-xs text-gray-500">{todayWorkout.exercises?.length} exercises</p>
              </div>
              {totalExercises > 0 && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  doneExercises.length >= totalExercises
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-surface-700 text-gray-400'
                }`}>
                  {doneExercises.length}/{totalExercises}
                </span>
              )}
            </div>

            {!todayWorkout.isRest && (
              <div className="space-y-1.5">
                {todayWorkout.exercises?.slice(0, 4).map((ex, i) => (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${
                    doneExercises.includes(i) ? 'bg-emerald-500/10' : 'bg-surface-700/40'
                  }`}>
                    <span className={`w-4 h-4 rounded text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      doneExercises.includes(i) ? 'bg-emerald-500/30 text-emerald-400' : 'bg-brand-600/30 text-brand-400'
                    }`}>{i + 1}</span>
                    <p className={`flex-1 truncate ${doneExercises.includes(i) ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{ex.name}</p>
                    <p className="text-xs text-gray-600 flex-shrink-0">{ex.sets}×{ex.reps}</p>
                  </div>
                ))}
                {todayWorkout.exercises?.length > 4 && (
                  <button onClick={() => navigate('/dashboard/workout')} className="text-xs text-brand-400 pl-1">
                    +{todayWorkout.exercises.length - 4} more →
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No plan yet. Complete your profile first.</p>
        )}
      </div>

      {/* Today's next meal */}
      {plan?.dietPlan && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Salad size={16} className="text-emerald-400" />
              <h2 className="font-semibold text-white text-sm">Meals Today</h2>
            </div>
            <button onClick={() => navigate('/dashboard/diet')} className="text-xs text-brand-400 flex items-center gap-0.5">
              Full plan <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            {plan.dietPlan.meals?.slice(0, 4).map((meal, i) => {
              const isEaten = doneMeals.includes(meal.key)
              const mealEmojis = ['🌅','🍎','🍱','⚡','💪','🌙','🌛']
              return (
                <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                  isEaten ? 'bg-emerald-500/10' : 'bg-surface-700/40'
                }`}>
                  <span className="text-base flex-shrink-0">{isEaten ? '✅' : mealEmojis[i]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isEaten ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{meal.label}</p>
                  </div>
                  <span className="text-xs text-orange-400 flex-shrink-0">{meal.macros?.cal} kcal</span>
                </div>
              )
            })}
            {plan.dietPlan.meals?.length > 4 && (
              <button onClick={() => navigate('/dashboard/diet')} className="text-xs text-brand-400 pl-1">
                +{plan.dietPlan.meals.length - 4} more →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active milestones */}
      {milestones?.active?.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-orange-400" />
              <h2 className="font-semibold text-white text-sm">Active Milestones</h2>
            </div>
            <button onClick={() => navigate('/dashboard/milestones')} className="text-xs text-brand-400 flex items-center gap-0.5">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-1.5">
            {milestones.active.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-surface-700/40 rounded-lg">
                <span className="text-base flex-shrink-0">{m.icon}</span>
                <p className="text-sm text-gray-300 flex-1 truncate">{m.title}</p>
                <span className="text-xs text-gray-600 flex-shrink-0">{m.tier}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile summary */}
      {profile && (
        <div className="card p-4">
          <h2 className="font-semibold text-white text-sm mb-3">Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Age',           value: `${profile.age} yrs` },
              { label: 'Weight',        value: `${profile.weight} kg` },
              { label: 'Height',        value: `${profile.height} cm` },
              { label: 'Target',        value: `${goals?.targetWeight} kg` },
              { label: 'Diet',          value: goals?.dietPreference === 'veg' ? '🥦 Veg' : '🍗 Non-Veg' },
              { label: 'Health',        value: profile.healthConditions?.join(', ') || 'None' },
            ].map(item => (
              <div key={item.label} className="bg-surface-700/40 rounded-lg p-2.5">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-medium text-white mt-0.5 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
