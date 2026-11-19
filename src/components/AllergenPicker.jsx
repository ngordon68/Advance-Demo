import { ALLERGENS } from '../lib/allergens.js'

export default function AllergenPicker({ selected, onChange }) {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((a) => a !== id) : [...selected, id])

  return (
    <fieldset className="card picker">
      <legend>My allergens</legend>
      <div className="chips">
        {ALLERGENS.map(({ id, label }) => (
          <label key={id} className={`chip allergen-${id}${selected.includes(id) ? ' on' : ''}`}>
            <input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
