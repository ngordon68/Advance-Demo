import { allergenLabel } from '../lib/allergens.js'

export default function ResultView({ result, saveStatus }) {
  if (!result) return null

  if (result.error) {
    return (
      <section className="card result" aria-live="polite">
        <p className="notice notice-warn">{result.error}</p>
      </section>
    )
  }

  const { segments, matches } = result
  const total = matches.reduce((n, m) => n + m.words.length, 0)

  return (
    <section className="card result" aria-live="polite">
      {matches.length === 0 ? (
        <p className="notice notice-safe">No matches for your allergens</p>
      ) : (
        <div className="summary">
          <p className="summary-count">
            {total} {total === 1 ? 'match' : 'matches'}
          </p>
          <ul>
            {matches.map(({ allergen, words }) => (
              <li key={allergen}>
                <span className={`dot hl-${allergen}`} aria-hidden="true" />
                <strong>{allergenLabel(allergen)}</strong>: {words.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="highlighted">
        {segments.map((seg, i) =>
          seg.allergen ? (
            <mark key={i} className={`hl-${seg.allergen}`} title={allergenLabel(seg.allergen)}>
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>

      {saveStatus === 'error' && (
        <p className="save-note" role="status">
          Couldn't save this check to Recent checks.
        </p>
      )}
    </section>
  )
}
