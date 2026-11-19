import { useEffect, useState } from 'react'
import AllergenPicker from './components/AllergenPicker.jsx'
import IngredientInput from './components/IngredientInput.jsx'
import ResultView from './components/ResultView.jsx'
import RecentChecks from './components/RecentChecks.jsx'
import { findMatches } from './lib/highlight.js'
import { getDeviceId, loadAllergens, saveAllergens } from './lib/storage.js'
import { fetchRecentChecks, insertCheck } from './lib/supabase.js'

const deviceId = getDeviceId()

export default function App() {
  const [allergens, setAllergens] = useState(loadAllergens)
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState({ checks: [], loading: true, error: null })

  useEffect(() => saveAllergens(allergens), [allergens])

  // Initial state is already loading, so the effect only sets state once the fetch settles.
  useEffect(() => {
    let cancelled = false
    fetchRecentChecks(deviceId)
      .then((checks) => !cancelled && setRecent({ checks, loading: false, error: null }))
      .catch((err) => !cancelled && setRecent({ checks: [], loading: false, error: err.message }))
    return () => {
      cancelled = true
    }
  }, [])

  // Runs the match locally. Returns the result, or null if no allergens are selected.
  const runCheck = (foodText, selected) => {
    if (selected.length === 0) {
      setResult({ error: 'Select at least one allergen' })
      return null
    }
    const match = findMatches(foodText, selected)
    setResult(match)
    return match
  }

  const handleCheck = async () => {
    const foodText = text.trim()
    if (!foodText) return
    const match = runCheck(foodText, allergens)
    if (!match) return

    try {
      const saved = await insertCheck({
        device_id: deviceId,
        food_text: foodText,
        allergens,
        flagged_terms: match.flaggedTerms,
      })
      setRecent((r) => ({ ...r, error: null, checks: [saved, ...r.checks].slice(0, 10) }))
    } catch (err) {
      console.error('Insert failed', err)
      // Keep the highlight; just add a note, unless the user has already run another check.
      setResult((current) => (current === match ? { ...match, saveNote: "Couldn't save this check." } : current))
    }
  }

  const handleSelect = (check) => {
    setText(check.food_text)
    setAllergens(check.allergens)
    runCheck(check.food_text, check.allergens)
  }

  return (
    <main className="app">
      <header>
        <h1>Allergy Checker</h1>
        <p className="disclaimer">
          This is a keyword helper, not medical advice. Always read the full label.
        </p>
      </header>
      <AllergenPicker selected={allergens} onChange={setAllergens} />
      <IngredientInput value={text} onChange={setText} onCheck={handleCheck} />
      <ResultView result={result} />
      <RecentChecks {...recent} onSelect={handleSelect} />
      <footer className="device">Device ID: <code>{deviceId}</code></footer>
    </main>
  )
}
