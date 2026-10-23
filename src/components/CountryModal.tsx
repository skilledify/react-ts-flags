import { useEffect, useRef, useState } from 'react'
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

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end justify-center sm:items-center sm:p-6"
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

      <div className="no-scrollbar relative max-h-[93svh] w-full max-w-xl animate-bounce-in overflow-y-auto rounded-t-[2.2rem] bg-cream shadow-2xl sm:rounded-[2.2rem]">
        <div
          className="relative overflow-hidden px-5 pb-7 pt-9 text-white sm:px-7"
          style={{ backgroundImage: `linear-gradient(135deg, ${continent?.from}, ${continent?.to})` }}
        >
          <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/15" />
          <div className="pointer-events-none absolute -bottom-16 right-4 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute right-24 top-6 text-2xl opacity-70 animate-float">✨</div>
          <div className="pointer-events-none absolute left-10 top-24 text-xl opacity-60 animate-float-slow">⭐</div>

          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              playSound('click', soundOn)
              onClose()
            }}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-black backdrop-blur transition hover:rotate-90 hover:bg-white/30"
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="flex flex-col items-center">
            <div className="relative w-52 -rotate-2 sm:w-64">
              <div className="rounded-2xl border-4 border-white bg-white p-1.5 shadow-2xl">
                <div className="aspect-[3/2] overflow-hidden rounded-xl bg-cream">
                  <Flag code={country.code} name={country.name} loading="eager" className={collected ? '' : 'animate-wave'} />
                </div>
              </div>
              {justCollected && (
                <span className="star-pop absolute -right-3 -top-3 rotate-6 rounded-full border-2 border-white bg-sunny px-3 py-1 text-xs font-black text-ink shadow-lg">
                  В альбоме! ★
                </span>
              )}
            </div>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold backdrop-blur">
              <span aria-hidden="true">{continent?.emoji}</span>
              {continent?.name}
            </span>
            <h2
              id="country-modal-title"
              className="mt-1.5 text-balance text-center text-3xl font-black leading-tight drop-shadow-sm sm:text-4xl"
            >
              {country.name}
            </h2>
            <p className="mt-1 text-sm font-bold text-white/90">🏛️ Столица: {country.capital}</p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="rounded-2xl border-2 border-sunny/60 bg-bubble/50 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ink-soft">
              <span className="text-lg" aria-hidden="true">💡</span>
              А знаешь ли ты?
            </p>
            <p className="mt-1.5 text-[15px] font-bold leading-relaxed text-ink">{country.fact}</p>
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {collected ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-mint/40 bg-mint/10 px-4 py-3 text-base font-black text-ink">
                <span className="star-pop text-xl" aria-hidden="true">✅</span>
                Флаг уже в твоём альбоме!
              </div>
            ) : (
              <Button size="lg" fullWidth onClick={handleCollect} className="animate-pop">
                ✨ Открыть флаг и добавить в альбом
              </Button>
            )}
            <Button variant="white" fullWidth onClick={handleListen}>
              🔊 Послушать про страну
            </Button>
          </div>

          <p className="mt-4 text-center text-[11px] font-bold text-ink-soft">
            Совет: рассмотри флаг внимательно — скоро он встретится в викторине!
          </p>
        </div>
      </div>

      {burst && <Confetti count={70} burst />}
    </div>
  )
}
