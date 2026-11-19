import { allergenLabel } from '../lib/allergens.js'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export default function RecentChecks({ status, checks, error, onSelect }) {
  return (
    <section className="card recent" aria-busy={status === 'loading'}>
      <h2>Recent checks</h2>
      {status === 'loading' ? (
        <p className="muted">Loading…</p>
      ) : status === 'error' ? (
        <p className="notice notice-warn" role="alert">
          Couldn't load recent checks. {error}
        </p>
      ) : checks.length === 0 ? (
        <p className="muted">No checks yet.</p>
      ) : (
        <ul>
          {checks.map((check) => (
            <li key={check.id}>
              <button type="button" className="recent-row" onClick={() => onSelect(check)}>
                <span className="recent-text">{check.food_text}</span>
                <span className="recent-meta">
                  {check.flagged_terms.length > 0 ? (
                    <span className="badge badge-warn">
                      {check.flagged_terms.length} flagged
                    </span>
                  ) : (
                    <span className="badge badge-safe">No matches</span>
                  )}
                  <span className="muted">
                    {check.allergens.map(allergenLabel).join(', ')} ·{' '}
                    {dateFormat.format(new Date(check.created_at))}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
