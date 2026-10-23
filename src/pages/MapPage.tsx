import { Link } from 'react-router'
import { ProgressRing } from '../components/ProgressRing'
import { buttonStyles } from '../components/Button'
import { Flag } from '../components/Flag'
import { CONTINENTS } from '../data/continents'
import { TOTAL_COUNTRIES, getCountriesByContinent } from '../data/countries'
import { useProgress } from '../lib/progress'
import type { ContinentInfo } from '../types'

function ContinentCard({
  continent,
  collected,
  total,
  index,
}: {
  continent: ContinentInfo
  collected: number
  total: number
  index: number
}) {
  const done = collected === total
  const percent = Math.round((collected / total) * 100)

  return (
    <Link
      to={`/map/${continent.id}`}
      className="group relative block animate-fade-up overflow-hidden rounded-[1.75rem] border-4 border-white bg-white shadow-[0_10px_0_rgba(47,35,80,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_0_rgba(47,35,80,0.08)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className="relative h-36 overflow-hidden p-4 text-white sm:h-40"
        style={{ backgroundImage: `linear-gradient(135deg, ${continent.from}, ${continent.to})` }}
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/10" />

        <span
          className="absolute right-4 top-3 text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:text-6xl"
          aria-hidden="true"
        >
          {continent.emoji}
        </span>

        <div className="flex h-full flex-col justify-between">
          <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur">
            {done ? '🏆 собрано всё' : `${percent}% альбома`}
          </span>
          <div className="flex items-end gap-1.5">
            {continent.preview.map((code, flagIndex) => (
              <span
                key={code}
                className="h-7 w-10 overflow-hidden rounded-md border-2 border-white bg-white shadow-md transition-transform duration-300 group-hover:-translate-y-1"
                style={{ transform: `rotate(${(flagIndex - 1) * 5}deg)`, transitionDelay: `${flagIndex * 40}ms` }}
              >
                <Flag code={code} name={continent.name} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-black tracking-tight">{continent.name}</h2>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-sunny">
            →
          </span>
        </div>
        <p className="mt-0.5 text-xs font-bold text-ink-soft">{continent.tagline}</p>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{ width: `${percent}%`, backgroundColor: continent.accent }}
            />
          </div>
          <span className="shrink-0 text-xs font-black tabular-nums text-ink-soft">
            {collected}/{total}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function MapPage() {
  const { progress, collectedCount } = useProgress()

  const stats = CONTINENTS.map((continent) => {
    const countries = getCountriesByContinent(continent.id)
    return {
      continent,
      total: countries.length,
      collected: countries.filter((country) => progress.collected[country.code]).length,
    }
  })

  const completeContinents = stats.filter((item) => item.collected === item.total).length

  return (
    <div className="space-y-7">
      <header className="flex flex-col items-center gap-5 rounded-[2rem] border-4 border-white bg-white/80 p-5 text-center shadow-[0_12px_40px_rgba(47,35,80,0.08)] backdrop-blur sm:flex-row sm:p-7 sm:text-left">
        <ProgressRing value={collectedCount} total={TOTAL_COUNTRIES} size={100} color="#7a5cff">
          <span className="text-xl" aria-hidden="true">🌍</span>
          <span className="text-[11px] font-black tabular-nums text-ink-soft">
            {collectedCount}/{TOTAL_COUNTRIES}
          </span>
        </ProgressRing>

        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Карта мира</p>
          <h1 className="mt-1 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Куда полетим сегодня?
          </h1>
          <p className="mt-1.5 text-sm font-bold text-ink-soft">
            Выбирай континент и открывай флаги. Порядок не важен — исследуй как хочешь!
            {completeContinents > 0 && ` Уже собрано континентов: ${completeContinents} из 5.`}
          </p>
        </div>

        <Link to="/collection" className={`${buttonStyles('white', 'md')} shrink-0`}>
          📔 Мой альбом
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ continent, collected, total }, index) => (
          <ContinentCard
            key={continent.id}
            continent={continent}
            collected={collected}
            total={total}
            index={index}
          />
        ))}

        <Link
          to="/quiz/all"
          className="group relative flex animate-fade-up flex-col justify-center overflow-hidden rounded-[1.75rem] border-4 border-dashed border-grape/30 bg-white/60 p-6 text-center backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-grape/60 hover:bg-white"
          style={{ animationDelay: '400ms' }}
        >
          <span className="mx-auto text-4xl transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">
            🎲
          </span>
          <h2 className="mt-2 text-xl font-black">Микс-викторина</h2>
          <p className="mt-1 text-xs font-bold text-ink-soft">
            Флаги со всего мира вперемешку. Проверь свою память!
          </p>
          <span className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-black text-grape">
            Играть <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
