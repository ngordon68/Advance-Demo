import { allergenLabel } from '../lib/allergens.js'

const fmt = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function RecentChecks({ checks, loading, error, onSelect }) {
  return (
    <section className="card recent">
      <h2>Recent checks</h2>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : error ? (
        <p className="error">Couldn't load recent checks: {error}</p>
      ) : checks.length === 0 ? (
        <p className="muted">No checks yet.</p>
      ) : (
        <ul>
          {checks.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => onSelect(c)}>
                <span className="recent-text">{c.food_text}</span>
                <span className="recent-meta">
                  {fmt(c.created_at)} · {c.allergens.map(allergenLabel).join(', ')} ·{' '}
                  {c.flagged_terms.length === 0 ? (
                    <span className="safe">no matches</span>
                  ) : (
                    <span className="flagged">{c.flagged_terms.length} flagged</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
