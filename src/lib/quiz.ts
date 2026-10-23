import type { Country } from '../types'
import { sample, shuffle } from './random'

export type QuizKind = 'flag-country' | 'country-flag' | 'capital'

export interface QuizQuestion {
  id: string
  kind: QuizKind
  country: Country
  options: Country[]
}

const KINDS: QuizKind[] = ['flag-country', 'country-flag', 'capital']

function buildOptions(pool: Country[], answer: Country, kind: QuizKind): Country[] {
  const candidates = pool.filter((country) => {
    if (country.code === answer.code) return false
    if (kind === 'capital' && country.capital === answer.capital) return false
    return true
  })

  const preferred = shuffle(candidates.filter((country) => country.continent === answer.continent))
  const others = shuffle(candidates.filter((country) => country.continent !== answer.continent))
  const ordered = [...preferred, ...others].slice(0, 3)

  return shuffle([answer, ...ordered])
}

export function buildQuiz(pool: Country[], total = 10): QuizQuestion[] {
  if (pool.length < 4) return []

  const answers = sample(pool, Math.min(total, pool.length))

  return answers.map((country, index) => {
    const kind = KINDS[index % KINDS.length]
    return {
      id: `${country.code}-${index}`,
      kind,
      country,
      options: buildOptions(pool, country, kind),
    }
  })
}
