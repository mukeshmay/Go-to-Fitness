// Protein content per serving for common Indian foods
// All values sourced from standard nutritional databases (USDA / NIN India)

export const VEG_FOODS = [
  // Grains / Staples
  { id: 'roti',          name: 'Roti',              emoji: '🫓', category: 'Grains',    serving: '1 roti (~40g)',            proteinPerUnit: 3  },
  { id: 'rice',          name: 'Rice',              emoji: '🍚', category: 'Grains',    serving: '1 cup cooked (~200g)',     proteinPerUnit: 4  },
  { id: 'oats',          name: 'Oats',              emoji: '🥣', category: 'Grains',    serving: '1 cup cooked (~200g)',     proteinPerUnit: 6  },
  { id: 'quinoa',        name: 'Quinoa',            emoji: '🌾', category: 'Grains',    serving: '1 cup cooked (~185g)',     proteinPerUnit: 8  },
  { id: 'bread',         name: 'Whole Wheat Bread', emoji: '🍞', category: 'Grains',    serving: '2 slices (~60g)',          proteinPerUnit: 6  },

  // Lentils & Legumes
  { id: 'dal_moong',     name: 'Moong Dal',         emoji: '🫘', category: 'Legumes',   serving: '1 cup cooked (~200g)',     proteinPerUnit: 14 },
  { id: 'dal_masoor',    name: 'Masoor Dal',        emoji: '🫘', category: 'Legumes',   serving: '1 cup cooked (~200g)',     proteinPerUnit: 18 },
  { id: 'rajma',         name: 'Rajma',             emoji: '🫘', category: 'Legumes',   serving: '1 cup cooked (~200g)',     proteinPerUnit: 15 },
  { id: 'chhole',        name: 'Chhole / Chickpeas',emoji: '🫘', category: 'Legumes',   serving: '1 cup cooked (~200g)',     proteinPerUnit: 15 },
  { id: 'soya_chunks',   name: 'Soya Chunks',       emoji: '🟤', category: 'Legumes',   serving: '30g dry (~90g cooked)',    proteinPerUnit: 13 },
  { id: 'sprouts',       name: 'Mixed Sprouts',     emoji: '🌱', category: 'Legumes',   serving: '1 cup (~100g)',            proteinPerUnit: 8  },

  // Dairy
  { id: 'paneer',        name: 'Paneer',            emoji: '🧀', category: 'Dairy',     serving: '100g',                     proteinPerUnit: 18 },
  { id: 'greek_yogurt',  name: 'Greek Yogurt',      emoji: '🍶', category: 'Dairy',     serving: '1 cup (~200g)',            proteinPerUnit: 18 },
  { id: 'curd',          name: 'Curd / Dahi',       emoji: '🥛', category: 'Dairy',     serving: '1 cup (~200g)',            proteinPerUnit: 8  },
  { id: 'milk',          name: 'Milk',              emoji: '🥛', category: 'Dairy',     serving: '1 glass (~250ml)',         proteinPerUnit: 8  },
  { id: 'cottage_cheese',name: 'Cottage Cheese',    emoji: '🫙', category: 'Dairy',     serving: '100g',                     proteinPerUnit: 11 },

  // Soy & Alternatives
  { id: 'tofu',          name: 'Tofu',              emoji: '🫙', category: 'Soy',       serving: '100g firm',                proteinPerUnit: 8  },
  { id: 'soy_milk',      name: 'Soy Milk',          emoji: '🥛', category: 'Soy',       serving: '1 glass (~250ml)',         proteinPerUnit: 7  },

  // Nuts & Seeds
  { id: 'peanut_butter', name: 'Peanut Butter',     emoji: '🥜', category: 'Nuts',      serving: '2 tbsp (~32g)',            proteinPerUnit: 8  },
  { id: 'almonds',       name: 'Almonds',           emoji: '🌰', category: 'Nuts',      serving: '30g (~20 pieces)',         proteinPerUnit: 6  },
  { id: 'peanuts',       name: 'Peanuts / Groundnuts',emoji:'🥜',category: 'Nuts',      serving: '30g',                      proteinPerUnit: 7  },
  { id: 'chia_seeds',    name: 'Chia Seeds',        emoji: '🌰', category: 'Nuts',      serving: '2 tbsp (~28g)',            proteinPerUnit: 5  },

  // Supplements
  { id: 'whey_veg',      name: 'Whey Protein',      emoji: '🧪', category: 'Supplement',serving: '1 scoop (~30g)',           proteinPerUnit: 25 },
  { id: 'plant_protein', name: 'Plant Protein',     emoji: '🌿', category: 'Supplement',serving: '1 scoop (~30g)',           proteinPerUnit: 22 },
]

