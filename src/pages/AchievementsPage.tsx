import { useState } from 'react'
import { Link } from 'react-router'
import { buttonStyles } from '../components/Button'
import { ProgressRing } from '../components/ProgressRing'
import { BADGES, TIER_STYLES, isBadgeEarned } from '../data/badges'
import { playSound } from '../lib/audio'
import { useProgress } from '../lib/progress'

const LEVELS = [
  { min: 0, title: 'Новичок', emoji: '🌱' },
  { min: 4, title: 'Исследователь', emoji: '🧭' },
  { min: 8, title: 'Путешественник', emoji: '🎒' },
  { min: 12, title: 'Знаток флагов', emoji: '🎓' },
  { min: 16, title: 'Легенда мира', emoji: '👑' },
]

export function AchievementsPage() {
  const { progress, earnedBadges, resetProgress, soundOn } = useProgress()
  const [confirmReset, setConfirmReset] = useState(false)

  const earnedIds = new Set(earnedBadges.map((badge) => badge.id))
  const level = [...LEVELS].reverse().find((item) => earnedBadges.length >= item.min) ?? LEVELS[0]

  const nextBadge = BADGES.filter((badge) => !earnedIds.has(badge.id))
    .map((badge) => {
      const { current, target } = badge.progress(progress)
      return { badge, current, target, ratio: current / target }
    })
    .sort((a, b) => b.ratio - a.ratio)[0]

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      playSound('click', soundOn)
      return
    }
    resetProgress()
    setConfirmReset(false)
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white/85 p-5 shadow-[0_12px_40px_rgba(47,35,80,0.08)] backdrop-blur sm:p-7">
        <div className="pointer-events-none absolute -right-8 -top-10 text-8xl opacity-10" aria-hidden="true">
          🏆
        </div>
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <ProgressRing value={earnedBadges.length} total={BADGES.length} size={104} color="#ff9f1c">
            <span className="text-2xl" aria-hidden="true">🏆</span>
            <span className="text-[11px] font-black tabular-nums text-ink-soft">
              {earnedBadges.length}/{BADGES.length}
            </span>
          </ProgressRing>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Мои достижения</p>
            <h1 className="mt-1 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              Награды и значки
            </h1>
            <p className="mt-1.5 text-sm font-bold text-ink-soft">
              Уровень: <span className="font-black text-ink">{level.emoji} {level.title}</span> ·{' '}
              Открыто {earnedBadges.length} из {BADGES.length} наград
            </p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sunny via-coral to-grape transition-[width] duration-700"
                style={{ width: `${Math.max((earnedBadges.length / BADGES.length) * 100, 2)}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {nextBadge && (
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-sunny/50 bg-bubble/40 p-4 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm" aria-hidden="true">
            {nextBadge.badge.emoji}
          </span>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-soft">Следующая цель</p>
            <p className="text-sm font-black">{nextBadge.badge.title}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/80">
                <div
                  className="h-full rounded-full bg-grape transition-[width] duration-500"
                  style={{ width: `${(nextBadge.current / nextBadge.target) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black tabular-nums text-ink-soft">
                {nextBadge.current}/{nextBadge.target}
              </span>
            </div>
          </div>
          <Link to="/quiz" className={buttonStyles('sunny', 'sm')}>
            Заработать →
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((badge, index) => {
          const earned = isBadgeEarned(badge, progress)
          const { current, target } = badge.progress(progress)
          const tier = TIER_STYLES[badge.tier]

          return (
            <article
              key={badge.id}
              className={`relative animate-fade-up overflow-hidden rounded-3xl border-4 p-4 transition-all duration-300 ${
                earned
                  ? 'border-white bg-white shadow-[0_8px_0_rgba(47,35,80,0.08)] hover:-translate-y-1'
                  : 'border-white/60 bg-white/55 backdrop-blur'
              }`}
              style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
            >
              {earned && (
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15"
                  style={{ backgroundColor: tier.to }}
                />
              )}

              <div className="relative flex items-start gap-3">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner transition-transform duration-300 ${
                    earned ? 'group-hover:scale-110' : 'grayscale opacity-50'
                  }`}
                  style={{
                    backgroundImage: earned
                      ? `linear-gradient(135deg, ${tier.from}, ${tier.to})`
                      : 'linear-gradient(135deg, #e9e4f2, #d7d1e6)',
                  }}
                  aria-hidden="true"
                >
                  {badge.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                      style={{ backgroundColor: tier.soft, color: '#2f2350' }}
                    >
                      {tier.label}
                    </span>
                    {earned ? (
                      <span className="text-[10px] font-black text-mint">✓ получено</span>
                    ) : (
                      <span className="text-sm opacity-40" aria-label="Не получено">
                        🔒
                      </span>
                    )}
                  </div>
                  <h2 className={`mt-1 text-base font-black leading-tight ${earned ? '' : 'text-ink-soft'}`}>
                    {badge.title}
                  </h2>
                  <p className="mt-0.5 text-[11px] font-bold leading-snug text-ink-soft">{badge.description}</p>
                </div>
              </div>

              {!earned && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(current / target) * 100}%`,
                        backgroundColor: tier.to,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-black tabular-nums text-ink-soft">
                    {current}/{target}
                  </span>
                </div>
              )}

              {earned && (
                <div className="mt-3 rounded-xl bg-cream px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-widest text-ink-soft">
                  ✨ награда в твоей коллекции
                </div>
              )}
            </article>
          )
        })}
      </div>

      <section className="rounded-2xl border-2 border-white bg-white/60 p-4 text-center backdrop-blur">
        <p className="text-xs font-bold text-ink-soft">
          Прогресс сохраняется в этом браузере автоматически — регистрация не нужна.
        </p>
        <div className="mt-2 flex flex-col items-center justify-center gap-2 sm:flex-row">
          {!confirmReset ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl px-3 py-2 text-[11px] font-black text-ink-soft underline decoration-2 underline-offset-4 transition hover:text-coral"
            >
              Сбросить прогресс (для родителей)
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-coral/10 px-3 py-2">
              <span className="text-[11px] font-black text-coral">Точно удалить все флаги и награды?</span>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-coral px-3 py-1.5 text-[11px] font-black text-white transition hover:bg-coral/90"
              >
                Да, сбросить
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-black text-ink transition hover:bg-cream"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
