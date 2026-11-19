import { allergenLabel } from '../lib/allergens.js'

export default function ResultView({ result }) {
  if (!result) return null

  if (result.error) {
    return (
      <section className="card result">
        <p className="notice warn">{result.error}</p>
      </section>
    )
  }

  const entries = Object.entries(result.matches)
  const count = entries.reduce((n, [, words]) => n + words.length, 0)

  return (
    <section className="card result" aria-live="polite">
      {entries.length === 0 ? (
        <p className="notice ok">No matches for your allergens</p>
      ) : (
        <p className="summary">
          <strong>{count} {count === 1 ? 'match' : 'matches'}:</strong>{' '}
          {entries.map(([id, words], i) => (
            <span key={id}>
              {i > 0 && ', '}
              <span className={`tag allergen-${id}`}>{allergenLabel(id)}</span> ({words.join(', ')})
            </span>
          ))}
        </p>
      )}
      <p className="highlighted">
        {result.segments.map((s, i) =>
          s.allergen ? (
            <mark key={i} className={`allergen-${s.allergen}`} title={allergenLabel(s.allergen)}>
              {s.text}
            </mark>
          ) : (
            <span key={i}>{s.text}</span>
          ),
        )}
      </p>
      {result.saveNote && <p className="save-note">{result.saveNote}</p>}
    </section>
  )
}