export const EXTRA_NON_VEG_FOODS = [
  // Eggs
  { id: 'egg_whole',     name: 'Whole Egg',         emoji: '🥚', category: 'Eggs',      serving: '1 egg (~55g)',             proteinPerUnit: 6  },
  { id: 'egg_white',     name: 'Egg White',         emoji: '🥚', category: 'Eggs',      serving: '1 egg white (~35g)',       proteinPerUnit: 4  },
  { id: 'boiled_eggs_3', name: 'Boiled Eggs (3)',   emoji: '🥚', category: 'Eggs',      serving: '3 eggs (~165g)',           proteinPerUnit: 18 },

  // Poultry
  { id: 'chicken_breast',name: 'Chicken Breast',    emoji: '🍗', category: 'Poultry',   serving: '100g grilled',             proteinPerUnit: 31 },
  { id: 'chicken_thigh', name: 'Chicken Thigh',     emoji: '🍗', category: 'Poultry',   serving: '100g cooked',              proteinPerUnit: 25 },
  { id: 'tandoori',      name: 'Tandoori Chicken',  emoji: '🍗', category: 'Poultry',   serving: '1 serving (~200g)',        proteinPerUnit: 44 },

  // Meat
  { id: 'mutton',        name: 'Mutton / Goat',     emoji: '🥩', category: 'Meat',      serving: '1 serving cooked (~150g)', proteinPerUnit: 34 },
  { id: 'beef',          name: 'Beef',              emoji: '🥩', category: 'Meat',      serving: '100g cooked',              proteinPerUnit: 28 },

  // Seafood
  { id: 'fish_tilapia',  name: 'Grilled Fish',      emoji: '🐟', category: 'Seafood',   serving: '1 fillet (~150g)',         proteinPerUnit: 33 },
  { id: 'salmon',        name: 'Salmon',            emoji: '🐟', category: 'Seafood',   serving: '1 serving (~150g)',        proteinPerUnit: 33 },
  { id: 'tuna_canned',   name: 'Tuna (canned)',     emoji: '🐟', category: 'Seafood',   serving: '1 can (~90g)',             proteinPerUnit: 20 },
  { id: 'prawns',        name: 'Prawns / Shrimp',   emoji: '🦐', category: 'Seafood',   serving: '1 serving (~150g)',        proteinPerUnit: 32 },

  // Supplements (non-veg specific)
  { id: 'whey_nonveg',   name: 'Whey Protein',      emoji: '🧪', category: 'Supplement',serving: '1 scoop (~30g)',           proteinPerUnit: 25 },
]

export function getFoods(isVeg) {
  return isVeg ? VEG_FOODS : [...VEG_FOODS, ...EXTRA_NON_VEG_FOODS]
}

export function calcDailyProteinGoal(weightKg, primaryGoal) {
  const multipliers = { muscle_gain: 2.2, weight_loss: 2.0, lean: 2.0, bulk: 2.4 }
  return Math.round(weightKg * (multipliers[primaryGoal] || 2.0))
}

/**
 * Given remaining protein needed, return top suggestions (most efficient foods).
 */
export function getSuggestions(remaining, isVeg) {
  const foods = getFoods(isVeg)
  return foods
    .map(f => ({
      ...f,
      servingsNeeded: Math.ceil(remaining / f.proteinPerUnit),
      totalProtein: Math.ceil(remaining / f.proteinPerUnit) * f.proteinPerUnit,
    }))
    .sort((a, b) => a.servingsNeeded - b.servingsNeeded || b.proteinPerUnit - a.proteinPerUnit)
    .slice(0, 4)
}
