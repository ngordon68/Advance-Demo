export default function IngredientInput({ value, onChange, onCheck }) {
  const empty = value.trim() === ''
  const submit = (e) => {
    e.preventDefault()
    if (!empty) onCheck()
  }

  return (
    <form className="card input" onSubmit={submit}>
      <label htmlFor="ingredients">Ingredients</label>
      <textarea
        id="ingredients"
        rows={5}
        maxLength={5000}
        placeholder="Paste an ingredient list, e.g. Whey protein, sugar, peanut oil, soy lecithin"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" disabled={empty}>Check</button>
    </form>
  )
}
