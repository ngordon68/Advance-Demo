// Each allergen maps to the words that can trigger it. Matching is
// case-insensitive, whole-word, and allows plurals (see highlight.js).
export const ALLERGENS = [
  { id: 'milk', label: 'Milk' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'tree_nuts', label: 'Tree nuts' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'soy', label: 'Soy' },
  { id: 'sesame', label: 'Sesame' },
]

export const ALLERGEN_KEYWORDS = {
  milk: ['milk', 'butter', 'buttermilk', 'buttercream', 'cream', 'cheese', 'whey', 'casein', 'caseinate', 'lactose', 'lactalbumin', 'ghee', 'yogurt', 'yoghurt', 'curd', 'dairy'],
  eggs: ['egg', 'albumin', 'albumen', 'ovalbumin', 'lysozyme', 'mayonnaise', 'meringue', 'ovomucoid'],
  fish: ['fish', 'anchovy', 'anchovies', 'cod', 'salmon', 'tuna', 'tilapia', 'haddock', 'pollock', 'sardine', 'trout', 'bass', 'halibut', 'surimi', 'fish sauce'],
  shellfish: ['shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'crawfish', 'langoustine', 'krill', 'scampi'],
  tree_nuts: ['almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'filbert', 'macadamia', 'brazil nut', 'pine nut', 'praline', 'marzipan', 'nougat', 'gianduja'],
  peanuts: ['peanut', 'groundnut', 'arachis', 'monkey nut'],
  wheat: ['wheat', 'flour', 'gluten', 'semolina', 'durum', 'spelt', 'farina', 'bulgur', 'couscous', 'seitan', 'farro', 'einkorn', 'emmer'],
  soy: ['soy', 'soya', 'soybean', 'lecithin', 'tofu', 'edamame', 'miso', 'tempeh', 'tamari', 'natto'],
  sesame: ['sesame', 'tahini', 'tahina', 'benne', 'gingelly', 'halvah', 'halva'],
}

export const ALLERGEN_IDS = ALLERGENS.map((a) => a.id)

export function allergenLabel(id) {
  return ALLERGENS.find((a) => a.id === id)?.label ?? id
}
