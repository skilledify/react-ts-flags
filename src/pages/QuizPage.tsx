import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Button, buttonStyles } from '../components/Button'
import { Confetti } from '../components/Confetti'
import { Flag } from '../components/Flag'
import { Mascot } from '../components/Mascot'
import { CONTINENTS, getContinent } from '../data/continents'
import { COUNTRIES, getCountriesByContinent } from '../data/countries'
import { playSound } from '../lib/audio'
import { useProgress } from '../lib/progress'
import { buildQuiz } from '../lib/quiz'
import type { QuizQuestion } from '../lib/quiz'
import type { ContinentInfo, Country } from '../types'

const LETTERS = ['A', 'B', 'C', 'D']

function QuizIntro() {
  const { progress, soundOn } = useProgress()
  const best =
    progress.quiz.bestTotal > 0
      ? `${progress.quiz.bestCorrect}/${progress.quiz.bestTotal}`
      : '—'

  const modes = [
    {
      id: 'all',
      name: 'Микс всего мира',
      emoji: '🌍',
      description: 'Флаги всех континентов вперемешку',
      from: '#7a5cff',
      to: '#ff5f8a',
    },
    ...CONTINENTS.map((continent: ContinentInfo) => ({
      id: continent.id,
      name: continent.name,
      emoji: continent.emoji,
      description: continent.tagline,
      from: continent.from,
      to: continent.to,
    })),
  ]

  return (
    <div className="space-y-7">
      <header className="grid items-center gap-4 overflow-hidden rounded-[2rem] border-4 border-white bg-white/80 p-5 shadow-[0_12px_40px_rgba(47,35,80,0.08)] backdrop-blur sm:grid-cols-[1fr_auto] sm:p-7">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-grape/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-grape">
            🎯 Викторина
          </span>
          <h1 className="mt-2 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            Проверь, как хорошо ты знаешь флаги!
          </h1>
          <p className="mt-2 max-w-xl text-sm font-bold leading-relaxed text-ink-soft">
            10 вопросов, 4 варианта и комбо за правильные ответы. Каждый верный ответ
            добавляет флаг в твой альбом.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-xl border-2 border-white bg-white px-3 py-1.5 text-xs font-black shadow-sm">
              🏅 Лучший результат: <span className="text-grape">{best}</span>
            </span>
            <span className="rounded-xl border-2 border-white bg-white px-3 py-1.5 text-xs font-black shadow-sm">
              💎 Идеальных игр: {progress.quiz.perfect}
            </span>
            <span className="rounded-xl border-2 border-white bg-white px-3 py-1.5 text-xs font-black shadow-sm">
              🔥 Комбо: {progress.quiz.bestStreak}
            </span>
          </div>
        </div>

        <Mascot className="mx-auto h-40 w-40 sm:h-48 sm:w-48" />
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode, index) => (
          <Link
            key={mode.id}
            to={`/quiz/${mode.id}`}
            onClick={() => playSound('click', soundOn)}
            className="group relative animate-fade-up overflow-hidden rounded-3xl border-4 border-white p-5 text-white shadow-[0_8px_0_rgba(47,35,80,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_0_rgba(47,35,80,0.10)]"
            style={{
              animationDelay: `${index * 60}ms`,
              backgroundImage: `linear-gradient(135deg, ${mode.from}, ${mode.to})`,
            }}
          >
            <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15" />
            <div className="flex items-start justify-between">
              <span className="text-4xl drop-shadow-sm" aria-hidden="true">
                {mode.emoji}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg backdrop-blur transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white/30">
                →
              </span>
            </div>
            <h2 className="mt-3 text-xl font-black leading-tight">{mode.name}</h2>
            <p className="mt-0.5 text-xs font-bold text-white/85">{mode.description}</p>
            <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-white/70">
              10 вопросов
            </p>
          </Link>
        ))}
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { emoji: '🖼️', title: 'Три типа вопросов', text: 'Угадай страну по флагу, флаг по стране и столицу.' },
          { emoji: '🔥', title: 'Комбо-серия', text: 'Отвечай подряд без ошибок — очки растут как на дрожжах!' },
          { emoji: '⭐', title: 'Звёзды за игру', text: 'Собери 3 звезды, ответив почти на все вопросы.' },
        ].map((rule) => (
          <div key={rule.title} className="rounded-2xl border-2 border-white bg-white/70 p-4 backdrop-blur">
            <span className="text-2xl" aria-hidden="true">
              {rule.emoji}
            </span>
            <p className="mt-1.5 text-sm font-black">{rule.title}</p>
            <p className="text-xs font-bold leading-relaxed text-ink-soft">{rule.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

function optionClasses(state: 'idle' | 'correct' | 'wrong' | 'muted'): string {
  const base =
    'relative flex w-full items-center gap-3 rounded-2xl border-4 bg-white p-3 text-left font-extrabold transition-all duration-200'
  if (state === 'correct') return `${base} scale-[1.02] border-mint bg-mint/15 shadow-[0_5px_0_rgba(67,201,184,0.4)]`
  if (state === 'wrong') return `${base} animate-shake border-coral bg-coral/10 shadow-[0_5px_0_rgba(255,122,112,0.35)]`
  if (state === 'muted') return `${base} border-white opacity-45`
  return `${base} border-white shadow-[0_5px_0_rgba(47,35,80,0.10)] hover:-translate-y-0.5 hover:border-grape/40 hover:shadow-[0_7px_0_rgba(47,35,80,0.10)]`
}

interface QuizRoundProps {
  pool: Country[]
  title: string
  continent?: ContinentInfo
  onRestart: () => void
}

function QuizRound({ pool, title, continent, onRestart }: QuizRoundProps) {
  const { collect, recordQuiz, soundOn } = useProgress()
  const [questions] = useState<QuizQuestion[]>(() => buildQuiz(pool, 10))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [score, setScore] = useState(0)
  const [gain, setGain] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [wrong, setWrong] = useState<Country[]>([])
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border-4 border-white bg-white/85 p-8 text-center">
        <p className="text-3xl">🧭</p>
        <h1 className="mt-2 text-2xl font-black">Пока маловато флагов</h1>
        <p className="mt-1 text-sm font-bold text-ink-soft">Выбери другой континент или микс.</p>
        <Link to="/quiz" className={`${buttonStyles('primary', 'md')} mt-4`}>
          Выбрать режим
        </Link>
      </div>
    )
  }

  const question = questions[index]
  const isCorrect = selected === question.country.code
  const accent = continent?.accent ?? '#7a5cff'
  const progressPercent = ((index + (answered ? 1 : 0)) / questions.length) * 100

  const handleAnswer = (option: Country) => {
    if (answered) return
    const right = option.code === question.country.code
    setSelected(option.code)
    setAnswered(true)

    if (right) {
      const nextStreak = streak + 1
      const points = 10 + Math.min(nextStreak - 1, 5) * 2
      setStreak(nextStreak)
      setBestStreak((current) => Math.max(current, nextStreak))
      setCorrect((current) => current + 1)
      setScore((current) => current + points)
      setGain(points)
      collect(question.country.code)
      playSound('correct', soundOn)
    } else {
      setStreak(0)
      setGain(0)
      setWrong((current) =>
        current.some((country) => country.code === question.country.code)
          ? current
          : [...current, question.country],
      )
      playSound('wrong', soundOn)
    }
  }

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true)
      recordQuiz({ correct, total: questions.length, bestStreak })
      playSound(correct / questions.length >= 0.6 ? 'win' : 'click', soundOn)
      return
    }
    setIndex((current) => current + 1)
    setSelected(null)
    setAnswered(false)
    setGain(0)
  }

  if (finished) {
    return (
      <QuizResult
        correct={correct}
        total={questions.length}
        score={score}
        bestStreak={bestStreak}
        wrong={wrong}
        title={title}
        onRestart={onRestart}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to="/quiz" className={buttonStyles('ghost', 'sm')}>
          ← Режимы
        </Link>
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <span className="flex animate-flame items-center gap-1 rounded-xl bg-coral/15 px-2.5 py-1.5 text-xs font-black text-coral">
              🔥 комбо ×{streak}
            </span>
          )}
          <span className="rounded-xl border-2 border-white bg-white px-2.5 py-1.5 text-xs font-black shadow-sm">
            ⭐ {score}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-ink-soft">
          <span>
            {title} · вопрос {index + 1} из {questions.length}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/80">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${Math.max(progressPercent, 2)}%`, backgroundColor: accent }}
          />
        </div>
      </div>

      <section className="rounded-[2rem] border-4 border-white bg-white/85 p-4 shadow-[0_12px_40px_rgba(47,35,80,0.10)] backdrop-blur sm:p-6">
        {question.kind === 'flag-country' && (
          <div className="text-center">
            <h1 className="text-xl font-black sm:text-2xl">Чей это флаг?</h1>
            <div className="mx-auto mt-4 w-56 -rotate-1 sm:w-72">
              <div className="rounded-2xl border-4 border-white bg-white p-1.5 shadow-lg">
                <div className="aspect-[3/2] overflow-hidden rounded-xl bg-cream">
                  <Flag code={question.country.code} name="Загадка" loading="eager" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold text-ink-soft">Выбери страну из четырёх вариантов</p>
          </div>
        )}

        {question.kind === 'country-flag' && (
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Найди флаг страны</p>
            <h1 className="mt-1 text-balance text-3xl font-black leading-tight sm:text-4xl">
              {question.country.name}
            </h1>
            <p className="mt-1 text-sm font-bold text-ink-soft">
              Столица: {question.country.capital}
            </p>
            <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
              🏳️ Один из четырёх флагов — правильный
            </div>
          </div>
        )}

        {question.kind === 'capital' && (
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="w-28 shrink-0 -rotate-2">
              <div className="rounded-xl border-4 border-white bg-white p-1 shadow-md">
                <div className="aspect-[3/2] overflow-hidden rounded-md">
                  <Flag code={question.country.code} name={question.country.name} loading="eager" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-ink-soft">Какая столица?</p>
              <h1 className="mt-0.5 text-2xl font-black leading-tight sm:text-3xl">{question.country.name}</h1>
              <p className="text-sm font-bold text-ink-soft">Выбери правильный город</p>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.options.map((option, optionIndex) => {
            const state = answered
              ? option.code === question.country.code
                ? 'correct'
                : option.code === selected
                  ? 'wrong'
                  : 'muted'
              : 'idle'

            if (question.kind === 'country-flag') {
              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`${optionClasses(state)} p-1.5`}
                  aria-label={`Флаг страны ${option.name}`}
                >
                  <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-cream">
                    <Flag code={option.code} name={option.name} />
                  </div>
                  {answered && option.code === question.country.code && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-mint text-sm text-white shadow star-pop">
                      ✓
                    </span>
                  )}
                </button>
              )
            }

            const label = question.kind === 'capital' ? option.capital : option.name

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={optionClasses(state)}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    state === 'correct'
                      ? 'bg-mint text-white'
                      : state === 'wrong'
                        ? 'bg-coral text-white'
                        : 'bg-cream text-ink-soft'
                  }`}
                >
                  {state === 'correct' ? '✓' : state === 'wrong' ? '✕' : LETTERS[optionIndex]}
                </span>
                <span className="text-[15px] leading-tight">{label}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-4 animate-fade-up rounded-2xl border-2 border-white bg-cream/90 p-3.5">
            <div className="flex items-start gap-3">
              <Mascot float={false} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1" aria-live="polite">
                <p className="text-sm font-black">
                  {isCorrect ? `Верно! +${gain} очков` : `Почти! Правильно: ${question.country.name}`}
                  {isCorrect && streak > 2 && <span className="ml-1 text-coral">🔥</span>}
                </p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink-soft">{question.country.fact}</p>
              </div>
            </div>
            <Button fullWidth className="mt-3" onClick={handleNext} variant={isCorrect ? 'primary' : 'sunny'}>
              {index + 1 >= questions.length ? '🏁 Показать результат' : 'Дальше →'}
            </Button>
          </div>
        )}
      </section>

      <p className="text-center text-[11px] font-bold text-ink-soft">
        Подсказка: название страны помогает вспомнить, как выглядит её флаг 🧠
      </p>
    </div>
  )
}

function QuizResult({
  correct,
  total,
  score,
  bestStreak,
  wrong,
  title,
  onRestart,
}: {
  correct: number
  total: number
  score: number
  bestStreak: number
  wrong: Country[]
  title: string
  onRestart: () => void
}) {
  const percent = Math.round((correct / total) * 100)
  const stars = percent >= 90 ? 3 : percent >= 60 ? 2 : 1
  const heading = stars === 3 ? 'Невероятно!' : stars === 2 ? 'Отличная игра!' : 'Хорошее начало!'
  const subheading =
    stars === 3
      ? 'Ты ответил почти на всё правильно. Настоящий знаток флагов!'
      : stars === 2
        ? 'Больше половины флагов уже узнаёшь. Ещё немного тренировки!'
        : 'Каждая игра делает тебя умнее. Попробуй ещё раз!'

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {stars >= 2 && <Confetti count={stars === 3 ? 130 : 80} />}

      <section className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-white/90 p-6 text-center shadow-[0_14px_50px_rgba(47,35,80,0.12)] backdrop-blur sm:p-8">
        <div className="pointer-events-none absolute -left-6 -top-8 h-32 w-32 rounded-full bg-sunny/20" />
        <div className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-mint/15" />

        <p className="text-xs font-black uppercase tracking-widest text-ink-soft">{title}</p>
        <div className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-sunny to-coral text-5xl shadow-[0_8px_0_rgba(47,35,80,0.12)] animate-bounce-in">
          {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🌱'}
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{heading}</h1>
        <p className="mx-auto mt-1.5 max-w-md text-sm font-bold text-ink-soft">{subheading}</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 1, 2].map((star) => (
            <span
              key={star}
              className={`star-pop text-4xl ${star < stars ? 'text-sunny drop-shadow-[0_3px_0_rgba(47,35,80,0.15)]' : 'text-ink/10'}`}
              style={{ animationDelay: `${star * 140}ms` }}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
        <p className="mt-1 text-sm font-black text-ink-soft">
          {correct} из {total} правильных · {percent}%
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { label: 'Очки', value: score, emoji: '⭐' },
            { label: 'Верных', value: `${correct}/${total}`, emoji: '✅' },
            { label: 'Комбо', value: bestStreak, emoji: '🔥' },
            { label: 'Звёзды', value: `${stars}/3`, emoji: '🌟' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-cream p-2.5">
              <span className="text-base" aria-hidden="true">
                {stat.emoji}
              </span>
              <p className="text-lg font-black leading-none tabular-nums">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-black uppercase tracking-wide text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button fullWidth onClick={onRestart} size="lg">
            🔄 Играть ещё
          </Button>
          <Link to="/quiz" className={`${buttonStyles('white', 'lg')} w-full`}>
            🎲 Другая тема
          </Link>
        </div>
        <Link
          to="/collection"
          className="mt-3 inline-block text-xs font-black text-grape underline decoration-2 underline-offset-4 hover:text-ink"
        >
          Посмотреть, какие флаги добавились в альбом →
        </Link>
      </section>

      {wrong.length > 0 && (
        <section className="rounded-3xl border-2 border-white bg-white/75 p-5 backdrop-blur">
          <h2 className="text-lg font-black">Запомни эти флаги</h2>
          <p className="text-xs font-bold text-ink-soft">Они ещё не в альбоме — потренируйся и возвращайся!</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {wrong.map((country) => (
              <Link
                key={country.code}
                to={`/map/${country.continent}`}
                className="flex items-center gap-2 rounded-xl border-2 border-white bg-white p-1.5 pr-3 shadow-sm transition hover:-translate-y-0.5"
              >
                <span className="h-7 w-10 overflow-hidden rounded-md bg-cream">
                  <Flag code={country.code} name={country.name} />
                </span>
                <span className="text-xs font-black">{country.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export function QuizPage() {
  const { category } = useParams()

  if (!category) return <QuizIntro />

  const isMix = category === 'all'
  const continent = isMix ? undefined : getContinent(category)

  if (!isMix && !continent) return <Navigate to="/quiz" replace />

  const pool = isMix ? COUNTRIES : getCountriesByContinent(category)
  const title = continent ? `${continent.emoji} ${continent.name}` : '🌍 Микс'

  return <QuizGame pool={pool} title={title} continent={continent} />
}

function QuizGame({
  pool,
  title,
  continent,
}: {
  pool: Country[]
  title: string
  continent?: ContinentInfo
}) {
  const [round, setRound] = useState(0)

  return (
    <QuizRound
      key={`${continent?.id ?? 'mix'}-${round}`}
      pool={pool}
      title={title}
      continent={continent}
      onRestart={() => setRound((current) => current + 1)}
    />
  )
}
