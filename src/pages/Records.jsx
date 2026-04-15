import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { getDailyInspiration } from '../utils/inspiration'
import { calculateTarget, getDailyLog } from '../utils/targetCalculator'
import {
  CalendarDays, Salad, Target, Flame, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Clock, Zap, Trophy, BarChart3,
  ChevronDown, ChevronUp, Minus,
} from 'lucide-react'

const STATUS_CONFIG = {
  done:        { icon: '✅', label: 'Done',        cls: 'text-emerald-400' },
  in_progress: { icon: '🔄', label: 'In Progress', cls: 'text-brand-400'  },
  partial:     { icon: '⚠️', label: 'Partial',     cls: 'text-yellow-400' },
  missed:      { icon: '❌', label: 'Missed',      cls: 'text-red-400'    },
  pending:     { icon: '⏳', label: 'Pending',     cls: 'text-gray-500'   },
  rest:        { icon: '😴', label: 'Rest',         cls: 'text-gray-500'   },
}

function fmt(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysFromNow(date) {
  const diff = Math.round((date - Date.now()) / 86_400_000)
  if (diff <= 0) return 'already passed'
  if (diff === 1) return 'tomorrow'
  if (diff < 7)   return `${diff} days`
  if (diff < 30)  return `${Math.round(diff / 7)} weeks`
  const months = Math.round(diff / 30)
  return `~${months} month${months > 1 ? 's' : ''}`
}

export default function Records() {
  const { profile, goals, plan, completedExercises, completedMeals } = useApp()
  const [logExpanded, setLogExpanded] = useState(false)

  const quote = useMemo(() => getDailyInspiration(), [])

  const target = useMemo(
    () => calculateTarget(profile, goals, plan, completedExercises, completedMeals),
    [profile, goals, plan, completedExercises, completedMeals]
  )

  const allDays = useMemo(
    () => getDailyLog(profile, plan, completedExercises, completedMeals),
    [profile, plan, completedExercises, completedMeals]
  )
  // Show only last 7 days when collapsed; full history when expanded
  const dailyLog = logExpanded ? allDays : allDays.slice(0, 7)

  if (!profile || !plan) return <NoProfileState />

  return (
    <div className="space-y-5 animate-slide-up pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Records</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your daily log, target timeline, and inspiration.</p>
      </div>

      {/* ── Inspiration card ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/60 via-surface-800 to-surface-800 p-5">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
        <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">
          💡 Today's Inspiration
        </p>
        <blockquote className="text-base sm:text-lg font-medium text-white leading-relaxed">
          "{quote.quote}"
        </blockquote>
        {quote.author && quote.author !== 'Unknown' && (
          <p className="text-sm text-gray-500 mt-2">— {quote.author}</p>
        )}
      </div>

      {/* ── Target Date ──────────────────────────────────────────────────── */}
      {target && !target.alreadyReached && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white text-sm">Your Target</h2>
          </div>

          {/* Weight progress bar */}
          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-400 text-xs">Current</p>
                <p className="font-bold text-white text-lg">{target.currentWeight} kg</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
                  {/* Progress toward target — visual only (shows effort, not actual weight change) */}
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(4, (target.totalPastDays / (target.adjustedWeeks * 7)) * 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Day 0</span>
                  <span>{target.adjustedWeeks}w</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Target</p>
                <p className="font-bold text-white text-lg">{target.targetWeight} kg</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              {target.direction === 'lose'
                ? <TrendingDown size={14} className="text-orange-400" />
                : <TrendingUp size={14} className="text-emerald-400" />
              }
              <span>
                {target.direction === 'lose' ? 'Lose' : 'Gain'} {target.weightDiff.toFixed(1)} kg to reach your goal
              </span>
            </div>
          </div>

          {/* Two date cards side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-2">
                <CheckCircle2 size={13} />
                Perfect Adherence
              </div>
              <p className="text-white font-bold text-sm">{fmt(target.perfectDate)}</p>
              <p className="text-gray-500 text-xs mt-1">in {daysFromNow(target.perfectDate)}</p>
              <p className="text-gray-600 text-xs mt-1">{target.baseWeeks}w at 100% plan</p>
            </div>

            <div className={`card p-4 ${target.totalPenaltyDays > 0 ? 'border-orange-500/30' : ''}`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${target.totalPenaltyDays > 0 ? 'text-orange-400' : 'text-brand-400'}`}>
                <Clock size={13} />
                At Current Rate
              </div>
              <p className="text-white font-bold text-sm">{fmt(target.adjustedDate)}</p>
              <p className="text-gray-500 text-xs mt-1">in {daysFromNow(target.adjustedDate)}</p>
              <p className={`text-xs mt-1 ${target.totalPenaltyDays > 0 ? 'text-orange-500' : 'text-gray-600'}`}>
                {target.totalPenaltyDays > 0
                  ? `+${target.totalPenaltyDays}d added for misses`
                  : 'On track!'}
              </p>
            </div>
          </div>

          {/* Miss breakdown */}
          {(target.missedWorkoutDays > 0 || target.missedDietDays > 0) && (
            <div className="card p-4 border-orange-500/20 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                <AlertTriangle size={15} />
                Missed Days Impact
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-surface-700/40 rounded-lg p-3">
                  <p className="text-white font-bold">{target.missedWorkoutDays}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Workout days missed</p>
                  <p className="text-orange-400 text-xs mt-1">
                    +{(target.missedWorkoutDays * 1.5).toFixed(0)}d added
                  </p>
                </div>
                <div className="bg-surface-700/40 rounded-lg p-3">
                  <p className="text-white font-bold">{target.missedDietDays}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Diet days missed</p>
                  <p className="text-orange-400 text-xs mt-1">
                    +{(target.missedDietDays * 0.8).toFixed(0)}d added
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Follow your plan consistently to bring this date forward.
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="card p-3.5 text-center">
              <p className="text-xl font-bold text-brand-400">{target.streak}</p>
              <p className="text-xs text-gray-500 mt-0.5">Day streak 🔥</p>
            </div>
            <div className="card p-3.5 text-center">
              <p className="text-xl font-bold text-emerald-400">{target.adherenceRate}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Adherence</p>
            </div>
            <div className="card p-3.5 text-center">
              <p className="text-xl font-bold text-white">{target.totalPastDays}</p>
              <p className="text-xs text-gray-500 mt-0.5">Days tracked</p>
            </div>
          </div>
        </div>
      )}

      {target?.alreadyReached && (
        <div className="card p-5 text-center border-emerald-500/30">
          <Trophy size={32} className="text-yellow-400 mx-auto mb-2" />
          <p className="font-bold text-white">You've reached your target weight!</p>
          <p className="text-gray-400 text-sm mt-1">Set a new goal to keep the momentum going.</p>
        </div>
      )}

      {/* ── Daily Log ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-brand-400" />
          <h2 className="font-semibold text-white text-sm">Daily Log</h2>
          <span className="text-xs text-gray-600">
            ({logExpanded ? `all ${allDays.length} days` : 'recent 7 days'})
          </span>
        </div>

        <div className="space-y-2">
          {dailyLog.map(day => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>

        <button
          onClick={() => setLogExpanded(v => !v)}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-gray-400 hover:text-white bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-xl transition-colors"
        >
          {logExpanded
            ? <><ChevronUp size={15} /> Show less</>
            : <><ChevronDown size={15} /> Show all {allDays.length} days</>
          }
        </button>
      </div>
    </div>
  )
}

// ── Day card ──────────────────────────────────────────────────────────────────

function DayCard({ day }) {
  const ws = STATUS_CONFIG[day.workoutStatus]
  const ds = STATUS_CONFIG[day.dietStatus]

  const isGoodDay = (day.workoutStatus === 'done' || day.isRest) && day.dietStatus === 'done'
  const isBadDay  = !day.isToday && day.workoutStatus === 'missed' && day.dietStatus === 'missed'

  return (
    <div className={`card p-3.5 flex items-center gap-3 ${
      day.isToday   ? 'border-brand-500/40'   :
      isGoodDay     ? 'border-emerald-500/20'  :
      isBadDay      ? 'border-red-500/20'      : ''
    }`}>
      {/* Date pill */}
      <div className={`w-12 flex-shrink-0 flex flex-col items-center justify-center rounded-xl py-2 ${
        day.isToday ? 'bg-brand-600' : isGoodDay ? 'bg-emerald-500/20' : isBadDay ? 'bg-red-500/10' : 'bg-surface-700'
      }`}>
        <p className="text-xs font-bold text-white leading-none">
          {new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric' })}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(day.date).toLocaleDateString('en-IN', { month: 'short' })}
        </p>
        <p className="text-xs font-medium text-gray-500 mt-0.5">{day.weekday.slice(0, 3)}</p>
      </div>

      {/* Stats */}
      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
        {/* Workout */}
        <div className="bg-surface-700/40 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays size={12} className="text-gray-500" />
            <p className="text-xs text-gray-500">Workout</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{ws.icon}</span>
            <div>
              <p className={`text-xs font-semibold ${ws.cls}`}>{ws.label}</p>
              {!day.isRest && day.totalExercises > 0 && (
                <p className="text-xs text-gray-600">{day.doneExercises}/{day.totalExercises} done</p>
              )}
            </div>
          </div>
        </div>

        {/* Diet */}
        <div className="bg-surface-700/40 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Salad size={12} className="text-gray-500" />
            <p className="text-xs text-gray-500">Diet</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">{ds.icon}</span>
            <div>
              <p className={`text-xs font-semibold ${ds.cls}`}>{ds.label}</p>
              <p className="text-xs text-gray-600">{day.mealsDone}/{day.totalMeals} meals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall indicator */}
      <div className="flex-shrink-0">
        {isGoodDay  && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
        {isBadDay   && <div className="w-2 h-2 rounded-full bg-red-500" />}
        {!isGoodDay && !isBadDay && <div className="w-2 h-2 rounded-full bg-gray-700" />}
      </div>
    </div>
  )
}

// ── No profile state ──────────────────────────────────────────────────────────

function NoProfileState() {
  const quote = useMemo(() => getDailyInspiration(), [])
  return (
    <div className="space-y-5 animate-fade-in pb-6">
      <div>
        <h1 className="text-xl font-bold text-white">Records</h1>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/60 via-surface-800 to-surface-800 p-5">
        <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-3">💡 Today's Inspiration</p>
        <blockquote className="text-base font-medium text-white leading-relaxed">"{quote.quote}"</blockquote>
        {quote.author && quote.author !== 'Unknown' && (
          <p className="text-sm text-gray-500 mt-2">— {quote.author}</p>
        )}
      </div>
      <div className="card p-8 text-center">
        <BarChart3 size={32} className="text-gray-600 mx-auto mb-3" />
        <p className="font-semibold text-white">No data yet</p>
        <p className="text-gray-400 text-sm mt-1">Complete your profile setup to start tracking records.</p>
      </div>
    </div>
  )
}
