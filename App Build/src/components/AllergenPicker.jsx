import { ALLERGENS } from '../lib/allergens.js'

export default function AllergenPicker({ selected, onChange }) {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])

  return (
    <fieldset className="card picker">
      <legend>My allergens</legend>
      <div className="chips">
        {ALLERGENS.map(({ id, label }) => (
          <label key={id} className={`chip chip-${id}`}>
            <input
              type="checkbox"
              checked={selected.includes(id)}
              onChange={() => toggle(id)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
