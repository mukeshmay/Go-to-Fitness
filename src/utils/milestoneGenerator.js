// Pool of milestones ordered by difficulty
// The system assigns 5 active milestones. When one is completed, the next in pool replaces it.

const MILESTONE_POOL = [
  // --- Beginner Tier ---
  { title: 'Complete 5 Push-ups', desc: 'Do 5 consecutive push-ups with good form', category: 'Strength', icon: '💪', tier: 'Beginner' },
  { title: 'Hold Plank for 20s', desc: 'Maintain a plank position for 20 seconds', category: 'Core', icon: '🧘', tier: 'Beginner' },
  { title: 'Complete 15 Squats', desc: 'Perform 15 bodyweight squats in one go', category: 'Legs', icon: '🦵', tier: 'Beginner' },
  { title: 'Walk 2km Non-stop', desc: 'Walk 2 kilometers without taking a break', category: 'Cardio', icon: '🚶', tier: 'Beginner' },
  { title: 'Complete 10 Jumping Jacks', desc: '10 jumping jacks to get your heart pumping', category: 'Cardio', icon: '⭐', tier: 'Beginner' },

  // --- Early Intermediate Tier ---
  { title: 'Complete 15 Push-ups', desc: 'Do 15 consecutive push-ups', category: 'Strength', icon: '💪', tier: 'Intermediate' },
  { title: 'Hold Plank for 45s', desc: 'Hold a plank for 45 seconds straight', category: 'Core', icon: '🧘', tier: 'Intermediate' },
  { title: 'Complete 25 Squats', desc: '25 bodyweight squats without rest', category: 'Legs', icon: '🦵', tier: 'Intermediate' },
  { title: 'Jog 1km Non-stop', desc: 'Jog 1 kilometer at a steady pace', category: 'Cardio', icon: '🏃', tier: 'Intermediate' },
  { title: 'Do 3 Pull-ups', desc: 'Complete 3 consecutive pull-ups', category: 'Strength', icon: '🏋️', tier: 'Intermediate' },

  // --- Intermediate Tier ---
  { title: 'Complete 20 Push-ups', desc: '20 consecutive push-ups with proper form', category: 'Strength', icon: '💪', tier: 'Intermediate' },
  { title: 'Hold Plank for 1 Minute', desc: 'Hold a plank position for a full minute', category: 'Core', icon: '🧘', tier: 'Intermediate' },
  { title: 'Complete 30 Squats', desc: '30 squats in a single set', category: 'Legs', icon: '🦵', tier: 'Intermediate' },
  { title: 'Run 2km Non-stop', desc: 'Run 2 kilometers without walking', category: 'Cardio', icon: '🏃', tier: 'Intermediate' },
  { title: 'Do 5 Pull-ups', desc: '5 consecutive pull-ups from dead hang', category: 'Strength', icon: '🏋️', tier: 'Intermediate' },

  // --- Upper Intermediate Tier ---
  { title: 'Complete 25 Push-ups', desc: '25 push-ups in a single set', category: 'Strength', icon: '💪', tier: 'Intermediate+' },
  { title: 'Hold Plank for 90s', desc: 'Hold a plank for 1.5 minutes straight', category: 'Core', icon: '🧘', tier: 'Intermediate+' },
  { title: 'Complete 40 Squats', desc: '40 squats without stopping', category: 'Legs', icon: '🦵', tier: 'Intermediate+' },
  { title: 'Run 3km Non-stop', desc: 'Run 3 kilometers at a steady pace', category: 'Cardio', icon: '🏃', tier: 'Intermediate+' },
  { title: 'Do 8 Pull-ups', desc: '8 consecutive pull-ups from dead hang', category: 'Strength', icon: '🏋️', tier: 'Intermediate+' },

  // --- Advanced Tier ---
  { title: 'Complete 30 Push-ups', desc: '30 consecutive push-ups with good form', category: 'Strength', icon: '💪', tier: 'Advanced' },
  { title: 'Hold Plank for 2 Minutes', desc: 'Hold a plank for a full 2 minutes', category: 'Core', icon: '🧘', tier: 'Advanced' },
  { title: 'Complete 50 Squats', desc: '50 squats in one unbroken set', category: 'Legs', icon: '🦵', tier: 'Advanced' },
  { title: 'Run 5km Non-stop', desc: 'Complete a 5km run without stopping', category: 'Cardio', icon: '🏃', tier: 'Advanced' },
  { title: 'Do 10 Pull-ups', desc: '10 consecutive pull-ups from dead hang', category: 'Strength', icon: '🏋️', tier: 'Advanced' },

  // --- Elite Tier ---
  { title: 'Complete 50 Push-ups', desc: '50 consecutive push-ups in one go', category: 'Strength', icon: '💪', tier: 'Elite' },
  { title: 'Hold Plank for 3 Minutes', desc: '3-minute plank — elite core strength', category: 'Core', icon: '🧘', tier: 'Elite' },
  { title: 'Complete 100 Squats', desc: '100 squats without breaking form', category: 'Legs', icon: '🦵', tier: 'Elite' },
  { title: 'Run 10km Non-stop', desc: 'A full 10km run without walking', category: 'Cardio', icon: '🏃', tier: 'Elite' },
  { title: 'Do 15 Pull-ups', desc: '15 consecutive pull-ups — elite strength', category: 'Strength', icon: '🏋️', tier: 'Elite' },
]

/**
 * Generate initial milestones based on user experience level.
 * Returns { active: [], completed: [], nextIndex: 0, pool: [] }
 */
export function generateMilestones(experienceMonths) {
  // Determine starting index based on experience
  let startIndex = 0
  if (experienceMonths >= 24) startIndex = 20  // Advanced tier
  else if (experienceMonths >= 12) startIndex = 15 // Upper intermediate
  else if (experienceMonths >= 6) startIndex = 10  // Intermediate
  else if (experienceMonths >= 2) startIndex = 5   // Early intermediate
  else startIndex = 0                               // Beginner

  // Tag each pool item with a stable id
  const pool = MILESTONE_POOL.map((m, i) => ({ ...m, id: `pool_${i}` }))

  // Pick 5 active milestones starting from startIndex
  const active = pool.slice(startIndex, startIndex + 5).map((m, i) => ({
    ...m,
    id: `m_${startIndex + i}`,
    assignedAt: new Date().toISOString(),
  }))

  return {
    active,
    completed: [],
    nextIndex: startIndex + 5,
    pool,
  }
}
