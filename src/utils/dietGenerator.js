// Diet plan generator — based on goal, body weight, and dietary preference (veg / non-veg)

function estimateCalories(weightKg, goal) {
  // TDEE estimate: weight × 33 for moderate activity (Harris-Benedict × 1.55)
  const tdee = Math.round(weightKg * 33)
  // Goal-specific adjustments based on research:
  // Weight loss: -500 kcal deficit (safe, ~0.5kg/week loss)
  // Lean: -200 kcal (preserve muscle, slow cut)
  // Muscle gain: +300 kcal (lean bulk, minimal fat gain)
  // Bulk: +700 kcal (aggressive surplus for max muscle)
  const adjustments = { muscle_gain: +300, weight_loss: -500, lean: -200, bulk: +700 }
  return tdee + (adjustments[goal] || 0)
}

function estimateProtein(weightKg, goal) {
  const multipliers = { muscle_gain: 2.2, weight_loss: 2.0, lean: 2.0, bulk: 2.4 }
  return Math.round(weightKg * (multipliers[goal] || 2.0))
}

// ── Meal Templates ────────────────────────────────────────────────────────────

const VEG_MEALS = {
  muscle_gain: {
    breakfast: {
      name: 'Power Oats + Protein',
      time: '7:00 – 8:00 AM',
      items: [
        '1 cup rolled oats cooked in whole milk',
        '1 scoop whey protein (chocolate or vanilla)',
        '1 banana',
        '2 tbsp peanut butter',
        '10 almonds + 5 walnuts',
      ],
      macros: { cal: 680, protein: '42g', carbs: '72g', fat: '24g' },
      tip: 'Cook oats in milk (not water) for extra protein & calories.',
    },
    midMorning: {
      name: 'Greek Yogurt Bowl',
      time: '10:30 AM',
      items: [
        '200g full-fat Greek yogurt',
        '1 tbsp honey',
        '1 tbsp chia seeds',
        'Mixed berries or apple slices',
      ],
      macros: { cal: 300, protein: '18g', carbs: '35g', fat: '8g' },
      tip: 'Chia seeds add fibre and healthy omega-3 fats.',
    },
    lunch: {
      name: 'Paneer Rice Bowl',
      time: '1:00 – 2:00 PM',
      items: [
        '1.5 cups brown rice (cooked)',
        '200g paneer (grilled or bhurji style)',
        '1 cup dal (masoor or moong)',
        '1 cup mixed vegetables (stir-fried)',
        'Salad: cucumber, tomato, onion + lemon',
        '1 cup low-fat curd',
      ],
      macros: { cal: 750, protein: '45g', carbs: '88g', fat: '18g' },
      tip: 'Paneer is one of the best vegetarian protein sources at ~18g protein per 100g.',
    },
    preWorkout: {
      name: 'Pre-Workout Fuel',
      time: '4:00 – 4:30 PM',
      items: [
        '1 banana',
        '4 dates',
        '1 cup black coffee (optional)',
      ],
      macros: { cal: 200, protein: '2g', carbs: '48g', fat: '0g' },
      tip: 'Fast carbs 30–45 min before training for an energy boost.',
    },
    postWorkout: {
      name: 'Recovery Shake + Meal',
      time: 'Within 45 min after workout',
      items: [
        '1.5 scoops whey protein in water or milk',
        '1 banana or 2 rice cakes',
        '200ml low-fat milk',
      ],
      macros: { cal: 380, protein: '40g', carbs: '42g', fat: '5g' },
      tip: 'Fast protein post-workout kicks off muscle repair.',
    },
    dinner: {
      name: 'Tofu / Paneer Sabzi + Roti',
      time: '8:00 – 9:00 PM',
      items: [
        '3 whole wheat rotis',
        '200g tofu / paneer (stir-fried with vegetables)',
        '1 cup dal or rajma',
        '1 cup salad',
        '1 cup curd',
      ],
      macros: { cal: 620, protein: '38g', carbs: '72g', fat: '14g' },
      tip: 'Eat dinner at least 2 hours before bed for optimal digestion.',
    },
    lateNight: {
      name: 'Casein Protein Snack',
      time: '10:30 PM (optional)',
      items: [
        '200g cottage cheese (paneer/low-fat)',
        'A pinch of cinnamon',
        '5 almonds',
      ],
      macros: { cal: 200, protein: '22g', carbs: '5g', fat: '8g' },
      tip: 'Casein digests slowly overnight — great for muscle recovery.',
    },
  },

  weight_loss: {
    breakfast: {
      name: 'Protein Egg-Free Breakfast',
      time: '7:00 – 8:00 AM',
      items: [
        '2 moong dal chilla (with onion, green chilli, coriander)',
        '100g Greek yogurt on the side',
        '1 cup green tea (no sugar)',
      ],
      macros: { cal: 380, protein: '22g', carbs: '42g', fat: '8g' },
      tip: 'Dal chilla is high protein, low calorie — ideal for weight loss.',
    },
    midMorning: {
      name: 'Fruit + Nuts',
      time: '10:30 AM',
      items: [
        '1 apple or pear',
        '10 almonds',
        '1 cup herbal tea',
      ],
      macros: { cal: 180, protein: '4g', carbs: '26g', fat: '8g' },
      tip: 'Almonds keep you full. Avoid high-sugar fruits.',
    },
    lunch: {
      name: 'High-Fibre Lunch Bowl',
      time: '1:00 – 2:00 PM',
      items: [
        '1 cup brown rice or 2 whole wheat rotis',
        '1 cup dal (no oil tadka)',
        '200g paneer (boiled or grilled — no fry)',
        '1 large salad bowl (cucumber, carrot, tomato, lettuce)',
        '1 cup buttermilk (chaas)',
      ],
      macros: { cal: 520, protein: '35g', carbs: '62g', fat: '10g' },
      tip: 'Eat salad FIRST to fill up on fibre before the main course.',
    },
    preWorkout: {
      name: 'Light Pre-Workout',
      time: '4:00 PM',
      items: [
        '1 small banana',
        '1 cup black coffee',
      ],
      macros: { cal: 120, protein: '1g', carbs: '28g', fat: '0g' },
      tip: 'Keep pre-workout light during weight loss phase.',
    },
    postWorkout: {
      name: 'Protein Recovery',
      time: 'Within 30 min after workout',
      items: [
        '1 scoop whey in water',
        '5 rice cakes',
      ],
      macros: { cal: 240, protein: '26g', carbs: '28g', fat: '2g' },
      tip: 'Protein in water keeps calories low post-workout.',
    },
    dinner: {
      name: 'Light Protein Dinner',
      time: '7:00 – 7:30 PM',
      items: [
        '2 whole wheat rotis',
        '1 cup sabzi (low-oil: mix veg / palak paneer / tofu bhurji)',
        '1 cup dal soup',
        '1 cup salad',
      ],
      macros: { cal: 420, protein: '28g', carbs: '52g', fat: '8g' },
      tip: 'Eat dinner early (before 8 PM) to support fat loss.',
    },
    lateNight: {
      name: 'Optional: Herbal Tea',
      time: '9:30 PM (optional)',
      items: ['1 cup chamomile or green tea', 'No sugar'],
      macros: { cal: 5, protein: '0g', carbs: '1g', fat: '0g' },
      tip: 'Avoid eating after 9 PM. Tea helps curb late-night cravings.',
    },
  },

  bulk: {
    breakfast: {
      name: 'Calorie-Dense Power Breakfast',
      time: '7:00 – 8:00 AM',
      items: [
        '2 cups oats in whole milk',
        '2 scoops whey protein',
        '2 bananas',
        '3 tbsp peanut butter',
        '2 tbsp honey',
        '15 almonds',
      ],
      macros: { cal: 1100, protein: '60g', carbs: '120g', fat: '36g' },
      tip: 'This is a serious bulk breakfast — eat it all!',
    },
    midMorning: {
      name: 'Mass Gainer Snack',
      time: '10:30 AM',
      items: [
        '200g full-fat paneer',
        '4 whole wheat bread slices with peanut butter',
        '1 glass whole milk (300ml)',
      ],
      macros: { cal: 680, protein: '42g', carbs: '62g', fat: '28g' },
      tip: 'During bulk, every meal counts toward your caloric surplus.',
    },
    lunch: {
      name: 'Heavy Carb + Protein Lunch',
      time: '1:00 – 2:00 PM',
      items: [
        '2.5 cups brown rice',
        '250g paneer (butter masala or grilled)',
        '1 cup rajma or chhole',
        '2 whole wheat rotis',
        '1 cup curd',
        'Salad',
      ],
      macros: { cal: 1050, protein: '62g', carbs: '128g', fat: '22g' },
      tip: 'This is your biggest meal of the day — eat it 2–3 hours before training.',
    },
    preWorkout: {
      name: 'Pre-Workout Energy',
      time: '4:00 PM',
      items: ['2 bananas', '2 dates', '1 cup black coffee'],
      macros: { cal: 280, protein: '3g', carbs: '66g', fat: '0g' },
      tip: 'Carb-load before heavy sessions.',
    },
    postWorkout: {
      name: 'Post-Workout Shake',
      time: 'Within 30 min after workout',
      items: ['2 scoops whey in milk', '1 banana', '2 tbsp honey'],
      macros: { cal: 520, protein: '52g', carbs: '62g', fat: '6g' },
      tip: 'Spike insulin post-workout to drive nutrients to muscles.',
    },
    dinner: {
      name: 'High-Protein Dinner',
      time: '8:00 – 9:00 PM',
      items: ['4 rotis', '300g paneer / tofu sabzi', '1 cup dal', '1 cup curd', 'Salad'],
      macros: { cal: 820, protein: '50g', carbs: '90g', fat: '20g' },
      tip: 'Don\'t skip fat sources at dinner — they support hormone production.',
    },
    lateNight: {
      name: 'Overnight Recovery',
      time: '10:30 PM',
      items: ['300g cottage cheese', '1 tbsp honey', '10 walnuts'],
      macros: { cal: 350, protein: '34g', carbs: '18g', fat: '14g' },
      tip: 'Casein + healthy fats = fuel for muscle repair all night.',
    },
  },

  lean: {
    breakfast: {
      name: 'Lean Protein Breakfast',
      time: '7:00 – 8:00 AM',
      items: ['1 cup oats in water + 1 scoop whey', '1 banana', '5 almonds'],
      macros: { cal: 420, protein: '32g', carbs: '52g', fat: '8g' },
      tip: 'Use water instead of milk to reduce calories.',
    },
    midMorning: { name: 'Greek Yogurt', time: '10:30 AM', items: ['150g Greek yogurt', '½ cup berries'], macros: { cal: 160, protein: '14g', carbs: '18g', fat: '2g' }, tip: 'Low calorie, high protein snack.' },
    lunch: { name: 'Lean Lunch', time: '1:00 PM', items: ['1 cup brown rice', '150g grilled paneer', '1 cup dal', '2 cups salad', '1 cup buttermilk'], macros: { cal: 520, protein: '38g', carbs: '58g', fat: '10g' }, tip: 'Lean = slightly less rice, more vegetables.' },
    preWorkout: { name: 'Pre-Workout', time: '4:00 PM', items: ['1 banana', 'Black coffee'], macros: { cal: 110, protein: '1g', carbs: '26g', fat: '0g' }, tip: 'Keep it minimal.' },
    postWorkout: { name: 'Post-Workout Protein', time: 'After workout', items: ['1 scoop whey in water', '1 apple'], macros: { cal: 210, protein: '26g', carbs: '28g', fat: '1g' }, tip: 'Protein without the extra carbs.' },
    dinner: { name: 'Light Protein Dinner', time: '7:30 PM', items: ['2 rotis', '150g paneer sabzi', '1 cup dal', 'Large salad'], macros: { cal: 480, protein: '32g', carbs: '54g', fat: '10g' }, tip: 'Lighter than bulk — prioritise protein over carbs.' },
    lateNight: { name: 'Optional: Curd', time: '10:00 PM', items: ['100g curd / Greek yogurt'], macros: { cal: 80, protein: '8g', carbs: '6g', fat: '2g' }, tip: 'Optional only if hungry.' },
  },
}

