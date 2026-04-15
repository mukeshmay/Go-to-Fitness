import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, ChevronRight, ChevronLeft, Check, User, Target, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { generateWorkoutPlan } from '../utils/workoutGenerator'
import { generateDietPlan } from '../utils/dietGenerator'
import { generateMilestones } from '../utils/milestoneGenerator'

const STEPS = [
  { id: 1, label: 'Your Details', icon: User },
  { id: 2, label: 'Your Goals', icon: Target },
  { id: 3, label: 'Generate Plan', icon: Zap },
]

const GOALS = [
  { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪', desc: 'Build size and strength' },
  { value: 'weight_loss', label: 'Weight Loss', emoji: '🔥', desc: 'Burn fat, get fitter' },
  { value: 'lean', label: 'Lean Body', emoji: '⚡', desc: 'Tone up, stay light' },
  { value: 'bulk', label: 'Bulk Up', emoji: '🏋️', desc: 'Serious mass building' },
]

const BODY_TYPES = [
  { value: 'lean_build', label: 'Lean Build', desc: 'Long, lean physique' },
  { value: 'athletic', label: 'Athletic', desc: 'Balanced muscle + cardio' },
  { value: 'powerlifter', label: 'Powerlifter', desc: 'Max strength & size' },
]

const HEALTH_CONDITIONS = [
  'None', 'Diabetes', 'Hypertension', 'Asthma', 'Knee injury',
  'Lower back pain', 'Shoulder injury', 'Heart condition', 'Other',
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    experienceUnit: 'months',
    experienceValue: '',
    healthConditions: [],
    otherCondition: '',
  })

  const [goalData, setGoalData] = useState({
    primaryGoal: '',
    targetWeight: '',
    bodyType: 'athletic',
    dietPreference: 'non_veg',
  })

  const [errors, setErrors] = useState({})
  const { setProfile, setGoals, setPlan, setMilestones } = useApp()
  const navigate = useNavigate()

  // ── Helpers ───────────────────────────────────────────────────────────────

  const toggleCondition = (condition) => {
    setProfileData(d => {
      const list = d.healthConditions
      if (condition === 'None') return { ...d, healthConditions: ['None'] }
      const filtered = list.filter(c => c !== 'None')
      return {
        ...d,
        healthConditions: filtered.includes(condition)
          ? filtered.filter(c => c !== condition)
          : [...filtered, condition],
      }
    })
  }

  const calcExperienceMonths = () => {
    const val = parseInt(profileData.experienceValue) || 0
    return profileData.experienceUnit === 'years' ? val * 12 : val
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep1 = () => {
    const e = {}
    const age = parseInt(profileData.age)
    const weight = parseFloat(profileData.weight)
    const height = parseFloat(profileData.height)

    if (!profileData.age || isNaN(age) || age < 14 || age > 90) e.age = 'Enter a valid age (14–90).'
    if (!profileData.weight || isNaN(weight) || weight < 30 || weight > 250) e.weight = 'Enter weight in kg (30–250).'
    if (!profileData.height || isNaN(height) || height < 100 || height > 250) e.height = 'Enter height in cm (100–250).'
    if (!profileData.experienceValue) e.experienceValue = 'How long have you been working out?'
    if (profileData.healthConditions.length === 0) e.healthConditions = 'Please select at least one option.'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!goalData.primaryGoal) e.primaryGoal = 'Please select a fitness goal.'
    if (!goalData.targetWeight) e.targetWeight = 'Enter your target weight.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => s + 1)
  }

  const handleBack = () => setStep(s => s - 1)

  const handleGenerate = async () => {
    setGenerating(true)

    const experienceMonths = calcExperienceMonths()

    const profile = {
      age: parseInt(profileData.age),
      weight: parseFloat(profileData.weight),
      height: parseFloat(profileData.height),
      experienceMonths,
      healthConditions: profileData.healthConditions,
      createdAt: new Date().toISOString(),
    }

    const goals = {
      primaryGoal: goalData.primaryGoal,
      targetWeight: parseFloat(goalData.targetWeight),
      bodyType: goalData.bodyType,
      dietPreference: goalData.dietPreference,
    }

    // Simulate generation delay for UX
    await new Promise(r => setTimeout(r, 2000))

    const workoutPlan = generateWorkoutPlan(profile, goals)
    const dietPlan = generateDietPlan(profile, goals)
    const milestones = generateMilestones(experienceMonths)

    setProfile(profile)
    setGoals(goals)
    setPlan({ workoutPlan, dietPlan })
    setMilestones(milestones)

    setGenerating(false)
    setDone(true)
  }

  const goToDashboard = () => navigate('/dashboard', { replace: true })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-surface-700">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
          <Dumbbell size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg">Go-to-Fitness</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10 gap-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isActive = step === s.id
              const isDone = step > s.id
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDone ? 'bg-emerald-500' : isActive ? 'bg-brand-600 glow-blue' : 'bg-surface-700'
                    }`}>
                      {isDone ? <Check size={18} className="text-white" /> : <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500'} />}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-brand-400' : isDone ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-20 sm:w-32 h-0.5 mx-1 mb-5 transition-all duration-300 ${step > s.id ? 'bg-emerald-500' : 'bg-surface-700'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Card */}
          <div className="card p-6 sm:p-8 animate-slide-up">
            {step === 1 && <StepDetails data={profileData} onChange={setProfileData} errors={errors} toggleCondition={toggleCondition} />}
            {step === 2 && <StepGoals data={goalData} onChange={setGoalData} errors={errors} />}
            {step === 3 && <StepGenerate generating={generating} done={done} onGenerate={handleGenerate} onGo={goToDashboard} />}

            {/* Nav buttons */}
            {step < 3 && (
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button onClick={handleBack} className="btn-secondary flex items-center gap-2">
                    <ChevronLeft size={18} />
                    Back
                  </button>
                )}
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 1: Personal Details ──────────────────────────────────────────────────

function StepDetails({ data, onChange, errors, toggleCondition }) {
  const set = (key, val) => onChange(d => ({ ...d, [key]: val }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
        <p className="text-gray-400 text-sm mt-1">This helps us personalise your plan safely.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Age (years)</label>
          <input type="number" min="14" max="90" placeholder="25" value={data.age} onChange={e => set('age', e.target.value)} className="input" />
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="label">Weight (kg)</label>
          <input type="number" min="30" max="250" placeholder="70" value={data.weight} onChange={e => set('weight', e.target.value)} className="input" />
          {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="label">Height (cm)</label>
          <input type="number" min="100" max="250" placeholder="175" value={data.height} onChange={e => set('height', e.target.value)} className="input" />
          {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
        </div>
      </div>

      <div>
        <label className="label">Gym / Training Experience</label>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            placeholder="6"
            value={data.experienceValue}
            onChange={e => onChange(d => ({ ...d, experienceValue: e.target.value }))}
            className="input flex-1"
          />
          <select
            value={data.experienceUnit}
            onChange={e => onChange(d => ({ ...d, experienceUnit: e.target.value }))}
            className="input w-36"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        {errors.experienceValue && <p className="text-red-400 text-xs mt-1">{errors.experienceValue}</p>}
        <p className="text-gray-500 text-xs mt-1">Enter 0 if you're just starting.</p>
      </div>

      <div>
        <label className="label">Health Conditions / Injuries (select all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {HEALTH_CONDITIONS.map(cond => (
            <button
              key={cond}
              type="button"
              onClick={() => toggleCondition(cond)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
                data.healthConditions.includes(cond)
                  ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                  : 'bg-surface-700 border-surface-600 text-gray-400 hover:border-surface-500'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
        {errors.healthConditions && <p className="text-red-400 text-xs mt-1">{errors.healthConditions}</p>}

        {data.healthConditions.includes('Other') && (
          <input
            type="text"
            placeholder="Describe your condition..."
            value={data.otherCondition}
            onChange={e => onChange(d => ({ ...d, otherCondition: e.target.value }))}
            className="input mt-3"
          />
        )}
      </div>
    </div>
  )
}

// ── Step 2: Fitness Goals ─────────────────────────────────────────────────────

function StepGoals({ data, onChange, errors }) {
  const set = (key, val) => onChange(d => ({ ...d, [key]: val }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">What's your goal?</h2>
        <p className="text-gray-400 text-sm mt-1">Be honest — it shapes every part of your plan.</p>
      </div>

      <div>
        <label className="label">Primary Fitness Goal</label>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => set('primaryGoal', g.value)}
              className={`p-4 rounded-xl border text-left transition-all duration-150 ${
                data.primaryGoal === g.value
                  ? 'bg-brand-600/20 border-brand-500'
                  : 'bg-surface-700 border-surface-600 hover:border-surface-500'
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <p className="font-semibold text-white mt-1">{g.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>
        {errors.primaryGoal && <p className="text-red-400 text-xs mt-1">{errors.primaryGoal}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Target Weight (kg)</label>
          <input type="number" min="30" max="250" placeholder="75" value={data.targetWeight} onChange={e => set('targetWeight', e.target.value)} className="input" />
          {errors.targetWeight && <p className="text-red-400 text-xs mt-1">{errors.targetWeight}</p>}
        </div>

        <div>
          <label className="label">Preferred Body Type</label>
          <select value={data.bodyType} onChange={e => set('bodyType', e.target.value)} className="input">
            {BODY_TYPES.map(b => <option key={b.value} value={b.value}>{b.label} — {b.desc}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Diet Preference</label>
        <div className="flex gap-3">
          {[
            { value: 'veg', label: '🥦 Vegetarian', desc: 'No meat, eggs optional' },
            { value: 'non_veg', label: '🍗 Non-Vegetarian', desc: 'Includes chicken, fish, eggs' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('dietPreference', opt.value)}
              className={`flex-1 p-4 rounded-xl border text-left transition-all duration-150 ${
                data.dietPreference === opt.value
                  ? 'bg-brand-600/20 border-brand-500'
                  : 'bg-surface-700 border-surface-600 hover:border-surface-500'
              }`}
            >
              <p className="font-semibold text-white">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Generate ─────────────────────────────────────────────────────────

function StepGenerate({ generating, done, onGenerate, onGo }) {
  return (
    <div className="text-center py-8 space-y-8">
      {!done && !generating && (
        <>
          <div className="space-y-3">
            <div className="w-20 h-20 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto">
              <Zap size={36} className="text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Ready to generate your plan!</h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              We'll create a personalised 7-day workout plan, full diet plan, and 5 starter milestones — all based on your profile.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { icon: '🏋️', label: 'Workout Plan' },
              { icon: '🥗', label: 'Diet Plan' },
              { icon: '🎯', label: 'Milestones' },
            ].map(item => (
              <div key={item.label} className="bg-surface-700 rounded-xl p-4">
                <p className="text-2xl">{item.icon}</p>
                <p className="text-xs text-gray-300 font-medium mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <button onClick={onGenerate} className="btn-primary px-10 py-3.5 text-base">
            Generate My Plan
          </button>
        </>
      )}

      {generating && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto">
            <span className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Building your plan...</h2>
            <p className="text-gray-400 mt-2">Analysing your profile and creating a personalised programme.</p>
          </div>
          <div className="space-y-3 max-w-xs mx-auto text-left">
            {[
              'Analysing age & fitness level...',
              'Generating 7-day workout schedule...',
              'Building personalised diet plan...',
              'Creating starter milestones...',
            ].map((msg, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                <span className="w-4 h-4 border-2 border-brand-400/40 border-t-brand-400 rounded-full animate-spin flex-shrink-0" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && (
        <div className="space-y-6 animate-slide-up">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <Check size={36} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Your plan is ready!</h2>
            <p className="text-gray-400 mt-2">
              Everything's set up. Head to your dashboard to see your workout plan, diet plan, and milestones.
            </p>
          </div>
          <button onClick={onGo} className="btn-primary px-10 py-3.5 text-base flex items-center gap-2 mx-auto">
            Go to Dashboard
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
