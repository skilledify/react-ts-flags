import type { ContinentInfo } from '../types'

export const CONTINENTS: ContinentInfo[] = [
  {
    id: 'europe',
    name: 'Европа',
    emoji: '🏰',
    tagline: 'Замки, фьорды и старые триколоры',
    from: '#6c8cff',
    to: '#9b6bff',
    accent: '#6c8cff',
    soft: '#eef1ff',
    preview: ['gb', 'fr', 'de'],
  },
  {
    id: 'asia',
    name: 'Азия',
    emoji: '🐉',
    tagline: 'Драконы, панды и восходящее солнце',
    from: '#ff9a62',
    to: '#ff5f8a',
    accent: '#ff7a59',
    soft: '#fff0ea',
    preview: ['jp', 'in', 'bt'],
  },
  {
    id: 'africa',
    name: 'Африка',
    emoji: '🦁',
    tagline: 'Сафари, пирамиды и розовое озеро',
    from: '#ffc93c',
    to: '#ff8a3d',
    accent: '#f59e0b',
    soft: '#fff7df',
    preview: ['ke', 'za', 'ma'],
  },
  {
    id: 'americas',
    name: 'Америка',
    emoji: '🗽',
    tagline: 'От Аляски до Огненной Земли',
    from: '#43c9b8',
    to: '#3b9df0',
    accent: '#2fb8a8',
    soft: '#e6faf7',
    preview: ['br', 'ca', 'mx'],
  },
  {
    id: 'oceania',
    name: 'Океания',
    emoji: '🐨',
    tagline: 'Острова, киви и большой барьерный риф',
    from: '#ff7ab6',
    to: '#7a5cff',
    accent: '#c74dff',
    soft: '#fbefff',
    preview: ['au', 'nz', 'fj'],
  },
]

export const CONTINENT_BY_ID = Object.fromEntries(
  CONTINENTS.map((continent) => [continent.id, continent]),
) as Record<ContinentInfo['id'], ContinentInfo>

export function getContinent(id: string): ContinentInfo | undefined {
  return CONTINENTS.find((continent) => continent.id === id)
}
