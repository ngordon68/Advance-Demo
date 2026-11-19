import { ALLERGEN_IDS } from './allergens.js'

const ALLERGENS_KEY = 'allergy-checker:allergens'

export function loadSelectedAllergens() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ALLERGENS_KEY))
    return Array.isArray(parsed) ? parsed.filter((id) => ALLERGEN_IDS.includes(id)) : []
  } catch {
    return []
  }
}

export function saveSelectedAllergens(ids) {
  try {
    localStorage.setItem(ALLERGENS_KEY, JSON.stringify(ids))
  } catch {
    // Storage can be unavailable (private mode, blocked site data). The app still works.
  }
}

const DEVICE_ID_KEY = 'allergy-checker:device-id'

// A random ID created once per browser. It scopes Recent checks, since there is no login.
export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(DEVICE_ID_KEY, id)
    }
    return id
  } catch {
    // Without storage the ID only lasts for this page load.
    return crypto.randomUUID()
  }
}
