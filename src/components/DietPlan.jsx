import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Salad, Flame, Zap, Droplets, Pill, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { substituteWhey, VEG_MEALS, NON_VEG_MEALS, MEAL_LABELS } from '../utils/dietGenerator'

const MEAL_ICONS = {
  breakfast:   '🌅',
  midMorning:  '🍎',
  lunch:       '🍱',
  preWorkout:  '⚡',
  postWorkout: '💪',
  dinner:      '🌙',
  lateNight:   '🌛',
}

const TODAY_KEY = new Date().toISOString().split('T')[0]

// Which meals to show per goal — applied at render time so existing stored
// plans are fixed immediately without needing re-generation.
// lean is direction-aware: lean-bulk gets 6 meals, lean-cut gets 5.
function getAllowedMeals(primaryGoal, targetWeight, currentWeight) {
  const weightDiff = (targetWeight || currentWeight) - (currentWeight || 0)
  if (primaryGoal === 'bulk')        return ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner', 'lateNight']
  if (primaryGoal === 'muscle_gain') return ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner']
  if (primaryGoal === 'lean' && weightDiff > 0) return ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner']
  return ['breakfast', 'midMorning', 'lunch', 'postWorkout', 'dinner']
}

export default function DietPlan() {
  const { plan, goals, profile, completedMeals, toggleMeal, setGoals } = useApp()
  const [expandedMeal, setExpandedMeal] = useState('breakfast')

  if (!plan?.dietPlan) return <EmptyState />

  const { dietPlan } = plan
  const primaryGoal  = goals?.primaryGoal  || 'muscle_gain'
  const dietPref     = goals?.dietPreference || dietPlan.dietPreference || 'non_veg'
  const isVeg        = dietPref === 'veg'
  const usesWhey     = goals?.usesWhey !== false   // default true

  // ── Derive meals at render time so both toggles work instantly ────────────
  const source    = isVeg ? VEG_MEALS : NON_VEG_MEALS
  const goalKey   = primaryGoal in source ? primaryGoal : 'muscle_gain'
  const allowed   = getAllowedMeals(primaryGoal, goals?.targetWeight, profile?.weight)

  const meals = allowed.map(key => {
    const raw = { key, label: MEAL_LABELS[key], ...source[goalKey][key] }
    return usesWhey ? raw : substituteWhey(raw, isVeg)
  })

  const toggleWhey   = () => setGoals({ ...goals, usesWhey: !usesWhey })
  const toggleDiet   = () => setGoals({ ...goals, dietPreference: isVeg ? 'non_veg' : 'veg' })

  const doneMeals = completedMeals?.[TODAY_KEY] || []
  const totalMeals = meals.filter(m => m.key !== 'lateNight').length
  const doneCount = doneMeals.filter(k => allowed.includes(k) && k !== 'lateNight').length
  const allDone = totalMeals > 0 && doneCount >= totalMeals


  return (
    <div className="space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Diet Plan</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {goals?.primaryGoal?.replace('_', ' ')} ·{' '}
          <span className={isVeg ? 'text-emerald-400' : 'text-orange-400'}>
            {isVeg ? '🥦 Vegetarian' : '🍗 Non-Veg'}
          </span>
        </p>
      </div>

      {/* Preferences row — always stacked to avoid overflow on any phone */}
      <div className="flex flex-col gap-2.5">
        {/* Veg / Non-veg toggle */}
        <div className="flex items-center justify-between card px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-300">
              {isVeg ? '🥦 Vegetarian meals' : '🍗 Non-Veg meals'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isVeg ? 'Tap to switch to non-veg' : 'Tap to switch to vegetarian'}
            </p>
          </div>
          <button
            onClick={toggleDiet}
            className={`tap-compact relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ml-4 ${isVeg ? 'bg-emerald-600' : 'bg-surface-600'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isVeg ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Whey toggle */}
        <div className="flex items-center justify-between card px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-gray-300">🥤 Whey Protein</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {usesWhey ? 'Meals include whey scoops' : 'Whole food protein only'}
            </p>
          </div>
          <button
            onClick={toggleWhey}
            className={`tap-compact relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ml-4 ${usesWhey ? 'bg-brand-600' : 'bg-surface-600'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${usesWhey ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Daily progress bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-300">Today's meals</p>
          <p className="text-sm font-bold text-white">
            {doneCount}
            <span className="text-gray-500 font-normal"> / {totalMeals} eaten</span>
          </p>
        </div>
        <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              allDone
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-brand-600 to-cyan-500'
            }`}
            style={{ width: `${totalMeals > 0 ? (doneCount / totalMeals) * 100 : 0}%` }}
          />
        </div>
        {allDone && (
          <p className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} /> All meals completed today — great work!
          </p>
        )}
      </div>

      {/* Daily targets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { icon: Flame,    label: 'Daily Calories',  value: `~${dietPlan.targetCalories} kcal`,  color: 'text-orange-400' },
          { icon: Zap,      label: 'Min. Protein',    value: `${dietPlan.targetProtein}/day`,      color: 'text-brand-400' },
          { icon: Droplets, label: 'Hydration',       value: '3–4 L water',                        color: 'text-cyan-400' },
          { icon: Salad,    label: 'Meals / Day',     value: `${meals.length} meals`,              color: 'text-emerald-400' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card p-3.5">
              <Icon size={16} className={stat.color + ' mb-2'} />
              <p className="font-semibold text-white text-sm">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Meals */}
      <div className="space-y-2.5">
        {meals.map((meal) => {
          const isOpen = expandedMeal === meal.key
          const isDone = doneMeals.includes(meal.key)
          const emoji = MEAL_ICONS[meal.key] || '🍽️'
          const isOptional = meal.key === 'lateNight'

          return (
            <div
              key={meal.key}
              className={`card overflow-hidden transition-all duration-200 ${
                isDone ? 'border-emerald-500/30' : ''
              }`}
            >
              {/* Meal header */}
              <button
                onClick={() => setExpandedMeal(isOpen ? null : meal.key)}
                className="tap-compact w-full flex items-center gap-3 p-4 hover:bg-surface-700/30 active:bg-surface-700/50 transition-colors text-left"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                  isDone ? 'bg-emerald-500/20' : 'bg-surface-700'
                }`}>
                  {isDone ? '✅' : emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${isDone ? 'text-gray-400' : 'text-white'}`}>
                      {meal.label}
                    </span>
                    {isOptional && (
                      <span className="badge bg-gray-600/20 text-gray-400 text-xs px-2 py-0.5">Optional</span>
                    )}
                    {isDone && (
                      <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2 py-0.5">Eaten ✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{meal.time}</p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {meal.macros && (
                    <span className="text-xs text-orange-400">{meal.macros.cal} kcal</span>
                  )}
                  {isOpen
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />
                  }
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-surface-700 px-4 pb-4 pt-3 space-y-4 animate-fade-in">
                  <p className="text-sm font-semibold text-brand-300">{meal.name}</p>

                  {/* Food items */}
                  <div className="space-y-2">
                    {meal.items?.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mt-1.5 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Macros */}
                  {meal.macros && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-700/40 rounded-xl p-3">
                      {[
                        { label: 'Calories', value: meal.macros.cal + ' kcal', color: 'text-orange-400' },
                        { label: 'Protein',  value: meal.macros.protein,        color: 'text-brand-400' },
                        { label: 'Carbs',    value: meal.macros.carbs,          color: 'text-yellow-400' },
                        { label: 'Fat',      value: meal.macros.fat,            color: 'text-pink-400' },
                      ].map(m => (
                        <div key={m.label} className="text-center py-1">
                          <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tip */}
                  {meal.tip && (
                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-surface-700/30 rounded-lg p-3">
                      <span className="flex-shrink-0">💡</span>
                      <p>{meal.tip}</p>
                    </div>
                  )}

                  {/* Mark as eaten button */}
                  <button
                    onClick={() => toggleMeal(meal.key)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-surface-700/40 hover:text-gray-300 hover:border-surface-600'
                        : 'bg-brand-600/10 border-brand-500/20 text-brand-300 hover:bg-brand-600/20'
                    }`}
                  >
                    {isDone ? (
                      <><CheckCircle2 size={16} /> Mark as not eaten</>
                    ) : (
                      <><Circle size={16} /> Mark as eaten</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hydration */}
      <div className="card p-4 flex items-center gap-3">
        <Droplets size={20} className="text-cyan-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Hydration</p>
          <p className="text-xs text-gray-400 mt-0.5">{dietPlan.hydration}</p>
        </div>
      </div>

      {/* Supplements */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Pill size={16} className="text-brand-400" />
          <h3 className="font-semibold text-white text-sm">Recommended Supplements</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {(dietPlan.supplements || [])
            .filter(s => usesWhey || !/whey/i.test(s))
            .concat(!usesWhey ? ['Paneer / Greek Yogurt / Eggs — whole food protein each meal'] : [])
            .map((supp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" />
                {supp}
              </div>
            ))}
        </div>
        <p className="text-xs text-gray-600">Consult a nutritionist before starting any supplements.</p>
      </div>

      {/* Tips */}
      <div className="card p-4 space-y-3">
        <h3 className="font-semibold text-white text-sm">Nutrition Tips</h3>
        <div className="space-y-2">
          {dietPlan.tips?.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-brand-400 font-bold flex-shrink-0">→</span>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-surface-700 rounded-2xl flex items-center justify-center mb-4">
        <Salad size={28} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-white">No diet plan yet</h3>
      <p className="text-gray-400 text-sm mt-2">Complete your profile to generate a personalised plan.</p>
    </div>
  )
}
