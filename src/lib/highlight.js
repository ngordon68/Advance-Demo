import { ALLERGEN_KEYWORDS } from './allergens.js'

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Turn a keyword into a regex source that allows a plural on the last word
// ("egg" -> eggs, "anchovy" is listed separately as "anchovies").
const termSource = (term) => escape(term).replace(/ /g, '\\s+') + '(?:e?s)?'

/**
 * Find allergen keywords in `text` for the selected `allergens`.
 *
 * Returns:
 *  - segments: [{ text, allergen? }] — the full text split for rendering;
 *    segments with `allergen` set should be highlighted.
 *  - matches:  { [allergenId]: string[] } — unique matched words per allergen,
 *    in order of first appearance.
 *  - flaggedTerms: string[] — all unique matched words (lowercased).
 */
export function findMatches(text, allergens) {
  const terms = []
  for (const id of allergens) {
    for (const word of ALLERGEN_KEYWORDS[id] ?? []) terms.push({ word, id })
  }
  if (!text || terms.length === 0) {
    return { segments: text ? [{ text }] : [], matches: {}, flaggedTerms: [] }
  }

  // Longest first so "fish sauce" wins over "fish".
  terms.sort((a, b) => b.word.length - a.word.length)
  const regex = new RegExp(`\\b(?:${terms.map((t) => `(${termSource(t.word)})`).join('|')})\\b`, 'gi')

  const segments = []
  const matches = {}
  const flagged = new Set()
  let last = 0

  for (const m of text.matchAll(regex)) {
    const groupIndex = m.findIndex((g, i) => i > 0 && g !== undefined)
    const { id } = terms[groupIndex - 1]
    if (m.index > last) segments.push({ text: text.slice(last, m.index) })
    segments.push({ text: m[0], allergen: id })
    last = m.index + m[0].length

    const word = m[0].toLowerCase().replace(/\s+/g, ' ')
    matches[id] ??= []
    if (!matches[id].includes(word)) matches[id].push(word)
    flagged.add(word)
  }
  if (last < text.length) segments.push({ text: text.slice(last) })

  return { segments, matches, flaggedTerms: [...flagged] }
}
