/**
 * Exercise info database — step-by-step instructions, muscles targeted,
 * common mistakes, difficulty, and YouTube search link for every exercise
 * used across the workout plans.
 */

const DB = {
  // ── CHEST ──────────────────────────────────────────────────────────────────
  'Barbell Bench Press': {
    muscles:   { primary: ['Chest (Pectoralis Major)'], secondary: ['Triceps', 'Front Deltoids'] },
    equipment: 'Barbell + Bench',
    steps: [
      'Lie flat on the bench with eyes under the bar. Grip the bar slightly wider than shoulder-width.',
      'Retract and depress your shoulder blades ("chest up, shoulders back and down").',
      'Unrack and lower the bar in a slight arc to your lower chest — touch lightly.',
      'Press the bar back up explosively, driving feet into the floor.',
      'Lock out at the top without losing tension in the chest.',
    ],
    mistakes: ['Bouncing the bar off the chest', 'Flared elbows (45-75° angle is ideal)', 'Losing shoulder blade position'],
    tip: 'Think "push the floor away with your feet" to engage your whole body.',
  },

  'Incline Dumbbell Press': {
    muscles:   { primary: ['Upper Chest'], secondary: ['Triceps', 'Front Deltoids'] },
    equipment: 'Dumbbells + Incline Bench (30–45°)',
    steps: [
      'Set bench to 30–45°. Sit back with dumbbells resting on thighs.',
      'Kick them up as you lie back; hold at shoulder height, palms forward.',
      'Press the dumbbells up and slightly in until they nearly touch at the top.',
      'Lower slowly in a controlled arc until elbows are at 90°.',
      'Pause briefly at the bottom to feel the upper-chest stretch.',
    ],
    mistakes: ['Too steep an incline (turns it into a shoulder press)', 'Letting dumbbells drift too wide', 'Rushing the eccentric'],
    tip: 'Keep your wrists stacked over your elbows throughout the movement.',
  },

  'Cable Flyes': {
    muscles:   { primary: ['Chest (Pectoralis Major)'], secondary: ['Front Deltoids', 'Biceps (stabiliser)'] },
    equipment: 'Cable Machine',
    steps: [
      'Set both pulleys to the highest position. Grab one handle in each hand.',
      'Step forward into a split stance, lean slightly forward from the hips.',
      'With a soft bend in your elbows, bring your hands together in a wide arc — like hugging a tree.',
      'Squeeze the chest hard at the centre for 1 second.',
      'Open arms back in a controlled arc until you feel a full chest stretch.',
    ],
    mistakes: ['Bending elbows too much (turns into a press)', 'Not squeezing at the peak', 'Using too much weight and losing form'],
    tip: 'Imagine you\'re trying to crack a nut between your pecs at the top.',
  },

  'Push-ups': {
    muscles:   { primary: ['Chest', 'Triceps'], secondary: ['Core', 'Front Deltoids'] },
    equipment: 'Bodyweight',
    steps: [
      'Place hands slightly wider than shoulder-width, fingers pointing forward.',
      'Extend legs fully — body should form a straight plank from head to heels.',
      'Lower your chest to just above the floor by bending your elbows (45° from body).',
      'Push explosively back up to the start. Keep hips from sagging or piking.',
    ],
    mistakes: ['Sagging hips or piked hips', 'Flared elbows', 'Partial range of motion'],
    tip: 'Brace your core as hard as you would in a plank throughout every rep.',
  },

  'Chest Dips': {
    muscles:   { primary: ['Chest (lower)'], secondary: ['Triceps', 'Front Deltoids'] },
    equipment: 'Parallel Bars / Dip Station',
    steps: [
      'Grip the bars, jump up and lock out — arms straight, shoulders depressed.',
      'Lean your torso slightly forward (30°) to shift emphasis to your chest.',
      'Lower yourself by bending your elbows until your upper arms are parallel to the floor.',
      'Push back up powerfully. Don\'t let your elbows flare out excessively.',
    ],
    mistakes: ['No forward lean (works only triceps)', 'Going too deep and impinging shoulders', 'Shrugging the shoulders'],
    tip: 'Imagine pushing the bars together as you press up.',
  },

  'Incline Push-ups': {
    muscles:   { primary: ['Chest', 'Triceps'], secondary: ['Core', 'Shoulders'] },
    equipment: 'Bench or Box',
    steps: [
      'Place hands on an elevated surface (bench, step) shoulder-width apart.',
      'Walk feet back so your body forms a straight inclined plank.',
      'Lower chest toward the surface, keeping elbows at ~45°.',
      'Press back to the start powerfully.',
    ],
    mistakes: ['Hips dropping', 'Looking up instead of keeping neutral neck'],
    tip: 'The higher the surface, the easier the exercise. Progress to flat push-ups as you get stronger.',
  },

  'Dumbbell Chest Press': {
    muscles:   { primary: ['Chest'], secondary: ['Triceps', 'Front Deltoids'] },
    equipment: 'Dumbbells + Flat Bench',
    steps: [
      'Lie flat, dumbbells held at chest level with palms facing forward.',
      'Press up until arms are extended but not fully locked.',
      'Lower slowly until elbows are just below the bench level.',
      'Keep your back flat (small natural arch only).',
    ],
    mistakes: ['Letting the weights drop too fast', 'Arching the lower back excessively'],
    tip: 'Dumbbells allow a greater range of motion than a barbell — use that advantage.',
  },

  'Decline Barbell Press': {
    muscles:   { primary: ['Lower Chest'], secondary: ['Triceps'] },
    equipment: 'Barbell + Decline Bench',
    steps: [
      'Secure feet under the leg pads on a decline bench.',
      'Grip bar slightly wider than shoulders and unrack.',
      'Lower to your lower chest (sternum area), touching lightly.',
      'Press back to start.',
    ],
    mistakes: ['Letting the bar drift to the upper chest (defeats decline angle)'],
    tip: 'Use a spotter — it\'s harder to bail safely on a decline.',
  },

  // ── BACK ───────────────────────────────────────────────────────────────────
  'Pull-ups / Chin-ups': {
    muscles:   { primary: ['Latissimus Dorsi'], secondary: ['Biceps', 'Rear Deltoids', 'Core'] },
    equipment: 'Pull-up Bar',
    steps: [
      'Hang from the bar in a full dead-hang. Hands shoulder-width (pull-up) or slightly narrower supinated (chin-up).',
      'Depress and retract your shoulder blades — "pull your shoulders into your back pockets."',
      'Drive your elbows toward your hips to bring your chin above the bar.',
      'Lower in a slow, controlled 2–3 second eccentric all the way to dead hang.',
    ],
    mistakes: ['Kipping / using momentum', 'Not achieving full dead-hang', 'Letting shoulders shrug up at the bottom'],
    tip: 'Imagine you\'re trying to touch your elbows to your rib cage — not just pulling with your hands.',
  },

  'Barbell Bent-over Row': {
    muscles:   { primary: ['Lats', 'Rhomboids', 'Traps'], secondary: ['Rear Deltoids', 'Biceps', 'Spinal Erectors'] },
    equipment: 'Barbell',
    steps: [
      'Hip-hinge until your torso is 45-60° from the floor. Brace your core hard.',
      'Grip the bar just outside shoulder-width (overhand or underhand).',
      'Pull the bar to your lower chest / upper abdomen, leading with your elbows.',
      'Squeeze your shoulder blades together hard at the top.',
      'Lower with control — don\'t let the weight pull you forward.',
    ],
    mistakes: ['Rounding the lower back', 'Pulling to the chest (too high)', 'Using bicep momentum instead of back'],
    tip: 'Think of your hands as hooks — focus on pulling your elbows back, not your hands.',
  },

  'Lat Pulldowns': {
    muscles:   { primary: ['Latissimus Dorsi'], secondary: ['Biceps', 'Rear Deltoids'] },
    equipment: 'Cable Machine + Wide Bar',
    steps: [
      'Sit with thighs secured under pads. Grip bar wider than shoulders, overhand.',
      'Lean back slightly (10–15°) and pull bar to your upper chest.',
      'Lead with your elbows, imagining pulling them into your back pockets.',
      'Hold the contraction for 1 second, then let the bar rise slowly back up.',
    ],
    mistakes: ['Leaning back too much (turns into a row)', 'Pulling behind the neck (dangerous)', 'Letting the weight stack crash'],
    tip: 'Depress your shoulder blades before you pull — this activates lats better.',
  },

  'Seated Cable Row': {
    muscles:   { primary: ['Lats', 'Rhomboids', 'Middle Traps'], secondary: ['Biceps', 'Rear Deltoids'] },
    equipment: 'Cable Machine + V-bar / Straight Bar',
    steps: [
      'Sit upright, feet on footrests, soft bend in knees. Grab the handle.',
      'Keep your torso straight and pull the handle toward your lower sternum.',
      'Squeeze shoulder blades hard at the end. Hold briefly.',
      'Return arms forward with control, letting your shoulder blades spread.',
    ],
    mistakes: ['Rocking back and forth (momentum)', 'Shrugging shoulders up', 'Not achieving full arm extension at the start'],
    tip: 'V-bar (neutral grip) is generally more comfortable and allows greater back activation.',
  },

  'Face Pulls': {
    muscles:   { primary: ['Rear Deltoids', 'Rotator Cuff'], secondary: ['Middle Traps', 'Rhomboids'] },
    equipment: 'Cable Machine + Rope Attachment',
    steps: [
      'Set the pulley to forehead height. Grab the rope with thumbs facing back.',
      'Pull the rope toward your face, splitting it so each side goes past your ears.',
      'Externally rotate at the end — elbows should be at or above shoulder height.',
      'Hold 1 second. Return slowly.',
    ],
    mistakes: ['Pulling too low (becomes a row)', 'Not externally rotating', 'Using too much weight'],
    tip: 'Face pulls are one of the best exercises for shoulder health — don\'t neglect them.',
  },

  'T-bar Row': {
    muscles:   { primary: ['Lats', 'Rhomboids', 'Traps'], secondary: ['Rear Deltoids', 'Biceps'] },
    equipment: 'T-bar Machine or Landmine',
    steps: [
      'Stand over the bar, chest supported (if using chest-supported version) or in a hip-hinge.',
      'Use a close neutral grip on the handles. Pull the bar toward your chest.',
      'Drive elbows back past your body — squeeze the back.',
      'Lower with control.',
    ],
    mistakes: ['Using too much weight and failing to squeeze', 'Rounding the lower back on the free-standing version'],
    tip: 'Chest-supported version reduces lower back stress — great for beginners.',
  },

  'Single-arm Cable Row': {
    muscles:   { primary: ['Lats', 'Rhomboids'], secondary: ['Rear Deltoids', 'Biceps'] },
    equipment: 'Cable Machine',
    steps: [
      'Set pulley to about waist height. Stand facing the machine, soft knees.',
      'Pull with one hand toward your hip, rotating your torso slightly.',
      'Fully extend your arm back and feel the full stretch before each rep.',
    ],
    mistakes: ['Not getting full range of motion on the stretch'],
    tip: 'Allow slight trunk rotation for a fuller range — this is functional and intentional.',
  },

  'Straight-arm Pulldown': {
    muscles:   { primary: ['Latissimus Dorsi'], secondary: ['Serratus Anterior', 'Triceps'] },
    equipment: 'Cable Machine + Straight Bar or Rope',
    steps: [
      'Stand facing a high cable pulley, arm extended overhead.',
      'Keeping arms straight, pull the bar down in a wide arc to your thighs.',
      'Squeeze lats hard at the bottom. Hold 1 second.',
      'Return slowly — control every inch.',
    ],
    mistakes: ['Bending elbows (defeats the purpose)', 'Leaning forward excessively'],
    tip: 'Great as a lat finisher at the end of a back session.',
  },

  'Dumbbell Row': {
    muscles:   { primary: ['Lats', 'Rhomboids'], secondary: ['Biceps', 'Rear Deltoids'] },
    equipment: 'Dumbbell + Bench',
    steps: [
      'Place one hand and knee on a flat bench for support. Back flat, parallel to floor.',
      'Let the dumbbell hang at arm\'s length. Pull it to your hip by driving the elbow back.',
      'Squeeze your back at the top. Lower fully to the dead hang.',
    ],
    mistakes: ['Rotating the torso excessively', 'Not achieving full arm extension at the bottom'],
    tip: 'Heavy rows with full range of motion build serious lat thickness.',
  },

  // ── LEGS ───────────────────────────────────────────────────────────────────
  'Barbell Back Squat': {
    muscles:   { primary: ['Quadriceps', 'Glutes'], secondary: ['Hamstrings', 'Core', 'Spinal Erectors', 'Calves'] },
    equipment: 'Barbell + Squat Rack',
    steps: [
      'Set bar on the traps (high-bar) or rear delts (low-bar). Brace your core.',
      'Step out, feet shoulder-width apart, toes 15-30° out.',
      'Break at the hips and knees simultaneously. Keep chest up, knees tracking toes.',
      'Descend until hip crease is BELOW the knee (parallel or below).',
      'Drive through the full foot — heel doesn\'t rise — to stand back up.',
    ],
    mistakes: ['Knees caving in (valgus collapse)', 'Good morning squat (hips rise faster than chest)', 'Heels rising off the floor'],
    tip: 'Squat in a squat rack with safety bars set — it\'s not just for beginners.',
  },

  'Romanian Deadlift': {
    muscles:   { primary: ['Hamstrings', 'Glutes'], secondary: ['Spinal Erectors', 'Core'] },
    equipment: 'Barbell or Dumbbells',
    steps: [
      'Stand with bar at hip height. Hold just outside your thighs, overhand grip.',
      'Push your hips back (not down). Keep the bar dragging down your legs.',
      'Lower until you feel a strong hamstring stretch — typically mid-shin level.',
      'Drive your hips forward to stand. Squeeze glutes at the top.',
    ],
    mistakes: ['Rounding the lower back', 'Bending the knees too much (becomes a deadlift)', 'Bar drifting away from the body'],
    tip: 'Think "hip hinge" not "bend over." Your shins should stay vertical.',
  },

  'Leg Press': {
    muscles:   { primary: ['Quadriceps', 'Glutes'], secondary: ['Hamstrings', 'Calves'] },
    equipment: 'Leg Press Machine',
    steps: [
      'Sit in the machine, back flat against the pad. Place feet shoulder-width at mid-platform.',
      'Release the safety handles and lower the platform toward your chest by bending knees.',
      'Stop when knees are at 90° (or lower if flexibility allows).',
      'Push through the full foot to extend — don\'t lock out hard at the top.',
    ],
    mistakes: ['Letting lower back round off the pad at the bottom', 'Locking knees hard at the top', 'Feet too high (reduces quad work) or too low (strains knees)'],
    tip: 'Higher foot placement = more glutes. Lower = more quads.',
  },

  'Leg Curl': {
    muscles:   { primary: ['Hamstrings'], secondary: ['Calves'] },
    equipment: 'Leg Curl Machine',
    steps: [
      'Lie face down, position pad just above the heels.',
      'Curl the pad toward your glutes as far as possible.',
      'Hold the contraction for 1 second at the top.',
      'Lower slowly — 3-second eccentric for maximum stimulus.',
    ],
    mistakes: ['Raising hips off the pad to cheat reps', 'Not achieving full range of motion'],
    tip: 'Point your toes slightly inward to target inner hamstrings; outward for outer heads.',
  },

  'Calf Raises': {
    muscles:   { primary: ['Gastrocnemius', 'Soleus'] },
    equipment: 'Step / Machine / Smith Machine',
    steps: [
      'Stand on the edge of a step with heels hanging off.',
      'Drop heels below the step level for a full stretch.',
      'Rise as high as you can on the ball of your foot.',
      'Hold the peak contraction for 1 second.',
      'Lower with full control.',
    ],
    mistakes: ['Partial reps (most common mistake)', 'Bouncing at the bottom'],
    tip: 'Calves respond better to higher reps (15-25) than most muscles. Pause at the top every rep.',
  },

  'Bodyweight Squats': {
    muscles:   { primary: ['Quadriceps', 'Glutes'], secondary: ['Hamstrings', 'Core'] },
    equipment: 'Bodyweight',
    steps: [
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Extend arms forward for balance. Brace your core.',
      'Lower as if sitting into a chair. Keep chest up, knees tracking over toes.',
      'Aim for at least parallel (thighs horizontal). Push through heels to stand.',
    ],
    mistakes: ['Knees caving in', 'Leaning too far forward', 'Partial depth'],
    tip: 'Practice tempo squats (3 sec down) to build control and mobility.',
  },

  'Lunges': {
    muscles:   { primary: ['Quadriceps', 'Glutes'], secondary: ['Hamstrings', 'Core', 'Calves'] },
    equipment: 'Bodyweight / Dumbbells',
    steps: [
      'Stand tall. Step one foot forward a generous stride.',
      'Lower your back knee toward the floor — stop just short of touching.',
      'Push off the front foot to return to standing. Alternate legs.',
    ],
    mistakes: ['Front knee caving in', 'Torso leaning too far forward', 'Tiny step (knee goes past toes)'],
    tip: 'Look straight ahead to maintain an upright posture throughout.',
  },

  'Glute Bridge': {
    muscles:   { primary: ['Glutes'], secondary: ['Hamstrings', 'Core'] },
    equipment: 'Bodyweight / Barbell',
    steps: [
      'Lie on your back, knees bent, feet flat on the floor hip-width apart.',
      'Drive through your heels and squeeze your glutes to lift your hips.',
      'At the top your knees, hips, and shoulders should form a straight line.',
      'Pause 1-2 seconds at the top. Lower slowly.',
    ],
    mistakes: ['Arching the lower back at the top', 'Pushing through the toes rather than heels'],
    tip: 'Tuck your chin slightly throughout to keep your spine neutral.',
  },

  'Bulgarian Split Squat': {
    muscles:   { primary: ['Quadriceps', 'Glutes'], secondary: ['Hamstrings', 'Core'] },
    equipment: 'Dumbbells + Bench / Box',
    steps: [
      'Stand a stride in front of a bench. Rest the top of one foot on the bench behind you.',
      'Lower your back knee toward the floor, keeping your front shin as vertical as possible.',
      'Drive through your front heel to return to the start.',
      'Complete all reps on one side before switching.',
    ],
    mistakes: ['Standing too close to the bench (knees hurt)', 'Letting the front knee cave in'],
    tip: 'Start with bodyweight — this is deceptively hard. Add load only when form is perfect.',
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  'Military Press (Barbell)': {
    muscles:   { primary: ['Front Deltoids', 'Lateral Deltoids'], secondary: ['Triceps', 'Upper Traps', 'Core'] },
    equipment: 'Barbell',
    steps: [
      'Grip the bar just outside shoulder width. Bar rests on upper chest / front delts.',
      'Brace core hard. Press the bar straight up — tuck your head back briefly to clear it.',
      'Lock out overhead with arms fully extended, bar over your base of support.',
      'Lower to the starting position with control.',
    ],
    mistakes: ['Excessive lower back arch to cheat reps', 'Bar path drifting in front or behind', 'Flared elbows during the lift'],
    tip: 'Stand up — don\'t sit. Standing press requires more core and is more functional.',
  },

  'Dumbbell Overhead Press': {
    muscles:   { primary: ['Front Deltoids', 'Lateral Deltoids'], secondary: ['Triceps'] },
    equipment: 'Dumbbells',
    steps: [
      'Sit on a 90° bench or stand. Hold dumbbells at shoulder height, palms forward.',
      'Press up until arms are fully extended (not locked). Bring dumbbells slightly in at top.',
      'Lower back to start — elbows should be at or slightly below shoulder height.',
    ],
    mistakes: ['Pushing dumbbells forward (not up)', 'Arching the lower back'],
    tip: 'Seated is easier to control; standing adds core demand.',
  },

  'Dumbbell Lateral Raises': {
    muscles:   { primary: ['Lateral Deltoids'] },
    equipment: 'Dumbbells',
    steps: [
      'Stand with a slight lean forward, dumbbells at sides.',
      'Raise both arms simultaneously in a wide arc until parallel with the floor.',
      'Lead with your elbows, not your wrists. Think "pouring a jug" — thumbs slightly down.',
      'Lower slowly. Don\'t let the weights drop.',
    ],
    mistakes: ['Shrugging shoulders (traps take over)', 'Swinging body for momentum', 'Going above shoulder height'],
    tip: 'Lighter weight, strict form, full range — lateral raises are NOT an ego exercise.',
  },

  'Arnold Press': {
    muscles:   { primary: ['Front & Lateral Deltoids'], secondary: ['Triceps'] },
    equipment: 'Dumbbells',
    steps: [
      'Hold dumbbells at shoulder height, palms facing you (like finishing a bicep curl).',
      'As you press up, rotate your palms to face forward.',
      'Lock out overhead. Reverse the rotation as you lower — palms face you again at bottom.',
    ],
    mistakes: ['Rushing the rotation', 'Not achieving full range in either direction'],
    tip: 'Named after Arnold Schwarzenegger — the rotation hits all three delt heads.',
  },

  'Face Pulls': {
    muscles:   { primary: ['Rear Deltoids', 'Rotator Cuff'], secondary: ['Traps', 'Rhomboids'] },
    equipment: 'Cable Machine + Rope',
    steps: [
      'Set rope attachment at forehead height. Grab with both hands, thumbs toward you.',
      'Pull the rope toward your face, splitting it — hands go past your ears.',
      'Externally rotate at the end so elbows are above shoulder height.',
      'Return with control.',
    ],
    mistakes: ['Pulling below face level', 'Not rotating externally at the end'],
    tip: 'A key exercise for rotator cuff health and preventing shoulder impingement.',
  },

  'Shrugs': {
    muscles:   { primary: ['Upper Trapezius'] },
    equipment: 'Barbell / Dumbbells',
    steps: [
      'Hold weights at your sides. Stand tall.',
      'Lift shoulders straight up toward your ears as high as possible.',
      'Hold at the top for 1-2 seconds. Lower fully.',
    ],
    mistakes: ['Rolling the shoulders (risk of injury)', 'Partial range of motion'],
    tip: 'Don\'t roll — just pure up and down.',
  },

  // ── BICEPS ─────────────────────────────────────────────────────────────────
  'Barbell Bicep Curl': {
    muscles:   { primary: ['Biceps Brachii'], secondary: ['Brachialis', 'Brachioradialis'] },
    equipment: 'Barbell or EZ-bar',
    steps: [
      'Stand upright, holding the bar shoulder-width underhand grip.',
      'Pin elbows to your sides — they should not move during the curl.',
      'Curl the bar up toward your shoulders in a controlled arc.',
      'Hold the peak contraction for 1 second. Lower slowly (3-second eccentric).',
    ],
    mistakes: ['Elbows swinging forward or outward', 'Swaying the body for momentum', 'Not achieving full extension at the bottom'],
    tip: 'The eccentric (lowering) phase builds as much muscle as the concentric. Control it.',
  },

  'Dumbbell Bicep Curls': {
    muscles:   { primary: ['Biceps Brachii'] },
    equipment: 'Dumbbells',
    steps: [
      'Stand or sit. Hold dumbbells with arms fully extended, palms facing up.',
      'Curl both simultaneously (or alternate) while keeping elbows pinned to your sides.',
      'Squeeze at the top. Lower fully to the bottom.',
    ],
    mistakes: ['Swinging elbows forward', 'Supinating too early (twist at the start, not middle)'],
    tip: 'Supinate (rotate) your wrist as you curl up for maximum bicep peak contraction.',
  },

  'Hammer Curls': {
    muscles:   { primary: ['Brachialis', 'Brachioradialis'], secondary: ['Biceps Brachii'] },
    equipment: 'Dumbbells',
    steps: [
      'Hold dumbbells with a neutral grip (palms facing each other).',
      'Curl them up — thumbs pointing toward the ceiling throughout. No rotation.',
      'Squeeze at the top. Lower slowly.',
    ],
    mistakes: ['Rotating to a supinated grip (defeats the purpose)', 'Swinging with the body'],
    tip: 'Brachialis development pushes the bicep peak higher — don\'t skip hammer curls.',
  },

  'Incline Dumbbell Curl': {
    muscles:   { primary: ['Biceps Brachii (long head)'] },
    equipment: 'Dumbbells + Incline Bench (45-60°)',
    steps: [
      'Sit on an inclined bench, arms hanging straight down behind you.',
      'Curl both dumbbells simultaneously without moving the upper arm.',
      'The incline creates a stretch on the long head of the bicep — take advantage.',
    ],
    mistakes: ['Letting elbows drift forward', 'Not getting full stretch at the bottom'],
    tip: 'The stretched starting position is what makes this variation so effective.',
  },

  'Preacher Curl': {
    muscles:   { primary: ['Biceps Brachii (short head)'] },
    equipment: 'EZ-bar + Preacher Bench',
    steps: [
      'Rest upper arms on the pad. Grip bar shoulder-width.',
      'Lower the bar until arms are fully extended. Curl up to just before vertical.',
      'Don\'t lock out (takes tension off) and don\'t bring the bar all the way up (loses tension too).',
    ],
    mistakes: ['Allowing the upper arms to come off the pad', 'Using too much weight and swinging'],
    tip: 'Preacher curls isolate the short head — great for building bicep width.',
  },

  'Concentration Curls': {
    muscles:   { primary: ['Biceps Brachii'] },
    equipment: 'Dumbbell',
    steps: [
      'Sit on a bench, legs wide. Rest your elbow on your inner thigh.',
      'Let the dumbbell hang at arm\'s length. Curl slowly, squeezing hard at the top.',
      'Lower fully before the next rep.',
    ],
    mistakes: ['Moving the upper arm off the thigh', 'Rushing the movement'],
    tip: 'Arnold\'s favourite — concentrate on the contraction with every single rep.',
  },

  // ── TRICEPS ────────────────────────────────────────────────────────────────
  'Tricep Pushdowns': {
    muscles:   { primary: ['Triceps Brachii'] },
    equipment: 'Cable Machine + Straight Bar or Rope',
    steps: [
      'Stand facing a high cable pulley. Grab bar or rope with overhand grip.',
      'Pin your elbows to your sides — they don\'t move.',
      'Push the bar or rope down to full extension, squeezing triceps hard.',
      'Allow arms to return to 90° under control. Don\'t let elbows flare out.',
    ],
    mistakes: ['Elbows flaring out', 'Not achieving full extension at the bottom', 'Leaning too far forward to cheat'],
    tip: 'With the rope, spread the rope apart at the bottom for a greater peak contraction.',
  },

  'Skull Crushers': {
    muscles:   { primary: ['Triceps Brachii (long head)'] },
    equipment: 'EZ-bar + Flat Bench',
    steps: [
      'Lie flat. Hold the EZ-bar at arms\' length above your face, angled grip.',
      'Keeping upper arms vertical, lower the bar toward your forehead by bending elbows.',
      'Stop just short of the forehead. Press back up to full extension.',
    ],
    mistakes: ['Flaring elbows out', 'Upper arms drifting back (becomes an overhead extension)', 'Using too much weight'],
    tip: 'Add a close-grip press superset immediately after for a killer tricep finisher.',
  },

  'Overhead Tricep Extension': {
    muscles:   { primary: ['Triceps Brachii (long head)'] },
    equipment: 'Dumbbell / EZ-bar / Cable',
    steps: [
      'Sit or stand. Hold the weight overhead with both hands — grip above the inside plate.',
      'Keep upper arms close to your ears. Lower weight behind your head by bending elbows.',
      'Extend back up to the start — don\'t lock out hard.',
    ],
    mistakes: ['Elbows flaring wide', 'Arching the lower back excessively', 'Partial range of motion'],
    tip: 'Overhead angle maximally stretches the long head — the largest portion of the tricep.',
  },

  'Dips': {
    muscles:   { primary: ['Triceps'], secondary: ['Chest', 'Front Deltoids'] },
    equipment: 'Parallel Bars',
    steps: [
      'Grip bars, start in the locked-out position.',
      'Stay UPRIGHT — don\'t lean forward (that shifts to chest).',
      'Lower by bending elbows until forearms are parallel to the floor.',
      'Press back up strongly.',
    ],
    mistakes: ['Leaning forward for chest dips when intending tricep dips', 'Shrugging shoulders'],
    tip: 'Upright torso = triceps. Lean forward = chest. Both are valid — just intentional.',
  },

  // ── CORE ───────────────────────────────────────────────────────────────────
  'Plank': {
    muscles:   { primary: ['Transverse Abdominis', 'Rectus Abdominis'], secondary: ['Glutes', 'Shoulders', 'Quads'] },
    equipment: 'Bodyweight',
    steps: [
      'Get into a push-up position, then drop to your forearms.',
      'Body forms a straight line from head to heels. Squeeze everything — glutes, core, quads.',
      'Hold your position. Breathe normally. Don\'t let hips sag or pike.',
    ],
    mistakes: ['Hips dropping', 'Hips piked up', 'Holding breath', 'Looking up instead of down'],
    tip: 'Focus on "squeezing the juice out of your whole body" — tension everywhere.',
  },

  'Hanging Leg Raises': {
    muscles:   { primary: ['Lower Rectus Abdominis', 'Hip Flexors'], secondary: ['Obliques', 'Core'] },
    equipment: 'Pull-up Bar',
    steps: [
      'Hang from a pull-up bar with arms fully extended.',
      'Keep legs together. Raise them by flexing your hips and curling your pelvis up.',
      'Aim to bring legs to parallel or higher.',
      'Lower with control. Don\'t swing.',
    ],
    mistakes: ['Swinging with momentum', 'Not curling the pelvis (only hip flexors, no ab activation)', 'Bending knees to cheat'],
    tip: 'Round your lower back at the top — this is where the abs actually contract.',
  },

  'Crunches': {
    muscles:   { primary: ['Rectus Abdominis'] },
    equipment: 'Bodyweight',
    steps: [
      'Lie on your back, knees bent, feet flat. Hands behind ears (not head).',
      'Curl your shoulders and upper back off the floor by contracting your abs.',
      'Exhale as you crunch up. Hold for 1 second.',
      'Lower with control — don\'t flop back.',
    ],
    mistakes: ['Pulling on the neck', 'Jerking up with momentum', 'Raising the lower back off the floor'],
    tip: 'The range of motion is small — about 30°. Focus on feeling the abs contract.',
  },

  'Lying Leg Raises': {
    muscles:   { primary: ['Lower Abs', 'Hip Flexors'] },
    equipment: 'Bodyweight',
    steps: [
      'Lie flat, hands under your lower back for support.',
      'Keep legs straight. Raise them to 90° (or as high as possible).',
      'Lower until heels hover just off the floor. Don\'t touch down.',
    ],
    mistakes: ['Letting the lower back arch off the floor', 'Bending knees to make it easier'],
    tip: 'Press your lower back into the floor throughout to isolate abs over hip flexors.',
  },

  'Russian Twists': {
    muscles:   { primary: ['Obliques'], secondary: ['Rectus Abdominis', 'Hip Flexors'] },
    equipment: 'Bodyweight / Plate / Medicine Ball',
    steps: [
      'Sit on the floor, lean back ~45°, feet off the floor (or flat for beginners).',
      'Hold hands together or a weight. Rotate your torso to one side, then the other.',
      'Touch the ground (or weight) on each side — that\'s one full rep.',
    ],
    mistakes: ['Moving only the arms (not rotating the torso)', 'Losing the back angle'],
    tip: 'The key is TORSO rotation — not arm swinging. Keep your abs braced.',
  },

  'Ab Wheel Rollout': {
    muscles:   { primary: ['Entire Core', 'Serratus Anterior'], secondary: ['Triceps', 'Lats'] },
    equipment: 'Ab Wheel',
    steps: [
      'Start kneeling, hands on the wheel below your shoulders.',
      'Roll the wheel forward while hinging at the hips. Extend as far as you can without back arching.',
      'Pull the wheel back by contracting your abs — not your hip flexors.',
    ],
    mistakes: ['Letting lower back collapse', 'Pulling with hip flexors rather than abs', 'Going too far too soon'],
    tip: 'Start with partial reps. Full rollouts are extremely difficult.',
  },

  'Cable Woodchopper': {
    muscles:   { primary: ['Obliques', 'Rotational Core'] },
    equipment: 'Cable Machine',
    steps: [
      'Set cable to high position. Stand sideways to machine, feet shoulder-width.',
      'Grip handle with both hands. Pull it diagonally down and across your body to your opposite hip.',
      'Pivot back foot to allow full rotation. Control the return.',
    ],
    mistakes: ['Pulling with arms instead of rotating the torso', 'Letting the cable yank you back'],
    tip: 'Train both directions equally — high to low AND low to high.',
  },

  // ── CARDIO ─────────────────────────────────────────────────────────────────
  'Treadmill Run': {
    muscles:   { primary: ['Cardiovascular System', 'Legs'] },
    equipment: 'Treadmill',
    steps: [
      'Start at an easy walk for 2-3 minutes to warm up.',
      'Increase to your target pace. Run tall — don\'t lean too far forward.',
      'Arms should swing naturally, not crossing the body midline.',
      'Breathe rhythmically — exhale every 2-3 steps.',
    ],
    mistakes: ['Holding the handrails (defeats the purpose)', 'Landing heel-first with a long stride', 'Looking down'],
    tip: 'Zone 2 cardio (can hold a conversation) is optimal for fat burning and cardiovascular health.',
  },

  'HIIT Sprints': {
    muscles:   { primary: ['Cardiovascular System', 'Full Body'] },
    equipment: 'Treadmill / Track',
    steps: [
      'Warm up 5 minutes at easy pace.',
      'Sprint at 85-95% max effort for 20-30 seconds.',
      'Walk or jog for 30-60 seconds to recover.',
      'Repeat 6-10 rounds. Cool down 5 minutes.',
    ],
    mistakes: ['Skipping the warm-up (injury risk)', 'Not going hard enough on the work intervals', 'Too many rounds for beginners'],
    tip: 'Sprints should feel very hard. If you\'re comfortable, you\'re not sprinting.',
  },

  'Jump Rope': {
    muscles:   { primary: ['Calves', 'Cardiovascular System'], secondary: ['Shoulders', 'Core'] },
    equipment: 'Jump Rope',
    steps: [
      'Hold handles at hip height, elbows close to your sides.',
      'Rotate the rope with your wrists, not your arms.',
      'Jump with soft, bent knees — just high enough to clear the rope (~1 inch).',
      'Land on the balls of your feet.',
    ],
    mistakes: ['Jumping too high', 'Using whole arm instead of wrists', 'Stiff ankles / flat-footed landing'],
    tip: 'Start with 30-second intervals. Even 10 minutes of jump rope is a solid cardio workout.',
  },

  'Battle Ropes': {
    muscles:   { primary: ['Shoulders', 'Core', 'Cardiovascular System'], secondary: ['Arms', 'Back', 'Legs'] },
    equipment: 'Battle Ropes + Anchor',
    steps: [
      'Stand in an athletic stance, knees slightly bent, hips hinged.',
      'Hold one rope in each hand. Alternate lifting and slamming each rope for waves.',
      'Drive from your hips — this isn\'t just an arm exercise.',
    ],
    mistakes: ['Arms only — no leg / hip involvement', 'Too wide a stance (reduces power generation)'],
    tip: 'Try different patterns: alternating waves, double waves, circles, slams.',
  },
}

/**
 * Look up exercise info by name. Returns null if not found.
 * Does a case-insensitive partial match to handle slight naming differences.
 */
export function getExerciseInfo(name) {
  if (!name) return null
  const exact = DB[name]
  if (exact) return { ...exact, name }

  // Partial match fallback
  const lower = name.toLowerCase()
  const key = Object.keys(DB).find(k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower))
  return key ? { ...DB[key], name } : null
}

/**
 * Returns a YouTube search URL for the given exercise name.
 */
export function getYouTubeSearchUrl(exerciseName) {
  const query = encodeURIComponent(`how to do ${exerciseName} proper form tutorial`)
  return `https://www.youtube.com/results?search_query=${query}`
}
