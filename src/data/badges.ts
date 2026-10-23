import { CONTINENTS } from '../data/continents'
import { COUNTRIES, getCountriesByContinent } from '../data/countries'
import type { BadgeDef, GameProgress } from '../types'

function collectedCount(p: GameProgress): number {
  return Object.keys(p.collected).length
}

function continentCollected(p: GameProgress, continent: string): number {
  return getCountriesByContinent(continent).filter((c) => p.collected[c.code]).length
}

const continentBadges: BadgeDef[] = CONTINENTS.map((continent) => {
  const total = getCountriesByContinent(continent.id).length
  return {
    id: `continent-${continent.id}`,
    title: `Знаток ${continent.name === 'Америка' ? 'Америки' : continent.name === 'Африка' ? 'Африки' : continent.name === 'Европа' ? 'Европы' : continent.name === 'Азия' ? 'Азии' : 'Океании'}`,
    description: `Собери все ${total} флагов континента «${continent.name}»`,
    emoji: continent.emoji,
    tier: 'gold',
    progress: (p) => ({
      current: continentCollected(p, continent.id),
      target: total,
    }),
  }
})

export const BADGES: BadgeDef[] = [
  {
    id: 'first-flag',
    title: 'Первый флаг',
    description: 'Открой свой первый флаг в коллекции',
    emoji: '🚩',
    tier: 'bronze',
    progress: (p) => ({ current: Math.min(collectedCount(p), 1), target: 1 }),
  },
  {
    id: 'five-flags',
    title: 'Юный путешественник',
    description: 'Собери 5 флагов',
    emoji: '🧭',
    tier: 'bronze',
    progress: (p) => ({ current: Math.min(collectedCount(p), 5), target: 5 }),
  },
  {
    id: 'ten-flags',
    title: 'Первая десятка',
    description: 'Собери 10 флагов',
    emoji: '🎒',
    tier: 'silver',
    progress: (p) => ({ current: Math.min(collectedCount(p), 10), target: 10 }),
  },
  {
    id: 'twenty-five',
    title: 'Половина мира',
    description: 'Собери 25 флагов',
    emoji: '🌗',
    tier: 'silver',
    progress: (p) => ({ current: Math.min(collectedCount(p), 25), target: 25 }),
  },
  {
    id: 'all-flags',
    title: 'Властелин флагов',
    description: `Собери все ${COUNTRIES.length} флагов`,
    emoji: '👑',
    tier: 'gold',
    progress: (p) => ({ current: collectedCount(p), target: COUNTRIES.length }),
  },
  {
    id: 'all-continents',
    title: 'Пять континентов',
    description: 'Открой хотя бы один флаг на каждом континенте',
    emoji: '🌍',
    tier: 'silver',
    progress: (p) => ({
      current: CONTINENTS.filter((continent) => continentCollected(p, continent.id) > 0).length,
      target: CONTINENTS.length,
    }),
  },
  ...continentBadges,
  {
    id: 'first-quiz',
    title: 'Первая викторина',
    description: 'Пройди викторину до конца',
    emoji: '🎯',
    tier: 'bronze',
    progress: (p) => ({ current: Math.min(p.quiz.games, 1), target: 1 }),
  },
  {
    id: 'perfect-quiz',
    title: 'Без единой ошибки',
    description: 'Ответь правильно на все вопросы викторины',
    emoji: '💎',
    tier: 'gold',
    progress: (p) => ({ current: Math.min(p.quiz.perfect, 1), target: 1 }),
  },
  {
    id: 'streak-five',
    title: 'Комбо-мастер',
    description: 'Дай 5 правильных ответов подряд',
    emoji: '🔥',
    tier: 'silver',
    progress: (p) => ({ current: Math.min(p.quiz.bestStreak, 5), target: 5 }),
  },
  {
    id: 'fifty-correct',
    title: 'Знаток мира',
    description: 'Дай 50 правильных ответов в викторинах',
    emoji: '🎓',
    tier: 'gold',
    progress: (p) => ({ current: Math.min(p.quiz.totalCorrect, 50), target: 50 }),
  },
  {
    id: 'memory-three',
    title: 'Тренировка памяти',
    description: 'Собери пары из 3 пар',
    emoji: '🃏',
    tier: 'bronze',
    progress: (p) => ({
      current: Math.min(p.memory.bestMoves['3'] === undefined ? 0 : 1, 1),
      target: 1,
    }),
  },
  {
    id: 'memory-six',
    title: 'Супер-память',
    description: 'Собери пары из 6 пар',
    emoji: '🧠',
    tier: 'silver',
    progress: (p) => ({
      current: Math.min(p.memory.bestMoves['6'] === undefined ? 0 : 1, 1),
      target: 1,
    }),
  },
  {
    id: 'memory-ten',
    title: 'Память как у слона',
    description: 'Собери пары из 10 пар',
    emoji: '🐘',
    tier: 'gold',
    progress: (p) => ({
      current: Math.min(p.memory.bestMoves['10'] === undefined ? 0 : 1, 1),
      target: 1,
    }),
  },
]

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((badge) => [badge.id, badge]))

export function isBadgeEarned(badge: BadgeDef, progress: GameProgress): boolean {
  const { current, target } = badge.progress(progress)
  return current >= target
}

export const TIER_STYLES = {
  bronze: {
    label: 'Бронза',
    from: '#f6b26b',
    to: '#e07b39',
    soft: '#fff2e6',
  },
  silver: {
    label: 'Серебро',
    from: '#8fd3f4',
    to: '#6b8cff',
    soft: '#eef4ff',
  },
  gold: {
    label: 'Золото',
    from: '#ffd75e',
    to: '#ff9f1c',
    soft: '#fff8dd',
  },
} as const
