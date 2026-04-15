// Workout plan generator
// Plans are tailored by: age group × goal × experience level

function getAgeGroup(age) {
  if (age <= 25) return 'young'    // 18–25
  if (age <= 35) return 'adult'    // 26–35
  if (age <= 45) return 'middle'   // 36–45
  return 'mature'                   // 46+
}

function getExperienceLevel(months) {
  if (months < 6) return 'beginner'
  if (months < 24) return 'intermediate'
  return 'advanced'
}

// ── Exercise Library ──────────────────────────────────────────────────────────

const CHEST = {
  beginner: [
    { name: 'Push-ups', sets: 3, reps: '8–12', rest: '60s', tip: 'Keep core tight; lower chest to just above floor' },
    { name: 'Incline Push-ups', sets: 3, reps: '10–15', rest: '60s', tip: 'Hands on bench, angle easier than flat' },
    { name: 'Dumbbell Chest Press', sets: 3, reps: '10–12', rest: '75s', tip: 'Light weight, focus on chest squeeze' },
  ],
  intermediate: [
    { name: 'Barbell Bench Press', sets: 4, reps: '8–10', rest: '90s', tip: 'Retract scapulae; drive feet into floor' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '10–12', rest: '75s', tip: '30–45° incline for upper chest' },
    { name: 'Cable Flyes', sets: 3, reps: '12–15', rest: '60s', tip: 'Slight bend in elbows; squeeze at centre' },
    { name: 'Chest Dips', sets: 3, reps: '8–12', rest: '75s', tip: 'Lean forward to shift work onto chest' },
  ],
  advanced: [
    { name: 'Barbell Bench Press', sets: 5, reps: '5–8', rest: '2min', tip: 'Progressive overload — log your weights' },
    { name: 'Incline Dumbbell Press', sets: 4, reps: '8–12', rest: '90s', tip: 'Pause 1s at bottom for max stretch' },
    { name: 'Weighted Chest Dips', sets: 3, reps: '8–10', rest: '90s', tip: 'Add belt weight progressively' },
    { name: 'Cable Flyes', sets: 3, reps: '15', rest: '60s', tip: 'Drop set on last set' },
    { name: 'Decline Barbell Press', sets: 3, reps: '8–10', rest: '90s', tip: 'Targets lower pec fibres' },
  ],
}