// Non-veg versions
const NON_VEG_MEALS = {
  muscle_gain: {
    breakfast: {
      name: 'Egg & Oat Power Breakfast',
      time: '7:00 – 8:00 AM',
      items: ['4–5 whole eggs (scrambled / boiled)', '1 cup oats in milk', '1 banana', '1 tbsp peanut butter', '1 glass milk'],
      macros: { cal: 720, protein: '52g', carbs: '68g', fat: '22g' },
      tip: 'Eggs are the gold standard for muscle-building protein. Don\'t skip the yolks.',
    },
    midMorning: { name: 'Chicken & Fruits', time: '10:30 AM', items: ['100g boiled chicken breast', '1 apple', '10 almonds'], macros: { cal: 280, protein: '26g', carbs: '22g', fat: '8g' }, tip: 'Lean protein mid-morning keeps muscle synthesis elevated.' },
    lunch: {
      name: 'Chicken Rice Bowl',
      time: '1:00 – 2:00 PM',
      items: ['200g grilled chicken breast', '1.5 cups brown rice', '1 cup dal / rajma', '1 cup mixed vegetables (stir-fried)', 'Salad: cucumber, tomato, onion + lemon', '1 cup low-fat curd'],
      macros: { cal: 780, protein: '62g', carbs: '82g', fat: '12g' },
      tip: 'Chicken breast is one of the leanest, highest-protein meats available.',
    },
    preWorkout: { name: 'Pre-Workout Carbs', time: '4:00 PM', items: ['1 banana', '4 dates', 'Black coffee (optional)'], macros: { cal: 200, protein: '2g', carbs: '48g', fat: '0g' }, tip: 'Fast carbs 30–45 min before training.' },
    postWorkout: { name: 'Recovery Shake', time: 'Within 45 min', items: ['1.5 scoops whey in milk', '1 banana', '2 boiled eggs'], macros: { cal: 450, protein: '52g', carbs: '42g', fat: '8g' }, tip: 'Combine whey + whole eggs for complete amino acid profile.' },
    dinner: {
      name: 'Fish / Chicken Dinner',
      time: '8:00 – 9:00 PM',
      items: ['200g grilled salmon or 250g chicken curry', '3 whole wheat rotis or 1 cup rice', '1 cup vegetables', '1 cup salad', '1 cup curd'],
      macros: { cal: 650, protein: '52g', carbs: '68g', fat: '14g' },
      tip: 'Salmon provides omega-3 fatty acids which reduce muscle inflammation.',
    },
    lateNight: { name: 'Casein Night', time: '10:30 PM (optional)', items: ['100g cottage cheese', '2 boiled egg whites', '5 almonds'], macros: { cal: 180, protein: '26g', carbs: '4g', fat: '6g' }, tip: 'Slow-digesting proteins while you sleep.' },
  },

  weight_loss: {
    breakfast: { name: 'Egg White Omelette', time: '7:00 AM', items: ['5 egg whites + 1 whole egg omelette', 'Spinach, tomato, onion filling', '2 whole wheat toast', '1 cup green tea'], macros: { cal: 350, protein: '30g', carbs: '34g', fat: '6g' }, tip: 'Egg whites are nearly pure protein with almost no fat.' },
    midMorning: { name: 'Tuna + Crackers', time: '10:30 AM', items: ['90g canned tuna (in water)', '4 whole grain crackers', '1 cup green tea'], macros: { cal: 200, protein: '22g', carbs: '16g', fat: '2g' }, tip: 'Tuna is one of the highest protein-per-calorie foods.' },
    lunch: { name: 'Grilled Chicken Salad Lunch', time: '1:00 PM', items: ['200g grilled chicken breast', '2 whole wheat rotis', '2 cups salad', '1 cup dal soup', '1 cup buttermilk'], macros: { cal: 520, protein: '48g', carbs: '48g', fat: '8g' }, tip: 'Keep the salad large — it fills you up without adding many calories.' },
    preWorkout: { name: 'Light Pre-Workout', time: '4:00 PM', items: ['1 banana', '1 boiled egg', 'Black coffee'], macros: { cal: 160, protein: '6g', carbs: '26g', fat: '2g' }, tip: 'Minimal but enough fuel for a good session.' },
    postWorkout: { name: 'Lean Recovery', time: 'After workout', items: ['1 scoop whey in water', '4 egg whites', '1 apple'], macros: { cal: 280, protein: '38g', carbs: '24g', fat: '2g' }, tip: 'High protein, low carb post-workout for fat loss.' },
    dinner: { name: 'Grilled Fish + Veg', time: '7:00 – 7:30 PM', items: ['200g grilled tilapia or pomfret', '2 rotis', '1 cup stir-fried vegetables', '1 cup salad'], macros: { cal: 440, protein: '42g', carbs: '42g', fat: '8g' }, tip: 'Fish is lower in calories than chicken — great for cuts.' },
    lateNight: { name: 'Optional: Herbal Tea', time: '9:30 PM', items: ['1 cup green/chamomile tea'], macros: { cal: 5, protein: '0g', carbs: '1g', fat: '0g' }, tip: 'No eating after 9 PM.' },
  },

  bulk: {
    breakfast: { name: 'Bulk Egg Breakfast', time: '7:00 AM', items: ['6 whole eggs (scrambled)', '2 cups oats in whole milk', '2 bananas', '2 tbsp peanut butter', '1 glass OJ'], macros: { cal: 1200, protein: '72g', carbs: '130g', fat: '42g' }, tip: 'Whole eggs for hormones + protein. Don\'t fear the yolk.' },
    midMorning: { name: 'Mass Snack', time: '10:30 AM', items: ['200g chicken breast', '4 bread slices with peanut butter', '1 glass whole milk'], macros: { cal: 700, protein: '58g', carbs: '64g', fat: '22g' }, tip: 'Eating every 2–3 hours maximizes muscle protein synthesis.' },
    lunch: { name: 'Heavy Chicken Rice', time: '1:00 PM', items: ['250g chicken curry', '2.5 cups rice', '1 cup dal', '2 rotis', '1 cup curd', 'Salad'], macros: { cal: 1100, protein: '78g', carbs: '120g', fat: '18g' }, tip: 'Your heaviest meal. Time it 2–3 hours before training.' },
    preWorkout: { name: 'Pre-Workout Fuel', time: '4:00 PM', items: ['2 bananas', '2 boiled eggs', '1 cup black coffee'], macros: { cal: 330, protein: '12g', carbs: '54g', fat: '8g' }, tip: 'Protein + carbs before heavy lifting.' },
    postWorkout: { name: 'Post-Workout', time: 'After workout', items: ['2 scoops whey in milk', '1 banana', '4 egg whites'], macros: { cal: 560, protein: '68g', carbs: '56g', fat: '6g' }, tip: 'Maximize anabolic window — eat within 30 min of training.' },
    dinner: { name: 'Salmon + Rice Dinner', time: '8:00 PM', items: ['200g grilled salmon', '2 cups rice', '4 rotis', '1 cup vegetables', 'Salad', '1 cup curd'], macros: { cal: 900, protein: '62g', carbs: '100g', fat: '22g' }, tip: 'Salmon\'s omega-3s reduce inflammation and support recovery.' },
    lateNight: { name: 'Overnight Protein', time: '10:30 PM', items: ['200g cottage cheese', '3 boiled egg whites', '10 walnuts'], macros: { cal: 380, protein: '42g', carbs: '8g', fat: '18g' }, tip: 'Your muscles repair overnight — fuel them.' },
  },

  lean: {
    breakfast: { name: 'Lean Egg Breakfast', time: '7:00 AM', items: ['3 whole eggs + 2 egg whites', '1 cup oats in water', '1 banana'], macros: { cal: 450, protein: '34g', carbs: '48g', fat: '10g' }, tip: 'Mix whole eggs and whites for protein without too many calories.' },
    midMorning: { name: 'Chicken + Fruit', time: '10:30 AM', items: ['100g grilled chicken', '1 apple', '5 almonds'], macros: { cal: 220, protein: '22g', carbs: '18g', fat: '6g' }, tip: 'Low calorie, high protein.' },
    lunch: { name: 'Lean Chicken Bowl', time: '1:00 PM', items: ['180g grilled chicken', '1 cup rice', '1 cup dal', '2 cups salad', '1 cup buttermilk'], macros: { cal: 550, protein: '52g', carbs: '56g', fat: '8g' }, tip: 'More chicken, less rice compared to a bulk plan.' },
    preWorkout: { name: 'Pre-Workout', time: '4:00 PM', items: ['1 banana', '1 boiled egg', 'Black coffee'], macros: { cal: 160, protein: '6g', carbs: '26g', fat: '2g' }, tip: 'Minimal carbs + small protein before training.' },
    postWorkout: { name: 'Post-Workout Protein', time: 'After workout', items: ['1.5 scoops whey in water', '4 egg whites'], macros: { cal: 260, protein: '40g', carbs: '8g', fat: '2g' }, tip: 'Fast protein, low fat post-workout.' },
    dinner: { name: 'Grilled Protein Dinner', time: '7:30 PM', items: ['200g grilled fish or chicken', '2 rotis', '1 cup sabzi', '1 cup salad'], macros: { cal: 490, protein: '48g', carbs: '44g', fat: '8g' }, tip: 'Lean protein + fibrous veg = perfect lean-phase dinner.' },
    lateNight: { name: 'Optional: Eggs', time: '10:00 PM', items: ['2 boiled egg whites', '1 cup curd'], macros: { cal: 90, protein: '14g', carbs: '5g', fat: '0g' }, tip: 'Only if truly hungry.' },
  },
}

