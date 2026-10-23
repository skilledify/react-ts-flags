import type { Country } from '../../types'
import { AFRICA_COUNTRIES } from './africa'
import { AMERICAS_COUNTRIES } from './americas'
import { ASIA_COUNTRIES } from './asia'
import { EUROPE_COUNTRIES } from './europe'
import { OCEANIA_COUNTRIES } from './oceania'

/**
 * Кураторская база: все 196 стран и государств мира с простыми фактами.
 * Данные хранятся локально — приложению не нужен ключ API и оно работает
 * даже при медленном интернете. Флаги подгружаются с бесплатного flagcdn.com.
 */
export const COUNTRIES: Country[] = [
  ...EUROPE_COUNTRIES,
  ...ASIA_COUNTRIES,
  ...AFRICA_COUNTRIES,
  ...AMERICAS_COUNTRIES,
  ...OCEANIA_COUNTRIES,
]

export const TOTAL_COUNTRIES = COUNTRIES.length

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((country) => [country.code, country]),
)

export function getCountriesByContinent(continent: string): Country[] {
  return COUNTRIES.filter((country) => country.continent === continent)
}
