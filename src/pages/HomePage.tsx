import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Mascot, SpeechBubble } from '../components/Mascot'
import { Flag } from '../components/Flag'
import { buttonStyles } from '../components/Button'
import { ProgressRing } from '../components/ProgressRing'
import { CONTINENTS } from '../data/continents'
import { COUNTRY_BY_CODE, TOTAL_COUNTRIES, getCountriesByContinent } from '../data/countries'
import { useProgress } from '../lib/progress'

const HOW_TO = [
  {
    emoji: '🧭',
    title: 'Выбирай континент',
    text: 'Путешествуй по карте мира: Европа, Азия, Африка, Америка и Океания.',
    wrap: 'bg-grape/10',
    ring: 'group-hover:ring-grape/40',
  },
  {
    emoji: '🚩',
    title: 'Открывай флаги',
    text: 'Каждый флаг — это карточка-наклейка с фактом о стране и её столицей.',
    wrap: 'bg-sunny/20',
    ring: 'group-hover:ring-sunny/60',
  },
  {
    emoji: '🏆',
    title: 'Играй и побеждай',
    text: 'Викторины, пары и комбо-серии помогают запомнить флаги играючи.',
    wrap: 'bg-mint/15',
    ring: 'group-hover:ring-mint/50',
  },
]

function FloatingFlag({
  code,
  className = '',
  delay = '0s',
  rotate = '-6deg',
}: {
  code: string
  className?: string
  delay?: string
  rotate?: string
}) {
  const country = COUNTRY_BY_CODE[code]
  if (!country) return null

  return (
    <div className={`absolute animate-float ${className}`} style={{ animationDelay: delay }}>
      <div
        className="rounded-2xl border-2 border-white bg-white p-1.5 shadow-[0_8px_18px_rgba(47,35,80,0.18)]"
        style={{ transform: `rotate(${rotate})` }}
      >
        <div className="h-11 w-16 overflow-hidden rounded-lg bg-cream">
          <Flag code={code} name={country.name} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

function HeroMascot({ collected }: { collected: number }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sunny/50 via-white/60 to-mint/40 blur-md" />
      <div className="absolute inset-8 animate-spin-slow rounded-full border-[6px] border-dashed border-white/80" />
      <div className="absolute inset-12 rounded-full bg-white/35 backdrop-blur-sm" />

      <Mascot className="absolute inset-0 z-10 p-7" />

      <FloatingFlag code="jp" className="left-0 top-8 z-20" delay="0.2s" rotate="-8deg" />
      <FloatingFlag code="br" className="right-0 top-20 z-20" delay="1.1s" rotate="7deg" />
      <FloatingFlag code="ke" className="bottom-16 left-2 z-20" delay="0.7s" rotate="5deg" />
      <FloatingFlag code="fr" className="bottom-8 right-3 z-20" delay="1.6s" rotate="-5deg" />

      <div className="absolute -right-1 top-2 animate-float-fast text-2xl" aria-hidden="true">
        ✨
      </div>
      <div className="absolute -left-2 bottom-24 animate-float-slow text-xl" aria-hidden="true">
        ⭐
      </div>

      <SpeechBubble className="absolute -bottom-2 left-1/2 z-30 w-max max-w-[16rem] -translate-x-1/2 animate-pop text-center">
        {collected === 0
          ? 'Привет! Я Кеша. Полетим открывать флаги?'
          : `Уже ${collected} ${collected === 1 ? 'флаг' : collected < 5 ? 'флага' : 'флагов'}! Продолжим?`}
      </SpeechBubble>
    </div>
  )
}

export function HomePage() {
  const { collectedCount, progress, earnedBadges } = useProgress()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    window.addEventListener('resize', check)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', check)
    }
  }, [])

  const continentStats = CONTINENTS.map((continent) => {
    const total = getCountriesByContinent(continent.id).length
    const collected = getCountriesByContinent(continent.id).filter(
      (country) => progress.collected[country.code],
    ).length
    return { continent, total, collected }
  })

  const nextStop =
    continentStats.find((item) => item.collected > 0 && item.collected < item.total) ??
    continentStats.find((item) => item.collected < item.total) ??
    continentStats[0]

  const percent = Math.round((collectedCount / TOTAL_COUNTRIES) * 100)

  return (
    <div className="space-y-14 md:space-y-20">
      {/* ── Герой ─────────────────────────────────────────────── */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-ink-soft shadow-sm backdrop-blur">
            🌍 Игра-путешествие для детей 5–12 лет
          </span>

          <h1 className="font-fairy mt-4 text-balance text-[2.6rem] leading-[0.98] sm:text-6xl lg:text-[4.2rem]">
            Открой <span className="shine-text">весь мир</span>
            <br />
            по флагу!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-balance text-base font-bold leading-relaxed text-ink-soft sm:text-lg lg:mx-0">
            Собирай флаги как наклейки, знакомься со странами и зарабатывай звёзды.
            Вместе с попугаем Кешей кругосветка станет любимой игрой!
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/map" className={`${buttonStyles('primary', 'lg')} w-full sm:w-auto`}>
              🧭 Начать путешествие
            </Link>
            <Link to="/quiz" className={`${buttonStyles('white', 'lg')} w-full sm:w-auto`}>
              🎯 Викторина
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { value: `${collectedCount}/${TOTAL_COUNTRIES}`, label: 'флагов собрано', emoji: '🚩' },
              { value: String(earnedBadges.length), label: 'наград открыто', emoji: '🏆' },
              { value: String(progress.quiz.games), label: 'викторин пройдено', emoji: '🎯' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border-2 border-white bg-white/75 px-2 py-3 text-center shadow-sm backdrop-blur"
              >
                <span className="text-lg" aria-hidden="true">
                  {stat.emoji}
                </span>
                <p className="mt-0.5 text-lg font-black leading-none tabular-nums sm:text-xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-extrabold leading-tight text-ink-soft sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <HeroMascot collected={collectedCount} />
      </section>

      {/* ── Продолжить путешествие ────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white/85 p-5 shadow-[0_14px_40px_rgba(47,35,80,0.10)] backdrop-blur sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-10 text-8xl opacity-10" aria-hidden="true">
          {nextStop.continent.emoji}
        </div>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <ProgressRing value={collectedCount} total={TOTAL_COUNTRIES} size={96} color={nextStop.continent.accent}>
            <span className="text-2xl" aria-hidden="true">
              {nextStop.continent.emoji}
            </span>
            <span className="mt-0.5 text-[10px] font-black text-ink-soft">{percent}%</span>
          </ProgressRing>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-ink-soft">
              {collectedCount === 0 ? 'Твоё первое приключение' : 'Продолжить путешествие'}
            </p>
            <h2 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">
              {collectedCount === TOTAL_COUNTRIES
                ? 'Весь мир собран! Ты настоящий чемпион 🎉'
                : `${nextStop.continent.emoji} ${nextStop.continent.name}`}
            </h2>
            <p className="mt-1 text-sm font-bold text-ink-soft">
              {collectedCount === TOTAL_COUNTRIES
                ? 'Теперь можно проверить себя в викторине на все флаги.'
                : `${nextStop.collected} из ${nextStop.total} флагов уже в альбоме · ${nextStop.continent.tagline}`}
            </p>
          </div>

          <Link
            to={collectedCount === TOTAL_COUNTRIES ? '/quiz/all' : `/map/${nextStop.continent.id}`}
            className={`${buttonStyles('sunny', 'md')} w-full shrink-0 sm:w-auto`}
          >
            {collectedCount === TOTAL_COUNTRIES ? 'Играть в микс' : 'Продолжить'} →
          </Link>
        </div>

        {collectedCount > 0 && (
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint via-sky to-grape transition-[width] duration-700"
              style={{ width: `${Math.max(percent, 2)}%` }}
            />
          </div>
        )}
      </section>

      {/* ── Как играть ────────────────────────────────────────── */}
      <section>
        <div className="mb-5 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Три шага</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Как играть?</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HOW_TO.map((item, index) => (
            <article
              key={item.title}
              className={`group relative rounded-3xl border-2 border-white bg-white/80 p-5 shadow-[0_8px_0_rgba(47,35,80,0.07)] ring-2 ring-transparent backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${item.ring}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.wrap} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <span className="text-3xl font-black text-ink/10">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-black leading-tight">{item.title}</h3>
              <p className="mt-1.5 text-sm font-bold leading-relaxed text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Мини-карта континентов ────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Куда полетим?</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Пять континентов</h2>
          </div>
          <Link to="/map" className={buttonStyles('ghost', 'sm')}>
            Вся карта →
          </Link>
        </div>

        <div className="relative mb-2">
          <div ref={scrollRef} className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-thin px-4 pb-4 snap-x min-w-0">
            {continentStats.map(({ continent, total, collected }) => (
              <Link
                key={continent.id}
                to={`/map/${continent.id}`}
                className="group relative min-w-[7rem] sm:min-w-[9rem] sm:w-[10.5rem] shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white/85 p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 snap-start"
              >
                <div
                  className="flex h-16 sm:h-20 items-center justify-center rounded-xl text-3xl sm:text-4xl"
                  style={{ backgroundImage: `linear-gradient(135deg, ${continent.from}, ${continent.to})` }}
                >
                  <span className="drop-shadow-md" aria-hidden="true">
                    {continent.emoji}
                  </span>
                </div>
                <p className="mt-2 sm:mt-2.5 text-sm sm:text-base font-black">{continent.name}</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-ink-soft">
                  {collected}/{total} флагов
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(collected / total) * 100}%`, backgroundColor: continent.accent }}
                  />
                </div>
              </Link>
            ))}
          </div>
          {canScroll && (
            <p className="mt-1 text-[10px] font-bold text-ink-soft text-center">
              → Проведите пальцем или скроллите, чтобы увидеть все континенты
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
