import { ALLERGENS, SAFE_PHRASES } from './allergens.js'

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// keyword (lowercase) -> allergen id, or null for a safe phrase
const KEYWORD_TO_ALLERGEN = new Map()
for (const { id, keywords } of ALLERGENS) {
  for (const kw of keywords) KEYWORD_TO_ALLERGEN.set(kw.toLowerCase(), id)
}
for (const phrase of SAFE_PHRASES) KEYWORD_TO_ALLERGEN.set(phrase.toLowerCase(), null)

// Longest keywords first, so at any position the longest phrase wins
// ("peanut butter" before "butter", "rice flour" before "flour").
const KEYWORDS = [...KEYWORD_TO_ALLERGEN.keys()].sort((a, b) => b.length - a.length)

const toPattern = (kw) => escapeRegex(kw).replace(/ /g, '\\s+')

// One capture group per keyword, so we know which keyword matched.
// \b on both sides keeps "egg" out of "eggplant"; (?:e?s)? allows plurals.
const MATCHER_SOURCE = `\\b(?:${KEYWORDS.map((kw) => `(${toPattern(kw)})`).join('|')})(?:e?s)?\\b`

/**
 * Find allergen words in `text` for the selected allergen ids.
 *
 * Returns:
 *   segments: [{ text, allergen }] covering the whole text in order;
 *             allergen is an id for a highlighted match, otherwise null
 *   matches:  [{ allergen, words }] one entry per matched allergen, in ALLERGENS order,
 *             with the distinct words as written (case-insensitive dedupe)
 *   flaggedTerms: every distinct matched word, lowercased
 */
export function findMatches(text, selectedAllergens) {
  const selected = new Set(selectedAllergens)
  const segments = []
  const wordsByAllergen = new Map()
  const re = new RegExp(MATCHER_SOURCE, 'gi')
  let last = 0

  for (const m of text.matchAll(re)) {
    const groupIndex = m.findIndex((g, i) => i > 0 && g !== undefined)
    const allergen = KEYWORD_TO_ALLERGEN.get(KEYWORDS[groupIndex - 1])
    if (!allergen || !selected.has(allergen)) continue

    if (m.index > last) segments.push({ text: text.slice(last, m.index), allergen: null })
    segments.push({ text: m[0], allergen })
    last = m.index + m[0].length

    const words = wordsByAllergen.get(allergen) ?? new Map()
    const key = m[0].toLowerCase().replace(/\s+/g, ' ')
    if (!words.has(key)) words.set(key, m[0].replace(/\s+/g, ' '))
    wordsByAllergen.set(allergen, words)
  }
  if (last < text.length) segments.push({ text: text.slice(last), allergen: null })

  const matches = ALLERGENS.filter((a) => wordsByAllergen.has(a.id)).map((a) => ({
    allergen: a.id,
    words: [...wordsByAllergen.get(a.id).values()],
  }))
  const flaggedTerms = [...new Set(matches.flatMap((m) => m.words.map((w) => w.toLowerCase())))]

  return { segments, matches, flaggedTerms }
}
