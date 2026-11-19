import { ALLERGEN_IDS } from './allergens.js'

const ALLERGENS_KEY = 'allergy-checker:allergens'

export function loadAllergens() {
  try {
    const saved = JSON.parse(localStorage.getItem(ALLERGENS_KEY))
    return Array.isArray(saved) ? saved.filter((id) => ALLERGEN_IDS.includes(id)) : []
  } catch {
    return []
  }
}

export function saveAllergens(allergens) {
  try {
    localStorage.setItem(ALLERGENS_KEY, JSON.stringify(allergens))
  } catch {
    // Storage may be unavailable (private mode); selection just won't persist.
  }
}
