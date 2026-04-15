import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const SESSION_KEY  = 'gtf_session'   // just { email } — who is logged in
const USER_DATA_KEY = 'gtf_user_data' // { [email]: { profile, goals, plan, ... } }

const defaultState = {
  user: null,
  profile: null,
  goals: null,
  plan: null,
  milestones: null,
  completedExercises: {},
  completedMeals: {},
  proteinLog: {},
}

// Load the last session + the logged-in user's data
function load() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    if (!session?.email) return defaultState
    const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
    const userData = allData[session.email] || {}
    return { ...defaultState, ...userData, user: session }
  } catch {
    return defaultState
  }
}

// Persist user-specific data keyed by email; keep session separately
function save(state) {
  try {
    if (state.user?.email) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state.user))
      const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
      const { user, ...userData } = state
      allData[state.user.email] = userData
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(allData))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch { /* ignore */ }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    save(state)
  }, [state])

  const setUser = (user) => setState(s => ({ ...s, user }))

  // Called on login — restores all saved data for this user
  const loginUser = (user) => {
    try {
      const allData = JSON.parse(localStorage.getItem(USER_DATA_KEY) || '{}')
      const userData = allData[user.email] || {}
      setState({ ...defaultState, ...userData, user })
    } catch {
      setState(s => ({ ...s, user }))
    }
  }

  const setProfile = (profile) => setState(s => ({ ...s, profile }))

  const setGoals = (goals) => setState(s => ({ ...s, goals }))

  const setPlan = (plan) => setState(s => ({ ...s, plan }))

  const setMilestones = (milestones) => setState(s => ({ ...s, milestones }))

  const todayKey = () => new Date().toISOString().split('T')[0]

  const toggleExercise = (dayLabel, exerciseIndex) => {
    const date = todayKey()
    setState(s => {
      const existing = s.completedExercises?.[date]?.[dayLabel] || []
      const updated = existing.includes(exerciseIndex)
        ? existing.filter(i => i !== exerciseIndex)
        : [...existing, exerciseIndex]
      return {
        ...s,
        completedExercises: {
          ...s.completedExercises,
          [date]: { ...(s.completedExercises?.[date] || {}), [dayLabel]: updated },
        },
      }
    })
  }

  const setProteinEntry = (foodId, qty) => {
    const date = todayKey()
    setState(s => {
      const today = s.proteinLog?.[date] || {}
      const updated = qty <= 0
        ? Object.fromEntries(Object.entries(today).filter(([k]) => k !== foodId))
        : { ...today, [foodId]: qty }
      return { ...s, proteinLog: { ...s.proteinLog, [date]: updated } }
    })
  }

  const toggleMeal = (mealKey) => {
    const date = todayKey()
    setState(s => {
      const existing = s.completedMeals?.[date] || []
      const updated = existing.includes(mealKey)
        ? existing.filter(k => k !== mealKey)
        : [...existing, mealKey]
      return {
        ...s,
        completedMeals: { ...s.completedMeals, [date]: updated },
      }
    })
  }

  const completeMilestone = (id) => {
    setState(s => {
      const { active, completed, nextIndex, pool } = s.milestones
      const done = active.find(m => m.id === id)
      if (!done) return s

      let replacementId = null
      let newActive = active.filter(m => m.id !== id)
      let newNextIndex = nextIndex

      if (pool && newNextIndex < pool.length) {
        replacementId = `m_${Date.now()}`
        newActive = [...newActive, { ...pool[newNextIndex], id: replacementId }]
        newNextIndex++
      }

      const newCompleted = [...completed, { ...done, completedAt: new Date().toISOString(), replacementId }]

      return {
        ...s,
        milestones: { active: newActive, completed: newCompleted, nextIndex: newNextIndex, pool }
      }
    })
  }

  const undoMilestone = (id) => {
    setState(s => {
      const { active, completed, nextIndex, pool } = s.milestones
      const entry = completed.find(m => m.id === id)
      if (!entry) return s

      const newCompleted = completed.filter(m => m.id !== id)

      // Strip the completion metadata before restoring
      const { completedAt, replacementId, ...restored } = entry

      let newActive = active
      let newNextIndex = nextIndex

      // If the replacement milestone is still untouched in active, remove it
      if (replacementId && active.find(m => m.id === replacementId)) {
        newActive = active.filter(m => m.id !== replacementId)
        newNextIndex = nextIndex - 1
      }

      // Put the original milestone back at the front of active
      newActive = [restored, ...newActive]

      return {
        ...s,
        milestones: { active: newActive, completed: newCompleted, nextIndex: newNextIndex, pool }
      }
    })
  }

  const logout = () => {
    // Only clear the session (who's logged in) — user data stays safe in USER_DATA_KEY
    localStorage.removeItem(SESSION_KEY)
    setState(defaultState)
  }

  return (
    <AppContext.Provider value={{
      ...state,
      setUser,
      loginUser,
      setProfile,
      setGoals,
      setPlan,
      setMilestones,
      completeMilestone,
      undoMilestone,
      toggleExercise,
      toggleMeal,
      setProteinEntry,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
