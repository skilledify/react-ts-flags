import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button, buttonStyles } from '../components/Button'
import { Confetti } from '../components/Confetti'
import { Flag } from '../components/Flag'
import { Mascot } from '../components/Mascot'
import { COUNTRIES } from '../data/countries'
import { playSound } from '../lib/audio'
import { buildDeck, MEMORY_LEVELS } from '../lib/memory'
import type { MemoryCard, MemoryLevel } from '../lib/memory'
import { useProgress } from '../lib/progress'
import { formatTime } from '../lib/random'

const LEVEL_STYLES = [
  { from: '#43c9b8', to: '#58b9f7', soft: '#e6faf7' },
  { from: '#7a5cff', to: '#ff5f8a', soft: '#f0ecff' },
  { from: '#ffc93c', to: '#ff7a59', soft: '#fff7df' },
]

function starsFor(moves: number, pairs: number): number {
  if (moves <= Math.ceil(pairs * 1.4)) return 3
  if (moves <= Math.ceil(pairs * 2.2)) return 2
  return 1
}

function MemoryIntro({ onStart }: { onStart: (level: MemoryLevel) => void }) {
  const { progress, soundOn } = useProgress()

  return (
    <div className="space-y-7">
      <header className="grid items-center gap-4 overflow-hidden rounded-[2rem] border-4 border-white bg-white/80 p-5 shadow-[0_12px_40px_rgba(47,35,80,0.08)] backdrop-blur sm:grid-cols-[1fr_auto] sm:p-7">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mint/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-ink">
            🃏 Мемори
          </span>
          <h1 className="mt-2 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Найди пару: флаг и страна
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold leading-relaxed text-ink-soft">
            Переворачивай карточки и запоминай, где спрятались флаги. Найди все пары
            за меньшее число ходов и получи три звезды!
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { emoji: '🧠', text: 'Тренирует память' },
              { emoji: '⏱️', text: 'Есть таймер' },
              { emoji: '⭐', text: 'Звёзды за ходы' },
            ].map((chip) => (
              <span
                key={chip.text}
                className="rounded-xl border-2 border-white bg-white px-3 py-1.5 text-xs font-black shadow-sm"
              >
                {chip.emoji} {chip.text}
              </span>
            ))}
          </div>
        </div>
        <Mascot className="mx-auto h-40 w-40 sm:h-48 sm:w-48" />
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {MEMORY_LEVELS.map((level, index) => {
          const style = LEVEL_STYLES[index]
          const best = progress.memory.bestMoves[String(level.pairs)]
          return (
            <button
              key={level.pairs}
              type="button"
              onClick={() => {
                playSound('click', soundOn)
                onStart(level)
              }}
              className="group relative animate-fade-up overflow-hidden rounded-[1.75rem] border-4 border-white p-5 text-left shadow-[0_8px_0_rgba(47,35,80,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_0_rgba(47,35,80,0.10)]"
              style={{
                animationDelay: `${index * 80}ms`,
                backgroundImage: `linear-gradient(135deg, ${style.from}, ${style.to})`,
              }}
            >
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/15" />
              <div className="relative text-white">
                <span className="text-4xl" aria-hidden="true">
                  {level.emoji}
                </span>
                <h2 className="mt-2 text-2xl font-black leading-tight">{level.label}</h2>
                <p className="text-xs font-bold text-white/85">{level.description}</p>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/20 px-3 py-2 backdrop-blur">
                  <span className="text-[11px] font-black uppercase tracking-wide text-white/85">
                    {best === undefined ? 'Ещё не играл' : `Рекорд: ${best} ходов`}
                  </span>
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border-2 border-white bg-white/70 p-4 text-center text-xs font-bold leading-relaxed text-ink-soft backdrop-blur">
        🌟 Три звезды — почти без ошибок · Собранные пары остаются открытыми, пока ты ищешь остальные
      </div>
    </div>
  )
}

export function MemoryPage() {
  const { progress, recordMemory, soundOn } = useProgress()
  const [level, setLevel] = useState<MemoryLevel | null>(null)
  const [deck, setDeck] = useState<MemoryCard[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [newRecord, setNewRecord] = useState(false)

  const lockRef = useRef(false)
  const timeoutsRef = useRef<number[]>([])
  const recordedRef = useRef(false)

  const clearTimers = () => {
    timeoutsRef.current.forEach((timer) => window.clearTimeout(timer))
    timeoutsRef.current = []
  }

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    if (!running || finished) return
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running, finished])

  useEffect(() => {
    if (!level || deck.length === 0) return
    if (matched.length === deck.length && !recordedRef.current) {
      recordedRef.current = true
      const previousBest = progress.memory.bestMoves[String(level.pairs)]
      setNewRecord(previousBest === undefined || moves < previousBest)
      setFinished(true)
      setRunning(false)
      recordMemory(level.pairs, moves)
      playSound('win', soundOn)
    }
  }, [matched.length, deck.length, level, moves, recordMemory, soundOn, progress.memory.bestMoves])

  const startGame = (nextLevel: MemoryLevel) => {
    clearTimers()
    setLevel(nextLevel)
    setDeck(buildDeck(COUNTRIES, nextLevel.pairs))
    setFlipped([])
    setMatched([])
    setMoves(0)
    setSeconds(0)
    setRunning(false)
    setFinished(false)
    lockRef.current = false
    recordedRef.current = false
    setNewRecord(false)
  }

  const backToLevels = () => {
    clearTimers()
    setLevel(null)
    setDeck([])
    setFinished(false)
    setFlipped([])
    setMatched([])
    setNewRecord(false)
  }

  const handleFlip = (index: number) => {
    if (!level || finished || lockRef.current) return
    if (flipped.includes(index) || matched.includes(index)) return

    if (!running && !finished) setRunning(true)
    playSound('flip', soundOn)

    const next = [...flipped, index]
    setFlipped(next)
    if (next.length < 2) return

    lockRef.current = true
    setMoves((current) => current + 1)

    const [first, second] = next
    const isMatch = deck[first].pairId === deck[second].pairId
    const delay = isMatch ? 420 : 950

    const timer = window.setTimeout(() => {
      if (isMatch) {
        setMatched((current) => [...current, first, second])
        setFlipped([])
        playSound('collect', soundOn)
      } else {
        setFlipped([])
        playSound('wrong', soundOn)
      }
      lockRef.current = false
    }, delay)

    timeoutsRef.current.push(timer)
  }

  if (!level || deck.length === 0) {
    return <MemoryIntro onStart={startGame} />
  }

  const foundPairs = matched.length / 2
  const best = progress.memory.bestMoves[String(level.pairs)]
  const stars = starsFor(moves, level.pairs)

  const columns =
    level.pairs <= 3
      ? 'grid-cols-3'
      : level.pairs <= 6
        ? 'grid-cols-3 sm:grid-cols-4'
        : 'grid-cols-4 sm:grid-cols-5'

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={backToLevels} className={buttonStyles('ghost', 'sm')}>
          ← Сложность
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-xl border-2 border-white bg-white px-2.5 py-1.5 text-xs font-black shadow-sm">
            ⏱️ {formatTime(seconds)}
          </span>
          <span className="rounded-xl border-2 border-white bg-white px-2.5 py-1.5 text-xs font-black shadow-sm">
            👣 {moves} ходов
          </span>
          <span className="rounded-xl border-2 border-white bg-white px-2.5 py-1.5 text-xs font-black shadow-sm">
            🧩 {foundPairs}/{level.pairs}
          </span>
          <Button
            variant="sunny"
            size="sm"
            onClick={() => {
              playSound('click', soundOn)
              startGame(level)
            }}
          >
            ↻ Заново
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border-4 border-white bg-white/70 p-3 shadow-[0_10px_40px_rgba(47,35,80,0.10)] backdrop-blur sm:p-5">
        <h1 className="mb-3 text-center text-lg font-black">
          {level.emoji} {level.label} · {level.description}
        </h1>

        <div className={`grid ${columns} gap-2 sm:gap-3`}>
          {deck.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index)
            const isMatched = matched.includes(index)

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleFlip(index)}
                className={`card-flip aspect-[3/4] w-full ${isFlipped ? 'is-flipped' : ''} ${
                  isMatched ? 'pointer-events-none' : ''
                }`}
                aria-label={isFlipped ? `${card.country.name}` : 'Закрытая карточка'}
              >
                <div className="card-flip-inner">
                  <div className="card-face flex items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-grape via-sky to-mint shadow-[0_6px_0_rgba(47,35,80,0.15)]">
                    <div className="dot-grid absolute inset-0 opacity-30" />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-lg text-white backdrop-blur sm:h-12 sm:w-12 sm:text-2xl">
                      ?
                    </span>
                    <span className="absolute bottom-1.5 right-2 text-xs opacity-70" aria-hidden="true">
                      🦜
                    </span>
                  </div>

                  <div
                    className={`card-face card-face-back flex flex-col items-center justify-center overflow-hidden rounded-2xl border-4 bg-white p-1.5 text-center shadow-[0_6px_0_rgba(47,35,80,0.15)] ${
                      isMatched ? 'border-mint ring-2 ring-mint/40' : 'border-white'
                    }`}
                  >
                    {card.face === 'flag' ? (
                      <span className="w-full overflow-hidden rounded-lg">
                        <span className="block aspect-[3/2] w-full overflow-hidden rounded-lg bg-cream">
                          <Flag code={card.country.code} name={card.country.name} />
                        </span>
                      </span>
                    ) : (
                      <span className="px-0.5 text-[11px] font-black leading-tight text-ink sm:text-sm">
                        {card.country.name}
                      </span>
                    )}
                    {isMatched && (
                      <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint text-[10px] font-black text-white shadow star-pop">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-[11px] font-bold text-ink-soft">
        Нажми на карточку, чтобы перевернуть. Совпавшие пары остаются открытыми.
      </p>

      {finished && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 animate-fade-in bg-ink/60 backdrop-blur-sm" />
          <Confetti count={stars === 3 ? 120 : 70} />
          <div className="relative w-full max-w-md animate-bounce-in rounded-[2rem] border-4 border-white bg-cream p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sunny to-coral text-4xl shadow-[0_6px_0_rgba(47,35,80,0.12)]">
              {stars === 3 ? '🏆' : stars === 2 ? '🎉' : '🌱'}
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {stars === 3 ? 'Идеальная память!' : stars === 2 ? 'Все пары найдены!' : 'Готово!'}
            </h2>
            <p className="mt-1 text-sm font-bold text-ink-soft">
              {level.label} · {level.pairs} пар за {moves} ходов и {formatTime(seconds)}
            </p>

            <div className="mt-3 flex justify-center gap-1.5">
              {[0, 1, 2].map((star) => (
                <span
                  key={star}
                  className={`star-pop text-4xl ${star < stars ? 'text-sunny' : 'text-ink/10'}`}
                  style={{ animationDelay: `${star * 130}ms` }}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </div>

            <p className="mt-2 text-xs font-black text-mint">
              {newRecord ? '🎯 Новый рекорд по ходам!' : `Рекорд: ${best} ходов`}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Button fullWidth size="lg" onClick={() => startGame(level)}>
                🔄 Играть ещё
              </Button>
              <Button fullWidth variant="white" onClick={backToLevels}>
                Выбрать сложность
              </Button>
              <Link to="/collection" className="text-xs font-black text-grape underline decoration-2 underline-offset-4">
                Открыть альбом флагов →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
