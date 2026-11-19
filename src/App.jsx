import { useEffect, useState } from 'react'
import AllergenPicker from './components/AllergenPicker.jsx'
import IngredientInput from './components/IngredientInput.jsx'
import ResultView from './components/ResultView.jsx'
import RecentChecks from './components/RecentChecks.jsx'
import { findMatches } from './lib/highlight.js'
import { loadAllergens, saveAllergens } from './lib/storage.js'

export default function App() {
  const [allergens, setAllergens] = useState(loadAllergens)
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => saveAllergens(allergens), [allergens])

  const runCheck = (foodText, selected) => {
    if (selected.length === 0) {
      setResult({ error: 'Select at least one allergen' })
      return
    }
    setResult(findMatches(foodText, selected))
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
      <IngredientInput value={text} onChange={setText} onCheck={() => runCheck(text, allergens)} />
      <ResultView result={result} />
      <RecentChecks onSelect={handleSelect} />
    </main>
  )
}
