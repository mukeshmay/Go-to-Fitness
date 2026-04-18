import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getFoods, calcDailyProteinGoal, getSuggestions } from '../utils/proteinData'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'

const TODAY_KEY = new Date().toISOString().split('T')[0]

const CATEGORY_ORDER = ['Eggs', 'Poultry', 'Meat', 'Seafood', 'Dairy', 'Legumes', 'Soy', 'Grains', 'Nuts', 'Supplement']

// ── Progress Ring ─────────────────────────────────────────────────────────────
function ProgressRing({ current, goal, size = 110 }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const pct = goal > 0 ? Math.min(1, current / goal) : 0
  const offset = circ - pct * circ
  const cx = size / 2

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#21262d" strokeWidth="10" />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={pct >= 1 ? '#10b981' : '#2f7ff6'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-xl font-bold text-white leading-none">{current}g</span>
        <span className="text-xs text-gray-500 mt-0.5">of {goal}g</span>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
// Parse "52g" → 52, handles numbers too
function parseProteinStr(val) {
  if (!val) return 0
  const n = parseInt(String(val).replace(/[^\d]/g, ''), 10)
  return isNaN(n) ? 0 : n
}

export default function ProteinTracker() {
  const { profile, goals, plan, proteinLog, completedMeals, setProteinEntry } = useApp()
  const [isVeg, setIsVeg] = useState(goals?.dietPreference === 'veg')
  const [expandedCat, setExpandedCat] = useState(null)

  const goal = profile && goals
    ? calcDailyProteinGoal(profile.weight, goals.primaryGoal)
    : 0

  const todayLog = proteinLog?.[TODAY_KEY] || {}
  const foods = useMemo(() => getFoods(isVeg), [isVeg])

  // Protein from manually added foods (food browser)
  const manualProtein = useMemo(() => {
    return foods.reduce((sum, food) => {
      const qty = todayLog[food.id] || 0
      return sum + qty * food.proteinPerUnit
    }, 0)
  }, [foods, todayLog])

  // Protein from meals marked as eaten in the Diet Plan
  const doneMealKeys = completedMeals?.[TODAY_KEY] || []
  const eatenMeals = useMemo(() => {
    if (!plan?.dietPlan?.meals || doneMealKeys.length === 0) return []
    return plan.dietPlan.meals
      .filter(m => doneMealKeys.includes(m.key))
      .map(m => ({
        key: m.key,
        label: m.label,
        name: m.name,
        protein: parseProteinStr(m.macros?.protein),
      }))
      .filter(m => m.protein > 0)
  }, [plan, doneMealKeys])

  const mealProtein = eatenMeals.reduce((sum, m) => sum + m.protein, 0)

  // Combined total
  const totalProtein = manualProtein + mealProtein

  const remaining = Math.max(0, goal - totalProtein)
  const suggestions = useMemo(() => getSuggestions(remaining, isVeg), [remaining, isVeg])

  // Foods that have been logged today
  const loggedFoods = foods.filter(f => todayLog[f.id] > 0)

  // Group foods by category
  const grouped = useMemo(() => {
    const map = {}
    foods.forEach(f => {
      if (!map[f.category]) map[f.category] = []
      map[f.category].push(f)
    })
    return map
  }, [foods])

  const usesWhey = goals?.usesWhey !== false  // default true for existing users
  const sortedCategories = CATEGORY_ORDER.filter(c => grouped[c] && (usesWhey || c !== 'Supplement'))

  if (!profile || !goals) return <NoProfile />

  return (
    <div className="space-y-5 animate-slide-up pb-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Protein Tracker</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Daily goal: <span className="text-brand-400 font-semibold">{goal}g</span> · Track what you eat today
        </p>
      </div>

      {/* Progress card */}
      <div className="card p-5">
        <div className="flex items-center gap-5">
          <ProgressRing current={totalProtein} goal={goal} />
          <div className="flex-1 space-y-2.5">
            <Row label="Daily goal"   value={`${goal}g`}         valueClass="text-white font-bold" />
            <Row label="Still needed" value={`${remaining}g`}    valueClass={remaining === 0 ? 'text-emerald-400 font-bold' : 'text-orange-400 font-bold'} />
          </div>
        </div>

        {/* Breakdown row */}
        {(mealProtein > 0 || manualProtein > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2.5 text-center">
              <p className="text-xs text-gray-500 mb-0.5">From meals 🥗</p>
              <p className="text-sm font-bold text-emerald-400">{mealProtein}g</p>
            </div>
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg px-3 py-2.5 text-center">
              <p className="text-xs text-gray-500 mb-0.5">From foods ⚡</p>
              <p className="text-sm font-bold text-brand-400">{manualProtein}g</p>
            </div>
          </div>
        )}

        {totalProtein >= goal && (
          <div className="mt-3 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            <span>🎉</span>
            <p className="text-emerald-400 text-sm font-medium">You've hit your protein goal today!</p>
          </div>
        )}
      </div>

      {/* Veg toggle */}
      <div className="flex items-center justify-between card px-4 py-3">
        <span className="text-sm font-medium text-gray-300">
          {isVeg ? '🥦 Showing vegetarian foods' : '🍗 Showing all foods (veg + non-veg)'}
        </span>
        <button
          onClick={() => setIsVeg(v => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isVeg ? 'bg-emerald-600' : 'bg-brand-600'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isVeg ? 'translate-x-0.5' : 'translate-x-5'}`} />
        </button>
      </div>

      {/* Today's shelf */}
      {(eatenMeals.length > 0 || loggedFoods.length > 0) && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap size={15} className="text-brand-400" /> Your Protein Shelf Today
          </h2>
          <div className="card divide-y divide-surface-700">

            {/* Meals marked as eaten */}
            {eatenMeals.length > 0 && (
              <>
                <div className="px-4 py-2 bg-emerald-500/5">
                  <p className="text-xs font-semibold text-emerald-400">From Diet Plan 🥗</p>
                </div>
                {eatenMeals.map(meal => (
                  <div key={meal.key} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl flex-shrink-0">✅</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{meal.label}</p>
                      <p className="text-xs text-gray-500 truncate">{meal.name}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{meal.protein}g</span>
                  </div>
                ))}
              </>
            )}

            {/* Manually added foods */}
            {loggedFoods.length > 0 && (
              <>
                <div className="px-4 py-2 bg-brand-500/5">
                  <p className="text-xs font-semibold text-brand-400">Manually Added ⚡</p>
                </div>
                {loggedFoods.map(food => {
                  const qty = todayLog[food.id] || 0
                  return (
                    <div key={food.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-xl flex-shrink-0">{food.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{food.name}</p>
                        <p className="text-xs text-gray-500">{qty} × {food.proteinPerUnit}g</p>
                      </div>
                      <span className="text-sm font-bold text-brand-400">{qty * food.proteinPerUnit}g</span>
                    </div>
                  )
                })}
              </>
            )}

            <div className="flex items-center justify-between px-4 py-3 bg-surface-700/30">
              <p className="text-sm font-semibold text-white">Total protein</p>
              <p className="text-sm font-bold text-white">{totalProtein}g / {goal}g goal</p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {remaining > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Ways to hit your goal</h2>
            <button
              onClick={() => setIsVeg(v => !v)}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
            >
              {isVeg ? 'Switch to non-veg' : 'Switch to veg'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {suggestions.map(s => (
              <div key={s.id} className="card p-3.5 border-brand-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{s.emoji}</span>
                  <p className="text-sm font-semibold text-white leading-tight">{s.name}</p>
                </div>
                <span className="badge bg-brand-500/20 text-brand-300 text-xs px-2 py-0.5">+{s.proteinPerUnit}g / serving</span>
                <p className="text-xs text-gray-500 mt-2">Try {s.servingsNeeded} serving{s.servingsNeeded > 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food browser by category */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white">Add foods</h2>
        <div className="space-y-2">
          {sortedCategories.map(cat => {
            const catFoods = grouped[cat]
            const isOpen = expandedCat === cat
            const catTotal = catFoods.reduce((sum, f) => sum + (todayLog[f.id] || 0) * f.proteinPerUnit, 0)

            return (
              <div key={cat} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedCat(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-700/30 active:bg-surface-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{catFoods[0].emoji}</span>
                    <span className="text-sm font-semibold text-white">{cat}</span>
                    <span className="text-xs text-gray-500">{catFoods.length} foods</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {catTotal > 0 && (
                      <span className="badge bg-brand-500/20 text-brand-300 text-xs px-2 py-0.5">{catTotal}g logged</span>
                    )}
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-surface-700 divide-y divide-surface-700/60 animate-fade-in">
                    {catFoods.map(food => {
                      const qty = todayLog[food.id] || 0
                      return (
                        <FoodRow
                          key={food.id}
                          food={food}
                          qty={qty}
                          onInc={() => setProteinEntry(food.id, qty + 1)}
                          onDec={() => setProteinEntry(food.id, Math.max(0, qty - 1))}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Food row ──────────────────────────────────────────────────────────────────
function FoodRow({ food, qty, onInc, onDec }) {
  const isAdded = qty > 0
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${isAdded ? 'bg-brand-600/5' : ''}`}>
      <span className="text-xl flex-shrink-0">{food.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{food.name}</p>
        <p className="text-xs text-gray-500">{food.serving}</p>
      </div>
      <span className={`badge text-xs px-2 py-0.5 mr-1 flex-shrink-0 ${isAdded ? 'bg-brand-500/20 text-brand-300' : 'bg-surface-600 text-gray-400'}`}>
        +{food.proteinPerUnit}g
      </span>
      {/* Quantity selector */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onDec}
          disabled={qty === 0}
          className="w-7 h-7 rounded-full bg-surface-600 hover:bg-surface-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold text-sm transition-colors active:scale-90"
        >
          −
        </button>
        <span className={`w-5 text-center text-sm font-bold ${qty > 0 ? 'text-brand-400' : 'text-gray-500'}`}>
          {qty}
        </span>
        <button
          onClick={onInc}
          className="w-7 h-7 rounded-full bg-brand-600 hover:bg-brand-500 flex items-center justify-center text-white font-bold text-sm transition-colors active:scale-90"
        >
          +
        </button>
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────
function Row({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  )
}

function NoProfile() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">🥗</span>
      <h3 className="text-lg font-semibold text-white">No profile yet</h3>
      <p className="text-gray-400 text-sm mt-2">Complete your onboarding to unlock the protein tracker.</p>
    </div>
  )
}
