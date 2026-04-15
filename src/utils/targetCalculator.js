/**
 * Calculates the estimated target date based on:
 *  - goal type and weight delta
 *  - actual adherence (from logged exercises + meals)
 *
 * Each missed workout day adds a workout-penalty.
 * Each missed meal day adds a diet-penalty.
 * Both are summed to shift the target date forward.
 */

// Weekly progress rate at 100% adherence (kg / week)
const BASE_WEEKLY_RATE = {
  muscle_gain: 0.28,
  weight_loss: 0.50,
  lean:        0.30,
  bulk:        0.65,
}

// Days to extend per missed workout / per missed meal day
const WORKOUT_MISS_PENALTY_DAYS = 1.5
const DIET_MISS_PENALTY_DAYS    = 0.8

function dateKey(d) {
  return d.toISOString().split('T')[0]
}

/**
 * Returns an array of ISO date strings from `startDate` up to (not including) today.
 */
function getPastDates(startDate) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cursor = new Date(startDate)
  cursor.setHours(0, 0, 0, 0)
  while (cursor < today) {
    dates.push(dateKey(new Date(cursor)))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

/**
 * Given a day label from the workout plan (e.g. "Monday"), return whether
 * it's a rest day according to the plan.
 */
function isRestDayByLabel(workoutPlan, dateStr) {
  if (!workoutPlan?.days) return false
  const jsDay  = new Date(dateStr).getDay() // 0=Sun
  const NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const label  = NAMES[jsDay]
  const dayPlan = workoutPlan.days.find(d => d.day === label)
  return dayPlan?.isRest === true
}

export function calculateTarget(profile, goals, plan, completedExercises, completedMeals) {
  if (!profile || !goals) return null

  const { weight, createdAt } = profile
  const { primaryGoal, targetWeight } = goals
  const { workoutPlan, dietPlan } = plan || {}

  const target = parseFloat(targetWeight)
  if (!target || isNaN(target)) return null

  const weightDiff = Math.abs(target - weight)
  if (weightDiff < 0.1) return { alreadyReached: true }

  const baseRate    = BASE_WEEKLY_RATE[primaryGoal] || 0.3
  const baseWeeks   = weightDiff / baseRate
  const baseMs      = baseWeeks * 7 * 86_400_000

  // ── Adherence analysis ──────────────────────────────────────────────────
  const startDate = createdAt ? new Date(createdAt) : new Date()
  const pastDates = getPastDates(startDate)

  const totalMealsPerDay = (dietPlan?.meals?.filter(m => m.key !== 'lateNight').length) || 6
  const MIN_MEALS_FOR_ADHERENT = Math.floor(totalMealsPerDay * 0.5) // at least half

  let missedWorkoutDays = 0
  let missedDietDays    = 0
  let adherentDays      = 0
  let workoutDays       = 0  // days that were NOT rest days

  for (const date of pastDates) {
    const isRest = isRestDayByLabel(workoutPlan, date)

    if (!isRest) {
      workoutDays++
      const exerciseLogs = completedExercises?.[date] || {}
      const anyDone = Object.values(exerciseLogs).some(arr => arr.length > 0)
      if (!anyDone) missedWorkoutDays++
    }

    const mealsEaten = (completedMeals?.[date] || []).filter(k => k !== 'lateNight').length
    if (mealsEaten < MIN_MEALS_FOR_ADHERENT) missedDietDays++
    else adherentDays++
  }

  // Penalty in extra days
  const workoutPenaltyMs = missedWorkoutDays * WORKOUT_MISS_PENALTY_DAYS * 86_400_000
  const dietPenaltyMs    = missedDietDays    * DIET_MISS_PENALTY_DAYS    * 86_400_000
  const totalPenaltyMs   = workoutPenaltyMs + dietPenaltyMs

  const adjustedMs = baseMs + totalPenaltyMs

  const now = Date.now()
  const perfectDate  = new Date(now + baseMs)
  const adjustedDate = new Date(now + adjustedMs)

  // Streak: consecutive days (from today backwards) where workout+diet were both done
  let streak = 0
  const todayStr = dateKey(new Date())
  for (let i = 1; i <= 60; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dk = dateKey(d)
    const isRest = isRestDayByLabel(workoutPlan, dk)
    const exerciseLogs = completedExercises?.[dk] || {}
    const anyExDone = isRest || Object.values(exerciseLogs).some(arr => arr.length > 0)
    const mealsEaten = (completedMeals?.[dk] || []).filter(k => k !== 'lateNight').length
    const dietDone = mealsEaten >= MIN_MEALS_FOR_ADHERENT
    if (anyExDone && dietDone) streak++
    else break
  }

  const totalPenaltyDays = Math.round(totalPenaltyMs / 86_400_000)
  const totalPastDays    = pastDates.length

  return {
    alreadyReached: false,
    perfectDate,
    adjustedDate,
    baseWeeks:          Math.round(baseWeeks),
    adjustedWeeks:      Math.round(adjustedMs / (7 * 86_400_000)),
    missedWorkoutDays,
    missedDietDays,
    totalPenaltyDays,
    streak,
    totalPastDays,
    workoutDays,
    adherenceRate: totalPastDays > 0
      ? Math.round((adherentDays / totalPastDays) * 100)
      : 100,
    currentWeight: weight,
    targetWeight:  target,
    weightDiff,
    direction: target > weight ? 'gain' : 'lose',
  }
}

/**
 * Returns every day from profile.createdAt up to today (most recent first).
 */
export function getDailyLog(profile, plan, completedExercises, completedMeals) {
  const { workoutPlan, dietPlan } = plan || {}
  const totalMealsPerDay = (dietPlan?.meals?.filter(m => m.key !== 'lateNight').length) || 6
  const MIN_MEALS = Math.floor(totalMealsPerDay * 0.5)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = dateKey(today)

  // Start from signup day; fall back to today if missing
  const start = profile?.createdAt ? new Date(profile.createdAt) : new Date()
  start.setHours(0, 0, 0, 0)

  // Build list of all dates from start → today
  const allDates = []
  const cursor = new Date(start)
  while (cursor <= today) {
    allDates.push(dateKey(new Date(cursor)))
    cursor.setDate(cursor.getDate() + 1)
  }
  // Reverse so most recent day is first
  allDates.reverse()

  const days = []
  for (const dk of allDates) {
    const d = new Date(dk)
    const isToday = dk === todayStr

    const isRest = isRestDayByLabel(workoutPlan, dk)

    const exerciseLogs = completedExercises?.[dk] || {}
    const doneExercises = Object.values(exerciseLogs).reduce((sum, arr) => sum + arr.length, 0)
    const totalExercises = isRest ? 0 : (workoutPlan?.days?.find(day => {
      const jsDay = new Date(dk).getDay()
      const NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      return day.day === NAMES[jsDay]
    })?.exercises?.filter(e => e.name !== 'Complete Rest Day').length || 0)

    const mealsDone = (completedMeals?.[dk] || []).filter(k => k !== 'lateNight').length

    let workoutStatus
    if (isRest)         workoutStatus = 'rest'
    else if (isToday)   workoutStatus = doneExercises > 0 ? 'in_progress' : 'pending'
    else if (doneExercises > 0) workoutStatus = 'done'
    else                workoutStatus = 'missed'

    let dietStatus
    if (isToday)                        dietStatus = mealsDone > 0 ? 'in_progress' : 'pending'
    else if (mealsDone >= MIN_MEALS)    dietStatus = 'done'
    else if (mealsDone > 0)             dietStatus = 'partial'
    else                                dietStatus = 'missed'

    days.push({
      date: dk,
      isToday,
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      workoutStatus,
      dietStatus,
      doneExercises,
      totalExercises,
      mealsDone,
      totalMeals: totalMealsPerDay,
      isRest,
    })
  }

  return days
}
