import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '../components/Button'
import { CountryModal } from '../components/CountryModal'
import { FlagCard } from '../components/FlagCard'
import { ProgressRing } from '../components/ProgressRing'
import { CONTINENTS } from '../data/continents'
import { COUNTRIES, TOTAL_COUNTRIES, getCountriesByContinent } from '../data/countries'
import { playSound } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { pick } from '../lib/random'
import type { ContinentId, Country } from '../types'

type Filter = 'all' | ContinentId

export function CollectionPage() {
  const { progress, collectedCount, soundOn } = useProgress()
  const [filter, setFilter] = useState<Filter>('all')
  const [onlyMissing, setOnlyMissing] = useState(false)
  const [selected, setSelected] = useState<Country | null>(null)

  const visibleCountries = useMemo(() => {
    const byContinent = filter === 'all' ? COUNTRIES : getCountriesByContinent(filter)
    if (!onlyMissing) return byContinent
    return byContinent.filter((country) => !progress.collected[country.code])
  }, [filter, onlyMissing, progress.collected])

  const missingCount = TOTAL_COUNTRIES - collectedCount
  const percent = Math.round((collectedCount / TOTAL_COUNTRIES) * 100)

  const openRandom = () => {
    const locked = COUNTRIES.filter((country) => !progress.collected[country.code])
    const country = locked.length > 0 ? pick(locked) : pick(COUNTRIES)
    playSound('click', soundOn)
    setSelected(country)
  }

  return (
    <div className="space-y-6">
      <header className="dot-grid relative overflow-hidden rounded-[2rem] border-4 border-white bg-white/85 p-5 shadow-[0_12px_40px_rgba(47,35,80,0.08)] backdrop-blur sm:p-7">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <ProgressRing value={collectedCount} total={TOTAL_COUNTRIES} size={104} color="#7a5cff">
            <span className="text-xl" aria-hidden="true">📔</span>
            <span className="text-[11px] font-black tabular-nums text-ink-soft">
              {collectedCount}/{TOTAL_COUNTRIES}
            </span>
          </ProgressRing>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Мой альбом</p>
            <h1 className="mt-1 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Коллекция флагов
            </h1>
            <p className="mt-1.5 text-sm font-bold text-ink-soft">
              {collectedCount === TOTAL_COUNTRIES
                ? 'Невероятно — все флаги мира собраны! Ты легенда географии 🏆'
                : `Собрано ${percent}%. Осталось ${missingCount} ${missingCount === 1 ? 'флаг' : missingCount < 5 ? 'флага' : 'флагов'} — продолжай путешествие!`}
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
              <div
                className="h-full rounded-full bg-gradient-to-r from-mint via-sky to-grape transition-[width] duration-700"
                style={{ width: `${Math.max(percent, 2)}%` }}
              />
            </div>
          </div>

          <button type="button" onClick={openRandom} className={`${buttonStyles('sunny', 'md')} shrink-0`}>
            🎁 Случайный флаг
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CONTINENTS.map((continent) => {
            const total = getCountriesByContinent(continent.id).length
            const collected = getCountriesByContinent(continent.id).filter(
              (country) => progress.collected[country.code],
            ).length
            return (
              <div key={continent.id} className="rounded-xl bg-white/80 px-2 py-1.5">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="truncate">
                    {continent.emoji} {continent.name}
                  </span>
                  <span className="ml-1 tabular-nums text-ink-soft">
                    {collected}/{total}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(collected / total) * 100}%`, backgroundColor: continent.accent }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </header>

      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${
            filter === 'all' ? 'bg-grape text-white shadow-[0_4px_0_#5a3ee6]' : 'bg-white/80 text-ink-soft hover:bg-white'
          }`}
        >
          🌍 Все · {collectedCount}/{TOTAL_COUNTRIES}
        </button>
        {CONTINENTS.map((continent) => {
          const total = getCountriesByContinent(continent.id).length
          const collected = getCountriesByContinent(continent.id).filter(
            (country) => progress.collected[country.code],
          ).length
          return (
            <button
              key={continent.id}
              type="button"
              onClick={() => setFilter(continent.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${
                filter === continent.id
                  ? 'text-white shadow-[0_4px_0_rgba(47,35,80,0.12)]'
                  : 'bg-white/80 text-ink-soft hover:bg-white'
              }`}
              style={
                filter === continent.id
                  ? { backgroundColor: continent.accent }
                  : undefined
              }
            >
              {continent.emoji} {continent.name} · {collected}/{total}
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => setOnlyMissing((current) => !current)}
          className={`ml-auto shrink-0 rounded-xl border-2 px-3 py-2 text-xs font-black transition ${
            onlyMissing
              ? 'border-coral bg-coral/10 text-coral'
              : 'border-white bg-white/80 text-ink-soft hover:bg-white'
          }`}
          aria-pressed={onlyMissing}
        >
          {onlyMissing ? '🔒 Только несобранные' : '👀 Показать все'}
        </button>
      </div>

      {visibleCountries.length === 0 ? (
        <div className="rounded-3xl border-4 border-white bg-white/80 p-10 text-center backdrop-blur">
          <p className="text-4xl">🎉</p>
          <h2 className="mt-2 text-2xl font-black">
            {onlyMissing ? 'Здесь всё собрано!' : 'Пока пусто'}
          </h2>
          <p className="mt-1 text-sm font-bold text-ink-soft">
            {onlyMissing
              ? 'В этом разделе не осталось закрытых флагов. Выбирай другой континент!'
              : 'Открой первый флаг на карте мира.'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to="/map" className={buttonStyles('primary', 'md')}>
              🧭 На карту
            </Link>
            {onlyMissing && (
              <button type="button" onClick={() => setOnlyMissing(false)} className={buttonStyles('white', 'md')}>
                Показать все
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visibleCountries.map((country, index) => (
            <FlagCard
              key={country.code}
              country={country}
              collected={Boolean(progress.collected[country.code])}
              onOpen={setSelected}
              index={index}
            />
          ))}
        </div>
      )}

      <div className="rounded-3xl border-2 border-white bg-white/70 p-5 text-center backdrop-blur">
        <p className="text-sm font-black">
          💡 Флаги из викторины попадают в альбом автоматически
        </p>
        <p className="mt-1 text-xs font-bold text-ink-soft">
          А ещё можно открыть любой флаг вручную — просто нажми на карточку.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Link to="/quiz" className={buttonStyles('white', 'sm')}>
            🎯 Играть в викторину
          </Link>
          <Link to="/achievements" className={buttonStyles('ghost', 'sm')}>
            🏆 Мои награды
          </Link>
        </div>
      </div>

      {selected && <CountryModal country={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
