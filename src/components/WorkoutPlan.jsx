import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CalendarDays, ChevronDown, ChevronUp, Clock, Flame, Shield, CheckCircle2, Circle, Info, ExternalLink } from 'lucide-react'
import { getExerciseInfo, getYouTubeSearchUrl } from '../utils/exerciseInfo'

const TAG_COLORS = {
  Push: 'bg-orange-500/20 text-orange-300',
  Pull: 'bg-cyan-500/20 text-cyan-300',
  Legs: 'bg-purple-500/20 text-purple-300',
  Core: 'bg-yellow-500/20 text-yellow-300',
  Cardio: 'bg-red-500/20 text-red-300',
  Rest: 'bg-gray-500/20 text-gray-400',
  Mobility: 'bg-teal-500/20 text-teal-300',
  Hypertrophy: 'bg-brand-500/20 text-brand-300',
  Strength: 'bg-emerald-500/20 text-emerald-300',
  HIIT: 'bg-red-500/20 text-red-300',
  Circuit: 'bg-pink-500/20 text-pink-300',
  Endurance: 'bg-blue-500/20 text-blue-300',
  'Full Body': 'bg-indigo-500/20 text-indigo-300',
  Arms: 'bg-amber-500/20 text-amber-300',
  Bulk: 'bg-brand-500/20 text-brand-300',
  Lean: 'bg-emerald-500/20 text-emerald-300',
  'Fat Burn': 'bg-red-500/20 text-red-300',
  Recovery: 'bg-teal-500/20 text-teal-300',
  'Low Impact': 'bg-gray-400/20 text-gray-300',
  'Upper Body': 'bg-violet-500/20 text-violet-300',
  'Calorie Burn': 'bg-orange-500/20 text-orange-300',
}

const LEVEL_BADGE = {
  beginner:     { label: 'Beginner',     cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  intermediate: { label: 'Intermediate', cls: 'bg-brand-500/20 text-brand-300 border border-brand-500/30' },
  advanced:     { label: 'Advanced',     cls: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
}

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })
const TODAY_KEY = new Date().toISOString().split('T')[0]