const MEAL_LABELS = {
  breakfast:   'Breakfast',
  midMorning:  'Mid-Morning Snack',
  lunch:       'Lunch',
  preWorkout:  'Pre-Workout',
  postWorkout: 'Post-Workout',
  dinner:      'Dinner',
  lateNight:   'Late Night (Optional)',
}

// Goal-specific meal counts based on nutrition science:
// Weight loss: 5 meals (no separate pre-workout or late-night to limit total calories)
// Lean: 5 meals (moderate deficit, same structure as weight loss)
// Muscle gain: 6 meals (add pre-workout window for performance)
// Bulk: 7 meals (maximum eating frequency to hit high caloric surplus)
const MEAL_ORDER_BY_GOAL = {
  weight_loss: ['breakfast', 'midMorning', 'lunch', 'postWorkout', 'dinner'],
  lean:        ['breakfast', 'midMorning', 'lunch', 'postWorkout', 'dinner'],
  muscle_gain: ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner'],
  bulk:        ['breakfast', 'midMorning', 'lunch', 'preWorkout', 'postWorkout', 'dinner', 'lateNight'],
}

export function generateDietPlan(profile, goals) {
  const { weight } = profile
  const { primaryGoal, dietPreference } = goals

  const targetCal = estimateCalories(weight, primaryGoal)
  const targetProtein = estimateProtein(weight, primaryGoal)

  const source = dietPreference === 'veg' ? VEG_MEALS : NON_VEG_MEALS
  const goalKey = primaryGoal in source ? primaryGoal : 'muscle_gain'
  const meals = source[goalKey]

  const mealOrder = MEAL_ORDER_BY_GOAL[primaryGoal] || MEAL_ORDER_BY_GOAL['muscle_gain']
  const mealList = mealOrder.map(key => ({
    key,
    label: MEAL_LABELS[key],
    ...meals[key],
  }))

  const goalTips = {
    weight_loss: [
      'Eat in a 400–500 kcal deficit — enough to lose ~0.5kg/week without muscle loss.',
      'Prioritise protein at every meal to preserve lean muscle while cutting.',
      'Eat slowly and chew thoroughly — hunger signals take 20 min to reach the brain.',
      'Track your calories with MyFitnessPal for the first 4 weeks.',
    ],
    lean: [
      'Your deficit is mild (~200 kcal) — perfect for maintaining muscle while cutting fat.',
      'Keep protein high (listed target) to retain every gram of muscle.',
      'Cardio 2–3×/week complements the small deficit for visible results.',
      'Weigh yourself weekly (not daily) to track the true trend.',
    ],
    muscle_gain: [
      'Eat in a 250–300 kcal surplus — enough to build muscle with minimal fat.',
      'Don\'t skip post-workout nutrition — it\'s the most important meal.',
      'Prioritise whole foods over protein shakes when possible.',
      'Sleep 7–9 hours — muscles grow during sleep, not in the gym.',
    ],
    bulk: [
      'You\'re in a ~700 kcal surplus — expect 0.5–1kg of weight gain per week.',
      'Hard gainers: add a glass of whole milk or an extra serving of rice if you miss calories.',
      'Track every meal the first week to make sure you\'re actually hitting your surplus.',
      'Strength increases weekly — log your lifts to confirm your diet is working.',
    ],
  }

  return {
    targetCalories: targetCal,
    targetProtein: `${targetProtein}g`,
    mealCount: mealList.length,
    dietPreference,
    meals: mealList,
    hydration: primaryGoal === 'weight_loss' || primaryGoal === 'lean'
      ? 'Drink 3–4 litres of water daily. A glass before each meal curbs appetite.'
      : 'Drink 3–4 litres of water daily. 500ml before training for performance.',
    supplements: dietPreference === 'veg'
      ? ['Whey Protein (1–2 scoops/day)', 'Creatine Monohydrate (5g/day)', 'Vitamin B12', 'Vitamin D3', 'Omega-3 (flaxseed/algae oil)']
      : ['Whey Protein (1–2 scoops/day)', 'Creatine Monohydrate (5g/day)', 'Vitamin D3', 'Omega-3 Fish Oil', 'Multivitamin'],
    tips: goalTips[primaryGoal] || goalTips['muscle_gain'],
  }
}
