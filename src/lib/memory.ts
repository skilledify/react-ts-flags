import type { Country } from '../types'
import { sample, shuffle } from './random'

export type MemoryFace = 'flag' | 'name'

export interface MemoryCard {
  id: string
  pairId: number
  country: Country
  face: MemoryFace
}

export interface MemoryLevel {
  pairs: number
  cards: number
  label: string
  emoji: string
  description: string
}

export const MEMORY_LEVELS: MemoryLevel[] = [
  {
    pairs: 3,
    cards: 6,
    label: 'Разминка',
    emoji: '🌱',
    description: '6 карточек · 3 пары',
  },
  {
    pairs: 6,
    cards: 12,
    label: 'Путешественник',
    emoji: '🧭',
    description: '12 карточек · 6 пар',
  },
  {
    pairs: 10,
    cards: 20,
    label: 'Чемпион',
    emoji: '🏆',
    description: '20 карточек · 10 пар',
  },
]

export function buildDeck(countries: Country[], pairs: number): MemoryCard[] {
  const chosen = sample(countries, pairs)
  const cards = chosen.flatMap((country, pairId) => [
    { id: `${country.code}-flag-${pairId}`, pairId, country, face: 'flag' as const },
    { id: `${country.code}-name-${pairId}`, pairId, country, face: 'name' as const },
  ])

  return shuffle(cards)
}
