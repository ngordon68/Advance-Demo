// The 9 major allergens and the ingredient words that can trigger each one.
// Matching is case-insensitive, whole-word, and allows plurals (see highlight.js).
// Multi-word phrases win over single words, so "peanut butter" is peanuts, not milk.
export const ALLERGENS = [
  {
    id: 'milk',
    label: 'Milk',
    keywords: [
      'milk', 'butter', 'buttermilk', 'cream', 'cheese', 'whey', 'casein', 'caseinate',
      'lactose', 'lactalbumin', 'lactoglobulin', 'ghee', 'yogurt', 'yoghurt', 'curd',
      'custard', 'kefir', 'paneer', 'ricotta', 'mozzarella', 'parmesan', 'milk solids',
    ],
  },
  {
    id: 'eggs',
    label: 'Eggs',
    keywords: [
      'egg', 'albumin', 'albumen', 'ovalbumin', 'ovomucoid', 'lysozyme', 'mayonnaise',
      'meringue',
    ],
  },
  {
    id: 'fish',
    label: 'Fish',
    keywords: [
      'fish', 'fish sauce', 'anchovy', 'anchovies', 'cod', 'salmon', 'tuna', 'tilapia',
      'trout', 'haddock', 'halibut', 'pollock', 'sardine', 'mackerel', 'catfish', 'bass',
      'surimi', 'worcestershire',
    ],
  },
  {
    id: 'shellfish',
    label: 'Shellfish',
    keywords: [
      'shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'crawfish',
      'langoustine', 'krill', 'scallop', 'clam', 'mussel', 'oyster',
    ],
  },
  {
    id: 'tree-nuts',
    label: 'Tree nuts',
    keywords: [
      'tree nut', 'nut', 'nut butter', 'almond', 'almond butter', 'almond flour',
      'almond milk', 'cashew', 'cashew butter', 'cashew milk', 'walnut', 'pecan',
      'pistachio', 'hazelnut', 'filbert', 'brazil nut', 'macadamia', 'pine nut',
      'praline', 'marzipan',
    ],
  },
  {
    id: 'peanuts',
    label: 'Peanuts',
    keywords: [
      'peanut', 'peanut butter', 'peanut oil', 'peanut flour', 'groundnut',
      'arachis oil', 'monkey nut',
    ],
  },
  {
    id: 'wheat',
    label: 'Wheat',
    keywords: [
      'wheat', 'flour', 'gluten', 'semolina', 'durum', 'spelt', 'farina', 'bulgur',
      'couscous', 'seitan', 'einkorn', 'emmer', 'kamut', 'breadcrumb', 'bread crumb',
    ],
  },
  {
    id: 'soy',
    label: 'Soy',
    keywords: [
      'soy', 'soya', 'soybean', 'soy lecithin', 'soy sauce', 'lecithin', 'edamame',
      'tofu', 'tempeh', 'miso', 'tamari', 'shoyu', 'textured vegetable protein',
    ],
  },
  {
    id: 'sesame',
    label: 'Sesame',
    keywords: ['sesame', 'sesame oil', 'tahini', 'benne', 'gingelly', 'halvah', 'halva'],
  },
]

// Phrases that contain a trigger word but are not that allergen.
// They are matched like keywords but never highlighted.
export const SAFE_PHRASES = [
  'cocoa butter', 'shea butter', 'rice flour', 'corn flour', 'oat flour',
  'coconut flour', 'chickpea flour', 'potato flour', 'tapioca flour',
  'buckwheat flour', 'sunflower lecithin', 'coconut milk', 'oat milk', 'rice milk',
  'cream of tartar',
]

export const ALLERGEN_IDS = ALLERGENS.map((a) => a.id)

export function allergenLabel(id) {
  return ALLERGENS.find((a) => a.id === id)?.label ?? id
}
