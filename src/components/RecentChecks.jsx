import { allergenLabel } from '../lib/allergens.js'

const FAKE_CHECKS = [
  {
    id: 'fake-1',
    created_at: '2026-11-19T15:10:00Z',
    food_text: 'Whey protein, sugar, peanut oil, soy lecithin',
    allergens: ['milk', 'peanuts'],
    flagged_terms: ['whey', 'peanut'],
  },
  {
    id: 'fake-2',
    created_at: '2026-11-19T12:45:00Z',
    food_text: 'Eggplant, olive oil, garlic, salt',
    allergens: ['eggs'],
    flagged_terms: [],
  },
  {
    id: 'fake-3',
    created_at: '2026-11-18T19:30:00Z',
    food_text: 'Wheat flour, sesame seeds, tahini, water, yeast',
    allergens: ['wheat', 'sesame'],
    flagged_terms: ['wheat', 'flour', 'sesame', 'tahini'],
  },
]

const fmt = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function RecentChecks({ onSelect }) {
  const checks = FAKE_CHECKS

  return (
    <section className="card recent">
      <h2>Recent checks</h2>
      {checks.length === 0 ? (
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