const BACK = {
  beginner: [
    { name: 'Lat Pulldowns', sets: 3, reps: '10–12', rest: '75s', tip: 'Pull bar to upper chest; elbows down' },
    { name: 'Seated Cable Row', sets: 3, reps: '10–12', rest: '75s', tip: 'Keep back straight; squeeze shoulder blades' },
    { name: 'Dumbbell Row', sets: 3, reps: '10 each', rest: '60s', tip: 'Support on bench; elbow drives back' },
  ],
  intermediate: [
    { name: 'Pull-ups / Chin-ups', sets: 4, reps: '6–10', rest: '90s', tip: 'Full dead-hang to chin over bar' },
    { name: 'Barbell Bent-over Row', sets: 4, reps: '8–10', rest: '90s', tip: 'Hinge at hips; bar to lower chest' },
    { name: 'Seated Cable Row', sets: 3, reps: '10–12', rest: '75s', tip: 'Use v-bar attachment for neutral grip' },
    { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', tip: 'Rope to forehead; externally rotate shoulders' },
  ],
  advanced: [
    { name: 'Weighted Pull-ups', sets: 5, reps: '5–8', rest: '2min', tip: 'Belt + plate; progress each week' },
    { name: 'Barbell Bent-over Row', sets: 4, reps: '6–8', rest: '2min', tip: 'Heavy; brace core hard' },
    { name: 'T-bar Row', sets: 4, reps: '8–10', rest: '90s', tip: 'Chest supported for isolation' },
    { name: 'Single-arm Cable Row', sets: 3, reps: '12 each', rest: '60s', tip: 'Full rotation for stretch' },
    { name: 'Straight-arm Pulldown', sets: 3, reps: '15', rest: '60s', tip: 'Isolates lats through full range' },
  ],
}

const LEGS = {
  beginner: [
    { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s', tip: 'Chest up; knees track over toes' },
    { name: 'Lunges', sets: 3, reps: '10 each', rest: '60s', tip: 'Step forward; back knee near floor' },
    { name: 'Glute Bridge', sets: 3, reps: '15', rest: '60s', tip: 'Drive hips up; squeeze glutes at top' },
    { name: 'Calf Raises', sets: 3, reps: '20', rest: '45s', tip: 'Full range – go up on tiptoes' },
  ],
  intermediate: [
    { name: 'Barbell Back Squat', sets: 4, reps: '8–10', rest: '2min', tip: 'Bar on traps; hip crease below parallel' },
    { name: 'Romanian Deadlift', sets: 3, reps: '10–12', rest: '90s', tip: 'Hinge back; feel hamstring stretch' },
    { name: 'Leg Press', sets: 3, reps: '12–15', rest: '90s', tip: 'Don\'t lock knees; feet shoulder-width' },
    { name: 'Leg Curl', sets: 3, reps: '12', rest: '60s', tip: 'Control the eccentric (lowering)' },
    { name: 'Calf Raises', sets: 4, reps: '20', rest: '45s', tip: 'Pause at top 1s' },
  ],
  advanced: [
    { name: 'Barbell Back Squat', sets: 5, reps: '5–6', rest: '2.5min', tip: 'Heavy — focus on bracing and depth' },
    { name: 'Bulgarian Split Squat', sets: 4, reps: '8–10 each', rest: '90s', tip: 'Rear foot elevated; front foot forward' },
    { name: 'Romanian Deadlift', sets: 4, reps: '8–10', rest: '90s', tip: 'Barbell; go heavy and controlled' },
    { name: 'Leg Press', sets: 3, reps: '15', rest: '75s', tip: 'High foot placement for glutes' },
    { name: 'Leg Curl', sets: 3, reps: '12', rest: '60s', tip: 'Drop set on last set' },
    { name: 'Seated Calf Raises', sets: 4, reps: '20', rest: '45s', tip: 'Soleus focus – different to standing' },
  ],
}

const SHOULDERS = {
  beginner: [
    { name: 'Dumbbell Overhead Press', sets: 3, reps: '10–12', rest: '75s', tip: 'Seated or standing; don\'t arch back' },
    { name: 'Lateral Raises', sets: 3, reps: '12–15', rest: '60s', tip: 'Lead with elbows; slight lean forward' },
    { name: 'Front Raises', sets: 3, reps: '12', rest: '60s', tip: 'Alternating; don\'t swing the weight' },
  ],
  intermediate: [
    { name: 'Military Press (Barbell)', sets: 4, reps: '8–10', rest: '90s', tip: 'Standing; core braced; bar path vertical' },
    { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12–15', rest: '60s', tip: 'Lean slightly; raise to shoulder height' },
    { name: 'Face Pulls', sets: 3, reps: '15', rest: '60s', tip: 'Great for rotator cuff health' },
    { name: 'Arnold Press', sets: 3, reps: '10–12', rest: '75s', tip: 'Rotate palms through the press' },
  ],
  advanced: [
    { name: 'Barbell Overhead Press', sets: 5, reps: '5–8', rest: '2min', tip: 'Push heavy; log progression' },
    { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15–20', rest: '60s', tip: 'Cable alternative on last set' },
    { name: 'Rear Delt Flyes', sets: 4, reps: '15', rest: '60s', tip: 'Pec deck or bent-over DB' },
    { name: 'Shrugs', sets: 3, reps: '12–15', rest: '60s', tip: 'Barbell or dumbbell; hold at top' },
  ],
}

const ARMS = {
  beginner: [
    { name: 'Dumbbell Bicep Curls', sets: 3, reps: '10–12', rest: '60s', tip: 'Squeeze bicep at top; control down' },
    { name: 'Hammer Curls', sets: 3, reps: '10–12', rest: '60s', tip: 'Neutral grip; works brachialis too' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12–15', rest: '60s', tip: 'Elbows pinned to sides' },
    { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '60s', tip: 'Dumbbell or EZ-bar' },
  ],
  intermediate: [
    { name: 'Barbell Bicep Curl', sets: 4, reps: '8–10', rest: '75s', tip: 'No swinging; strict form' },
    { name: 'Incline Dumbbell Curl', sets: 3, reps: '10–12', rest: '60s', tip: 'Greater stretch on bicep' },
    { name: 'Skull Crushers', sets: 4, reps: '10–12', rest: '75s', tip: 'EZ-bar to forehead; elbows stay still' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12–15', rest: '60s', tip: 'Rope attachment for full spread' },
    { name: 'Concentration Curls', sets: 3, reps: '12 each', rest: '45s', tip: 'Elbow on inner thigh; peak contraction' },
  ],
  advanced: [
    { name: 'Barbell Bicep Curl', sets: 4, reps: '8', rest: '75s', tip: 'Add weight progressively' },
    { name: 'Preacher Curl', sets: 4, reps: '10', rest: '75s', tip: 'EZ-bar; strict, no cheat' },
    { name: 'Skull Crushers', sets: 4, reps: '10', rest: '75s', tip: 'Follow with close-grip press' },
    { name: 'Weighted Dips', sets: 3, reps: '8–10', rest: '90s', tip: 'Upright torso for tricep focus' },
    { name: 'Cable Curl + Cable Pushdown superset', sets: 3, reps: '12 + 15', rest: '60s', tip: 'Superset to maximise pump' },
  ],
}

const CORE = {
  beginner: [
    { name: 'Plank', sets: 3, reps: '20–30s', rest: '45s', tip: 'Straight line head to heel; breathe' },
    { name: 'Crunches', sets: 3, reps: '15', rest: '45s', tip: 'Exhale as you crunch; hands on ears' },
    { name: 'Lying Leg Raises', sets: 3, reps: '10', rest: '45s', tip: 'Lower back stays pressed to floor' },
  ],
  intermediate: [
    { name: 'Plank', sets: 4, reps: '45–60s', rest: '45s', tip: 'Add shoulder taps for extra challenge' },
    { name: 'Hanging Knee Raises', sets: 3, reps: '12', rest: '60s', tip: 'Use pull-up bar; control the swing' },
    { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45s', tip: 'Hold a plate; rotate through spine' },
    { name: 'Ab Wheel Rollout', sets: 3, reps: '8–10', rest: '60s', tip: 'Kneel first; keep core rigid' },
  ],
  advanced: [
    { name: 'Hanging Leg Raises', sets: 4, reps: '15', rest: '60s', tip: 'Legs straight; control the eccentric' },
    { name: 'Ab Wheel Rollout', sets: 4, reps: '12', rest: '60s', tip: 'Standing rollouts for elite level' },
    { name: 'Weighted Plank', sets: 3, reps: '60s', rest: '45s', tip: 'Plate on lower back' },
    { name: 'Cable Woodchopper', sets: 3, reps: '12 each', rest: '45s', tip: 'Rotational strength for athletic power' },
  ],
}

const CARDIO = {
  beginner: [
    { name: 'Treadmill Walk', sets: 1, reps: '20 min', rest: '—', tip: 'Moderate pace; 3–4 km/h incline walk' },
    { name: 'Cycling (stationary)', sets: 1, reps: '20 min', rest: '—', tip: 'Easy resistance; steady pace' },
  ],
  intermediate: [
    { name: 'Treadmill Run', sets: 1, reps: '25 min', rest: '—', tip: 'Moderate pace: 7–8 km/h' },
    { name: 'Jump Rope', sets: 5, reps: '2 min on / 1 min off', rest: '60s', tip: 'Great calorie burn and conditioning' },
    { name: 'Rowing Machine', sets: 1, reps: '15 min', rest: '—', tip: 'Legs-hips-arms sequence; 24 SPM' },
  ],
  advanced: [
    { name: 'HIIT Sprints', sets: 8, reps: '30s sprint / 30s walk', rest: '—', tip: '85–90% max effort on sprints' },
    { name: 'Stair Climber', sets: 1, reps: '20 min', rest: '—', tip: 'High resistance; glutes and quads' },
    { name: 'Battle Ropes', sets: 5, reps: '30s', rest: '30s', tip: 'Alternating waves; full effort' },
  ],
}

const MOBILITY = [
  { name: 'Hip Flexor Stretch', sets: 1, reps: '60s each side', rest: '—', tip: 'Lunge position; sink hips low' },
  { name: 'Thoracic Rotation', sets: 1, reps: '10 each side', rest: '—', tip: 'Seated; rotate slowly through mid-back' },
  { name: 'Hamstring Stretch', sets: 1, reps: '60s each side', rest: '—', tip: 'Seated or lying; flex foot' },
  { name: 'Shoulder Cross-body Stretch', sets: 1, reps: '30s each', rest: '—', tip: 'Pull arm across chest; feel rear delt' },
  { name: 'Cat-Cow', sets: 1, reps: '10 cycles', rest: '—', tip: 'Breathe; great for lower back' },
  { name: 'World\'s Greatest Stretch', sets: 1, reps: '5 each side', rest: '—', tip: 'Lunge + rotation + reach — full body' },
]

// ── Plan Builders ────────────────────────────────────────────────────────────

function makePlan(days) {
  return days
}

function buildMuscleGain(age, level) {
  const group = getAgeGroup(age)

  if (group === 'young' || group === 'adult') {
    return makePlan([
      {
        day: 'Monday',
        label: 'Chest & Triceps',
        warmup: '5-min light cardio + arm circles',
        exercises: [...CHEST[level], ...ARMS[level].filter(e => e.name.toLowerCase().includes('tricep') || e.name.toLowerCase().includes('skull') || e.name.toLowerCase().includes('dip') || e.name.toLowerCase().includes('pushdown') || e.name.toLowerCase().includes('extension'))],
        cooldown: '5-min chest & tricep stretch',
        tags: ['Push', 'Hypertrophy'],
      },
      {
        day: 'Tuesday',
        label: 'Back & Biceps',
        warmup: '5-min rowing machine + band pull-aparts',
        exercises: [...BACK[level], ...ARMS[level].filter(e => e.name.toLowerCase().includes('curl') || e.name.toLowerCase().includes('bicep'))],
        cooldown: '5-min lat & bicep stretch',
        tags: ['Pull', 'Hypertrophy'],
      },
      {
        day: 'Wednesday',
        label: 'Legs (Quads Focus)',
        warmup: '5-min bike + leg swings + hip circles',
        exercises: LEGS[level],
        cooldown: '10-min quad, hamstring & calf stretch',
        tags: ['Legs', 'Hypertrophy'],
      },
      {
        day: 'Thursday',
        label: 'Shoulders & Core',
        warmup: '5-min cardio + shoulder rotations',
        exercises: [...SHOULDERS[level], ...CORE[level]],
        cooldown: '5-min shoulder & neck stretch',
        tags: ['Push', 'Core'],
      },
      {
        day: 'Friday',
        label: 'Full Body Compound',
        warmup: '10-min general warm-up',
        exercises: [
          BACK[level][0],
          CHEST[level][0],
          LEGS[level][0],
          SHOULDERS[level][0],
          CORE[level][0],
        ],
        cooldown: '10-min full body stretch',
        tags: ['Full Body', 'Strength'],
      },
      {
        day: 'Saturday',
        label: 'Arms & Cardio',
        warmup: '5-min light jog',
        exercises: [...ARMS[level], ...CARDIO[level]],
        cooldown: '5-min bicep & tricep stretch',
        tags: ['Arms', 'Cardio'],
      },
      {
        day: 'Sunday',
        label: 'Rest & Recovery',
        warmup: '—',
        exercises: MOBILITY,
        cooldown: '—',
        tags: ['Rest', 'Mobility'],
        isRest: true,
      },
    ])
  }

  if (group === 'middle') {
    return makePlan([
      { day: 'Monday', label: 'Upper Body (Push)', warmup: '10-min warm-up + mobility', exercises: [...CHEST[level], ...SHOULDERS[level]], cooldown: '10-min upper body stretch', tags: ['Push'] },
      { day: 'Tuesday', label: 'Lower Body', warmup: '10-min bike + leg swings', exercises: LEGS[level], cooldown: '10-min lower body stretch', tags: ['Legs'] },
      { day: 'Wednesday', label: 'Cardio & Core', warmup: '5-min easy jog', exercises: [...CARDIO[level], ...CORE[level]], cooldown: '5-min full body stretch', tags: ['Cardio', 'Core'] },
      { day: 'Thursday', label: 'Rest & Mobility', warmup: '—', exercises: MOBILITY, cooldown: '—', tags: ['Rest', 'Mobility'], isRest: true },
      { day: 'Friday', label: 'Upper Body (Pull)', warmup: '10-min warm-up + band work', exercises: [...BACK[level], ...ARMS[level]], cooldown: '10-min lat & bicep stretch', tags: ['Pull'] },
      { day: 'Saturday', label: 'Full Body Light', warmup: '10-min general warm-up', exercises: [CHEST[level][0], BACK[level][0], LEGS[level][0], CORE[level][0]], cooldown: '10-min full stretch', tags: ['Full Body'] },
      { day: 'Sunday', label: 'Rest Day', warmup: '—', exercises: MOBILITY, cooldown: '—', tags: ['Rest'], isRest: true },
    ])
  }

  // mature (46+)
  return makePlan([
    { day: 'Monday', label: 'Full Body (Moderate)', warmup: '15-min warm-up walk + mobility', exercises: [CHEST[level === 'advanced' ? 'intermediate' : level][0], BACK[level === 'advanced' ? 'intermediate' : level][0], LEGS['beginner'][0], CORE['beginner'][0]], cooldown: '15-min full stretch', tags: ['Full Body', 'Low Impact'] },
    { day: 'Tuesday', label: 'Walk & Stretch', warmup: '—', exercises: [...CARDIO['beginner'], ...MOBILITY], cooldown: '—', tags: ['Cardio', 'Mobility'], isRest: false },
    { day: 'Wednesday', label: 'Rest & Yoga', warmup: '—', exercises: MOBILITY, cooldown: '—', tags: ['Rest', 'Flexibility'], isRest: true },
    { day: 'Thursday', label: 'Upper Body (Light)', warmup: '10-min walk', exercises: [...CHEST['beginner'], ...BACK['beginner']], cooldown: '10-min stretch', tags: ['Upper Body'] },
    { day: 'Friday', label: 'Lower Body & Core', warmup: '10-min walk + hip circles', exercises: [...LEGS['beginner'], ...CORE['beginner']], cooldown: '10-min stretch', tags: ['Legs', 'Core'] },
    { day: 'Saturday', label: 'Cardio & Flexibility', warmup: '—', exercises: [...CARDIO['beginner'], ...MOBILITY], cooldown: '—', tags: ['Cardio'] },
    { day: 'Sunday', label: 'Full Rest', warmup: '—', exercises: [{ name: 'Complete Rest Day', sets: '—', reps: '—', rest: '—', tip: 'Recovery is where growth happens.' }], cooldown: '—', tags: ['Rest'], isRest: true },
  ])
}

function buildWeightLoss(age, level) {
  const group = getAgeGroup(age)
  const isOlder = group === 'middle' || group === 'mature'

  return makePlan([
    { day: 'Monday', label: 'HIIT + Upper Body', warmup: '5-min light jog', exercises: [...CARDIO[isOlder ? 'intermediate' : level], ...CHEST[level]], cooldown: '10-min stretch', tags: ['HIIT', 'Calorie Burn'] },
    { day: 'Tuesday', label: 'Legs + Cardio', warmup: '5-min bike', exercises: [...LEGS[level], ...CARDIO[isOlder ? 'beginner' : level]], cooldown: '10-min lower stretch', tags: ['Legs', 'Fat Burn'] },
    { day: 'Wednesday', label: 'Core & Active Recovery', warmup: '5-min easy walk', exercises: [...CORE[level], ...MOBILITY], cooldown: '5-min stretch', tags: ['Core', 'Recovery'] },
    { day: 'Thursday', label: 'Back + HIIT', warmup: '5-min warm-up', exercises: [...BACK[level], ...CARDIO[level]], cooldown: '10-min stretch', tags: ['Pull', 'Cardio'] },
    { day: 'Friday', label: 'Full Body Circuit', warmup: '10-min warm-up', exercises: [CHEST[level][0], BACK[level][0], LEGS[level][0], SHOULDERS[level][0], CORE[level][0]], cooldown: '10-min stretch', tags: ['Circuit', 'Fat Burn'] },
    { day: 'Saturday', label: 'Long Cardio', warmup: '5-min easy walk', exercises: [...CARDIO[level], { name: 'Outdoor Walk/Jog', sets: 1, reps: '40–60 min', rest: '—', tip: 'Steady state; Zone 2 cardio for fat burn' }], cooldown: '10-min cool-down walk', tags: ['Cardio', 'Endurance'] },
    { day: 'Sunday', label: 'Rest Day', warmup: '—', exercises: MOBILITY, cooldown: '—', tags: ['Rest'], isRest: true },
  ])
}

function buildBulk(age, level) {
  // Same structure as muscle gain but with higher volume cues
  const base = buildMuscleGain(age, level)
  return base.map(day => ({
    ...day,
    exercises: day.exercises.map(e => ({
      ...e,
      tip: e.tip + (day.isRest ? '' : ' | Bulk: eat 30 min before; prioritise compound lifts'),
    })),
    tags: [...(day.tags || []), 'Bulk'],
  }))
}

function buildLean(age, level) {
  // Lean = weight loss plan but with more resistance work
  return buildWeightLoss(age, level).map(day => ({
    ...day,
    tags: [...(day.tags || []).filter(t => t !== 'Fat Burn'), 'Lean'],
  }))
}

// ── Body type modifier ────────────────────────────────────────────────────────
// Adjusts rep ranges and rest periods based on the user's body type goal.
// lean_build  → higher reps, shorter rest (toned, defined look)
// athletic    → balanced reps and rest (performance + aesthetics)
// powerlifter → lower reps, longer rest (max strength, mass)

function applyBodyType(days, bodyType) {
  if (!bodyType || bodyType === 'athletic') return days // athletic = no change (default)

  return days.map(day => {
    if (day.isRest) return day
    return {
      ...day,
      exercises: day.exercises.map(ex => {
        if (ex.sets === '—' || ex.reps === '—') return ex // mobility/cardio — leave as-is

        let { sets, reps, rest, tip } = ex

        if (bodyType === 'lean_build') {
          // Higher reps, shorter rest → more metabolic stress, better definition
          reps = bumpReps(reps, +3)
          rest = shortenRest(rest)
          tip = tip + ' | Lean build: keep rest short, feel the burn'
        } else if (bodyType === 'powerlifter') {
          // Lower reps, heavier load, longer rest → maximal strength
          reps = lowerReps(reps, -2)
          sets = typeof sets === 'number' ? Math.min(sets + 1, 6) : sets
          rest = lengthenRest(rest)
          tip = tip + ' | Powerlifter: go heavy, log your max each week'
        }

        return { ...ex, sets, reps, rest, tip }
      }),
    }
  })
}

// ── Rep / rest helpers ────────────────────────────────────────────────────────

function bumpReps(reps, delta) {
  // "8–12" → "11–15",  "15" → "18"
  return reps.replace(/(\d+)/g, n => String(parseInt(n) + delta))
}

function lowerReps(reps, delta) {
  // "8–12" → "6–10",  "15" → "12"  (clamp at 3)
  return reps.replace(/(\d+)/g, n => String(Math.max(3, parseInt(n) + delta)))
}

function shortenRest(rest) {
  const MAP = { '2.5min': '2min', '2min': '90s', '90s': '60s', '75s': '45s', '60s': '45s', '45s': '30s' }
  return MAP[rest] || rest
}

function lengthenRest(rest) {
  const MAP = { '30s': '45s', '45s': '60s', '60s': '90s', '75s': '90s', '90s': '2min', '2min': '3min', '2.5min': '3min' }
  return MAP[rest] || rest
}

// ── Public API ───────────────────────────────────────────────────────────────

export function generateWorkoutPlan(profile, goals) {
  const { age, experienceMonths } = profile
  const { primaryGoal, bodyType } = goals

  const level = getExperienceLevel(experienceMonths)

  const planByGoal = {
    muscle_gain: () => buildMuscleGain(age, level),
    weight_loss:  () => buildWeightLoss(age, level),
    lean:         () => buildLean(age, level),
    bulk:         () => buildBulk(age, level),
  }

  const builder = planByGoal[primaryGoal] || planByGoal['muscle_gain']
  const rawDays = builder()
  const days = applyBodyType(rawDays, bodyType)

  return {
    level,
    ageGroup: getAgeGroup(age),
    bodyType: bodyType || 'athletic',
    frequency: days.filter(d => !d.isRest).length + ' days / week',
    days,
  }
}
