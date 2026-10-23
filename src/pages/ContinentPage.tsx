import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Button, buttonStyles } from '../components/Button'
import { CountryModal } from '../components/CountryModal'
import { FlagCard } from '../components/FlagCard'
import { ProgressRing } from '../components/ProgressRing'
import { getContinent } from '../data/continents'
import { TOTAL_COUNTRIES, getCountriesByContinent } from '../data/countries'
import { playSound } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { pick } from '../lib/random'
import type { Country } from '../types'

export function ContinentPage() {
  const { continentId } = useParams()
  const continent = continentId ? getContinent(continentId) : undefined
  const { progress, soundOn, collectedCount } = useProgress()
  const [selected, setSelected] = useState<Country | null>(null)

  const countries = useMemo(
    () => (continent ? getCountriesByContinent(continent.id) : []),
    [continent],
  )

  if (!continent) return <Navigate to="/map" replace />

  const collected = countries.filter((country) => progress.collected[country.code]).length
  const percent = Math.round((collected / countries.length) * 100)
  const done = collected === countries.length

  const openRandom = () => {
    const locked = countries.filter((country) => !progress.collected[country.code])
    const country = locked.length > 0 ? pick(locked) : pick(countries)
    playSound('click', soundOn)
    setSelected(country)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link to="/map" className={buttonStyles('ghost', 'sm')}>
          ← Карта
        </Link>
        <span className="text-xs font-black uppercase tracking-widest text-ink-soft">
          {collectedCount}/{TOTAL_COUNTRIES} флагов всего
        </span>
      </div>

      <header
        className="relative overflow-hidden rounded-[2rem] border-4 border-white p-5 text-white shadow-[0_12px_40px_rgba(47,35,80,0.14)] sm:p-7"
        style={{ backgroundImage: `linear-gradient(125deg, ${continent.from}, ${continent.to})` }}
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/20 text-5xl shadow-inner backdrop-blur">
            <span className="animate-float" aria-hidden="true">
              {continent.emoji}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">Континент</p>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{continent.name}</h1>
            <p className="mt-1 text-sm font-bold text-white/90">{continent.tagline}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Link
                to={`/quiz/${continent.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-sm font-black text-ink shadow-[0_4px_0_rgba(47,35,80,0.2)] transition hover:-translate-y-0.5"
              >
                🎯 Викторина
              </Link>
              <Button variant="ghost" size="sm" onClick={openRandom} className="bg-white/20 text-white hover:bg-white/30">
                🎁 Случайный флаг
              </Button>
            </div>
          </div>

          <ProgressRing
            value={collected}
            total={countries.length}
            size={92}
            color="#ffffff"
            track="rgba(255,255,255,0.25)"
          >
            <span className="text-xl font-black tabular-nums text-white">{percent}%</span>
            <span className="text-[10px] font-bold text-white/80">
              {collected}/{countries.length}
            </span>
          </ProgressRing>
        </div>

        {done && (
          <p className="relative mt-4 rounded-xl bg-white/20 px-3 py-2 text-center text-sm font-black backdrop-blur">
            🏆 Континент собран полностью! Ты можешь проверить себя в викторине.
          </p>
        )}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-black tracking-tight">Флаги {continent.name === 'Америка' ? 'Америки' : continent.name === 'Африка' ? 'Африки' : continent.name === 'Европа' ? 'Европы' : continent.name === 'Азия' ? 'Азии' : 'Океании'}</h2>
        <p className="text-xs font-bold text-ink-soft">
          Нажми на карточку, чтобы открыть флаг и прочитать факт
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {countries.map((country, index) => (
          <FlagCard
            key={country.code}
            country={country}
            collected={Boolean(progress.collected[country.code])}
            onOpen={setSelected}
            index={index}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-white bg-white/70 p-5 text-center backdrop-blur sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunny/25 text-2xl" aria-hidden="true">
            📚
          </span>
          <div>
            <p className="font-black">
              {done ? 'Альбом континента заполнен!' : `Осталось открыть: ${countries.length - collected}`}
            </p>
            <p className="text-xs font-bold text-ink-soft">Собранные флаги хранятся в альбоме навсегда.</p>
          </div>
        </div>
        <Link to="/collection" className={buttonStyles('white', 'sm')}>
          📔 В альбом
        </Link>
      </div>

      {selected && <CountryModal country={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
