import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getContinent } from '../data/continents'
import { playSound, speak, stopSpeaking } from '../lib/audio'
import { useProgress } from '../lib/progress'
import type { Country } from '../types'
import { Button } from './Button'
import { Confetti } from './Confetti'
import { Flag } from './Flag'

interface CountryModalProps {
  country: Country
  onClose: () => void
}

export function CountryModal({ country, onClose }: CountryModalProps) {
  const { collect, isCollected, soundOn, voiceOn } = useProgress()
  const [justCollected, setJustCollected] = useState(false)
  const [burst, setBurst] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const collected = isCollected(country.code)
  const continent = getContinent(country.continent)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      stopSpeaking()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!voiceOn) return
    const timer = window.setTimeout(() => {
      speak(`${country.name}. Столица: ${country.capital}`, voiceOn)
    }, 450)
    return () => window.clearTimeout(timer)
  }, [country, voiceOn])

  useEffect(() => {
    if (!burst) return
    const timer = window.setTimeout(() => setBurst(false), 3200)
    return () => window.clearTimeout(timer)
  }, [burst])

  const handleCollect = () => {
    if (collected) return
    collect(country.code)
    setJustCollected(true)
    setBurst(true)
    playSound('collect', soundOn)
    speak(`Отлично! ${country.name} теперь в альбоме`, voiceOn)
  }

  const handleListen = () => {
    playSound('click', soundOn)
    speak(`${country.name}. Столица: ${country.capital}. ${country.fact}`, true)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="country-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 animate-fade-in bg-ink/60 backdrop-blur-sm"
        onClick={() => {
          playSound('click', soundOn)
          onClose()
        }}
        aria-label="Закрыть карточку"
        tabIndex={-1}
      />

      <div className="relative flex max-h-[90dvh] w-full max-w-lg animate-bounce-in flex-col overflow-hidden rounded-[1.75rem] bg-cream shadow-2xl sm:max-h-[84dvh]">
        <div
          className="relative shrink-0 overflow-hidden px-4 pb-4 pt-5 text-white sm:px-6 sm:pb-5 sm:pt-6"
          style={{ backgroundImage: `linear-gradient(135deg, ${continent?.from}, ${continent?.to})` }}
        >
          <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/15 sm:h-36 sm:w-36" />
          <div className="pointer-events-none absolute -bottom-10 right-2 h-28 w-28 rounded-full bg-white/10 sm:-bottom-14 sm:h-40 sm:w-40" />
          <div className="pointer-events-none absolute right-20 top-4 text-xl opacity-70 animate-float sm:right-24 sm:top-5 sm:text-2xl">✨</div>
          <div className="pointer-events-none absolute bottom-3 left-6 text-base opacity-60 animate-float-slow sm:text-xl">⭐</div>

          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              playSound('click', soundOn)
              onClose()
            }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-base font-black backdrop-blur transition hover:rotate-90 hover:bg-white/30 sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:text-lg"
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="flex items-center gap-3 pr-8 sm:gap-5 sm:pr-9">
            <div className="relative w-24 shrink-0 -rotate-2 min-[400px]:w-28 sm:w-32">
              <div className="rounded-xl border-4 border-white bg-white p-1 shadow-xl sm:rounded-2xl sm:p-1.5">
                <div className="aspect-[3/2] overflow-hidden rounded-lg bg-cream sm:rounded-xl">
                  <Flag code={country.code} name={country.name} loading="eager" className={collected ? '' : 'animate-wave'} />
                </div>
              </div>
              {justCollected && (
                <span className="star-pop absolute -right-2 -top-2 rotate-6 whitespace-nowrap rounded-full border-2 border-white bg-sunny px-2 py-0.5 text-[10px] font-black text-ink shadow-lg sm:-right-3 sm:-top-3 sm:px-3 sm:py-1 sm:text-xs">
                  В альбоме! ★
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold backdrop-blur sm:px-3 sm:py-1 sm:text-xs">
                <span aria-hidden="true">{continent?.emoji}</span>
                <span className="truncate">{continent?.name}</span>
              </span>
              <h2
                id="country-modal-title"
                className="mt-1 text-balance text-xl font-black leading-tight drop-shadow-sm sm:text-2xl"
              >
                {country.name}
              </h2>
              <p className="mt-0.5 truncate text-xs font-bold text-white/90 sm:text-sm">
                🏛️ Столица: {country.capital}
              </p>
            </div>
          </div>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="rounded-xl border-2 border-sunny/60 bg-bubble/50 p-3 sm:rounded-2xl sm:p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-ink-soft sm:text-xs">
              <span className="text-base sm:text-lg" aria-hidden="true">💡</span>
              А знаешь ли ты?
            </p>
            <p className="mt-1 text-sm font-bold leading-relaxed text-ink sm:mt-1.5 sm:text-[15px]">{country.fact}</p>
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
            {collected ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-mint/40 bg-mint/10 px-3 py-2.5 text-sm font-black text-ink sm:col-span-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-base">
                <span className="star-pop text-lg sm:text-xl" aria-hidden="true">✅</span>
                Флаг уже в твоём альбоме!
              </div>
            ) : (
              <Button size="md" fullWidth onClick={handleCollect} className="animate-pop">
                ✨ Открыть флаг и добавить в альбом
              </Button>
            )}
            <Button
              variant="white"
              size="md"
              fullWidth
              onClick={handleListen}
              className={collected ? 'sm:col-span-2' : undefined}
            >
              🔊 Послушать про страну
            </Button>
          </div>

          <p className="mt-3 text-center text-[11px] font-bold text-ink-soft">
            Совет: рассмотри флаг внимательно — скоро он встретится в викторине!
          </p>
        </div>
      </div>

      {burst && <Confetti count={70} burst />}
    </div>,
    document.body,
  )
}
