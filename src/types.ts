export type ContinentId = 'europe' | 'asia' | 'africa' | 'americas' | 'oceania'

export interface Country {
  /** ISO 3166-1 alpha-2 в нижнем регистре — код для flagcdn.com */
  code: string
  name: string
  capital: string
  continent: ContinentId
  fact: string
}

export interface ContinentInfo {
  id: ContinentId
  name: string
  emoji: string
  tagline: string
  from: string
  to: string
  accent: string
  soft: string
  preview: string[]
}

export interface QuizRecord {
  games: number
  bestCorrect: number
  bestTotal: number
  perfect: number
  bestStreak: number
  totalCorrect: number
}

export interface MemoryRecord {
  games: number
  /** лучший результат по количеству ходов, ключ — число пар */
  bestMoves: Record<string, number>
}

export interface GameProgress {
  collected: Record<string, true>
  quiz: QuizRecord
  memory: MemoryRecord
  sound: boolean
  voice: boolean
}

export interface BadgeDef {
  id: string
  title: string
  description: string
  emoji: string
  tier: 'bronze' | 'silver' | 'gold'
  progress: (p: GameProgress) => { current: number; target: number }
}

export interface ToastMessage {
  id: string
  emoji: string
  title: string
  description?: string
}
