import { useEffect, useRef, useState } from 'react'
import AllergenPicker from './components/AllergenPicker.jsx'
import IngredientInput from './components/IngredientInput.jsx'
import ResultView from './components/ResultView.jsx'
import RecentChecks from './components/RecentChecks.jsx'
import { findMatches } from './lib/highlight.js'
import { getDeviceId, loadSelectedAllergens, saveSelectedAllergens } from './lib/storage.js'
import { fetchRecentChecks, insertCheck } from './lib/supabase.js'

const deviceId = getDeviceId()

function runCheck(text, allergens) {
  if (allergens.length === 0) return { error: 'Select at least one allergen' }
  if (text.trim() === '') return { error: 'Enter some ingredients to check' }
  return findMatches(text, allergens)
}

export default function App() {
  const [selected, setSelected] = useState(loadSelectedAllergens)
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [recent, setRecent] = useState({ status: 'loading', checks: [], error: null })
  const [saveStatus, setSaveStatus] = useState(null) // null | 'saving' | 'saved' | 'error'
  const latestSave = useRef(0)

  useEffect(() => saveSelectedAllergens(selected), [selected])

  useEffect(() => {
    let cancelled = false
    fetchRecentChecks(deviceId)
      .then((checks) => !cancelled && setRecent({ status: 'ready', checks, error: null }))
      .catch((err) => {
        console.error('Failed to load recent checks', err)
        if (!cancelled) setRecent({ status: 'error', checks: [], error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleCheck = async () => {
    const checked = runCheck(text, selected)
    setResult(checked)
    if (checked.error) return

    // Tag this save so a slower earlier save can't overwrite the note for a newer check.
    const saveId = ++latestSave.current
    setSaveStatus('saving')
    try {
      const row = await insertCheck({
        deviceId,
        foodText: text,
        allergens: selected,
        flaggedTerms: checked.flaggedTerms,
      })
      setRecent((prev) => ({
        ...prev,
        checks: [row, ...prev.checks.filter((c) => c.id !== row.id)].slice(0, 10),
      }))
      if (saveId === latestSave.current) setSaveStatus('saved')
    } catch (err) {
      console.error('Failed to save check', err)
      if (saveId === latestSave.current) setSaveStatus('error')
    }
  }

  // Re-checking a past entry only shows it again; it is not saved a second time.
  const handleSelectRecent = (check) => {
    latestSave.current++
    setSaveStatus(null)
    setText(check.food_text)
    setSelected(check.allergens)
    setResult(runCheck(check.food_text, check.allergens))
  }

  return (
    <main className="app">
      <header>
        <h1>Allergy Checker</h1>
        <p className="disclaimer">
          This is a keyword helper, not medical advice. Always read the full label.
        </p>
      </header>

      <AllergenPicker selected={selected} onChange={setSelected} />
      <IngredientInput value={text} onChange={setText} onCheck={handleCheck} />
      <ResultView result={result} saveStatus={saveStatus} />
      <RecentChecks
        status={recent.status}
        checks={recent.checks}
        error={recent.error}
        onSelect={handleSelectRecent}
      />
    </main>
  )
}