export default function WorkoutPlan() {
  const { plan, profile, completedExercises, toggleExercise } = useApp()
  const [expandedDay, setExpandedDay] = useState(TODAY)
  const [expandedExInfo, setExpandedExInfo] = useState(null) // "dayLabel-index"

  const toggleExInfo = (key) => setExpandedExInfo(prev => prev === key ? null : key)

  if (!plan?.workoutPlan) return <EmptyState />

  const { workoutPlan } = plan
  const levelBadge = LEVEL_BADGE[workoutPlan.level] || LEVEL_BADGE.beginner

  return (
    <div className="space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Workout Plan</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {workoutPlan.frequency} · age {profile?.age}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`badge px-3 py-1.5 text-xs font-semibold ${levelBadge.cls}`}>
            {levelBadge.label}
          </span>
          {workoutPlan.bodyType && workoutPlan.bodyType !== 'athletic' && (
            <span className="badge px-2.5 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {workoutPlan.bodyType === 'lean_build' ? 'Lean Build' : 'Powerlifter'}
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { icon: CalendarDays, label: 'Frequency', value: workoutPlan.frequency },
          { icon: Flame,        label: 'Intensity', value: workoutPlan.ageGroup === 'young' || workoutPlan.ageGroup === 'adult' ? 'High' : 'Moderate' },
          { icon: Clock,        label: 'Per session', value: workoutPlan.ageGroup === 'mature' ? '45–60 min' : '60–75 min' },
          { icon: Shield,       label: 'Recovery', value: workoutPlan.ageGroup === 'mature' ? 'Priority' : 'Planned' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-3.5">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
                <Icon size={13} />
                {stat.label}
              </div>
              <p className="font-semibold text-white text-sm">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Day cards */}
      <div className="space-y-2.5">
        {workoutPlan.days.map((day) => {
          const isToday = day.day === TODAY
          const isOpen = expandedDay === day.day

          // Completion state for today only
          const doneIndices = completedExercises?.[TODAY_KEY]?.[day.label] || []
          const total = day.exercises?.filter(e => e.name !== 'Complete Rest Day').length || 0
          const doneCount = doneIndices.length
          const allDone = total > 0 && doneCount >= total

          return (
            <div
              key={day.day}
              className={`card overflow-hidden transition-all duration-200 ${
                isToday ? 'border-brand-500/50 ring-1 ring-brand-500/20' : ''
              } ${allDone ? 'border-emerald-500/40' : ''}`}
            >
              {/* Day header — full tap area */}
              <button
                onClick={() => setExpandedDay(isOpen ? null : day.day)}
                className="tap-compact w-full flex items-center gap-3 p-4 hover:bg-surface-700/30 active:bg-surface-700/50 transition-colors text-left"
              >
                {/* Day pill */}
                <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold ${
                  allDone ? 'bg-emerald-600' : day.isRest ? 'bg-surface-700' : isToday ? 'bg-brand-600' : 'bg-surface-700'
                }`}>
                  {allDone
                    ? <CheckCircle2 size={18} className="text-white" />
                    : <span className="text-gray-300">{day.day.slice(0, 3).toUpperCase()}</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{day.label}</span>
                    {isToday && <span className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs px-2 py-0.5">Today</span>}
                    {allDone && <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5">Done ✓</span>}
                  </div>

                  {/* Tags row */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {day.tags?.map(tag => (
                      <span key={tag} className={`badge text-xs px-2 py-0.5 ${TAG_COLORS[tag] || 'bg-gray-600/20 text-gray-400'}`}>{tag}</span>
                    ))}
                  </div>

                  {/* Progress bar — only show when expanded day or today */}
                  {isToday && total > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${(doneCount / total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{doneCount}/{total}</span>
                    </div>
                  )}
                </div>

                {isOpen
                  ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                }
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-surface-700 px-4 pb-4 pt-3 space-y-3 animate-fade-in">
                  {day.warmup && day.warmup !== '—' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3.5 py-2.5">
                      <p className="text-xs font-semibold text-amber-400 mb-0.5">Warm-up</p>
                      <p className="text-sm text-gray-300">{day.warmup}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {day.exercises?.map((ex, i) => {
                      const isExDone = doneIndices.includes(i)
                      const isRest = ex.name === 'Complete Rest Day'
                      const infoKey = `${day.label}-${i}`
                      const isInfoOpen = expandedExInfo === infoKey
                      const exInfo = !isRest ? getExerciseInfo(ex.name) : null

                      return (
                        <div
                          key={i}
                          className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                            isExDone
                              ? 'bg-emerald-500/10 border-emerald-500/20'
                              : 'bg-surface-700/40 border-transparent'
                          }`}
                        >
                          {/* Exercise row */}
                          <div className="flex gap-3 p-3">
                            {/* Checkbox */}
                            {!isRest && (
                              <button
                                onClick={() => toggleExercise(day.label, i)}
                                className="flex-shrink-0 mt-0.5 text-gray-500 hover:text-emerald-400 active:scale-90 transition-all"
                                aria-label={isExDone ? 'Mark incomplete' : 'Mark complete'}
                              >
                                {isExDone
                                  ? <CheckCircle2 size={20} className="text-emerald-400" />
                                  : <Circle size={20} />
                                }
                              </button>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <p className={`font-medium text-sm ${isExDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                                  {ex.name}
                                </p>
                                {ex.sets !== '—' && (
                                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0 flex-wrap">
                                    <span className="bg-surface-600 px-2 py-0.5 rounded">{ex.sets} sets</span>
                                    <span className="bg-surface-600 px-2 py-0.5 rounded">{ex.reps}</span>
                                    {ex.rest !== '—' && <span className="text-gray-500">rest {ex.rest}</span>}
                                  </div>
                                )}
                              </div>
                              {ex.tip && !isExDone && (
                                <p className="text-xs text-gray-500 mt-1 italic">💡 {ex.tip}</p>
                              )}
                            </div>

                            {/* Info toggle */}
                            {exInfo && (
                              <button
                                onClick={() => toggleExInfo(infoKey)}
                                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                  isInfoOpen ? 'bg-brand-600/30 text-brand-300' : 'text-gray-600 hover:text-gray-400 hover:bg-surface-600'
                                }`}
                                aria-label="Exercise info"
                              >
                                <Info size={15} />
                              </button>
                            )}
                          </div>

                          {/* Exercise info panel */}
                          {isInfoOpen && exInfo && (
                            <div className="border-t border-surface-700/60 px-4 py-3 space-y-3 animate-fade-in bg-surface-800/40">
                              {/* Muscles */}
                              <div>
                                <p className="text-xs font-semibold text-brand-400 mb-1.5">Muscles Worked</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {exInfo.muscles?.primary?.map(m => (
                                    <span key={m} className="badge bg-brand-500/20 text-brand-300 text-xs px-2 py-0.5">🎯 {m}</span>
                                  ))}
                                  {exInfo.muscles?.secondary?.map(m => (
                                    <span key={m} className="badge bg-surface-600 text-gray-400 text-xs px-2 py-0.5">{m}</span>
                                  ))}
                                </div>
                              </div>

                              {/* Equipment */}
                              {exInfo.equipment && (
                                <p className="text-xs text-gray-500">
                                  <span className="text-gray-400 font-medium">Equipment: </span>{exInfo.equipment}
                                </p>
                              )}

                              {/* Steps */}
                              {exInfo.steps?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-300 mb-1.5">How to do it</p>
                                  <ol className="space-y-1">
                                    {exInfo.steps.map((step, si) => (
                                      <li key={si} className="flex gap-2 text-xs text-gray-400">
                                        <span className="w-4 h-4 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5 text-[10px]">{si + 1}</span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {/* Common mistakes */}
                              {exInfo.mistakes?.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-orange-400 mb-1.5">⚠️ Common Mistakes</p>
                                  <ul className="space-y-1">
                                    {exInfo.mistakes.map((m, mi) => (
                                      <li key={mi} className="flex gap-2 text-xs text-gray-500">
                                        <span className="text-orange-500 flex-shrink-0">•</span>
                                        {m}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Pro tip */}
                              {exInfo.tip && (
                                <p className="text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
                                  💚 <span className="font-medium">Pro tip:</span> {exInfo.tip}
                                </p>
                              )}

                              {/* YouTube link */}
                              <a
                                href={getYouTubeSearchUrl(ex.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-600/20 transition-colors"
                              >
                                <ExternalLink size={13} />
                                Watch on YouTube — proper form tutorial
                              </a>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Mark all done button for today */}
                  {isToday && total > 0 && !allDone && (
                    <button
                      onClick={() => {
                        day.exercises?.forEach((ex, i) => {
                          if (!doneIndices.includes(i) && ex.name !== 'Complete Rest Day') {
                            toggleExercise(day.label, i)
                          }
                        })
                      }}
                      className="w-full py-2.5 text-sm font-semibold text-brand-300 bg-brand-600/10 hover:bg-brand-600/20 border border-brand-500/20 rounded-xl transition-colors"
                    >
                      Mark all as done
                    </button>
                  )}

                  {day.cooldown && day.cooldown !== '—' && (
                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg px-3.5 py-2.5">
                      <p className="text-xs font-semibold text-teal-400 mb-0.5">Cool-down</p>
                      <p className="text-sm text-gray-300">{day.cooldown}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-600 text-center">
        Completions reset daily. Consult a doctor before starting any new programme.
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center mb-4">
        <CalendarDays size={28} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-white">No workout plan yet</h3>
      <p className="text-gray-400 text-sm mt-2">Complete your profile to generate a personalised plan.</p>
    </div>
  )
}
