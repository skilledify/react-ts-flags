import type { Country } from '../types'
import { Flag } from './Flag'

interface FlagCardProps {
  country: Country
  collected: boolean
  onOpen: (country: Country) => void
  index?: number
}

export function FlagCard({ country, collected, onOpen, index = 0 }: FlagCardProps) {
  const tilt =
    (((country.code.charCodeAt(0) + country.code.charCodeAt(1)) % 5) - 2) * 1.1

  return (
    <button
      type="button"
      onClick={() => onOpen(country)}
      className="group block w-full animate-fade-up text-left"
      style={{ animationDelay: `${Math.min(index * 35, 420)}ms` }}
      aria-label={`${country.name}${collected ? ' — флаг уже в альбоме' : ' — открыть флаг'}`}
    >
      <div
        className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-0"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <div className="relative rounded-2xl bg-white p-2 pb-2.5 shadow-[0_8px_0_rgba(47,35,80,0.10)] ring-2 ring-white">
          <span className="sticker-tape" aria-hidden="true" />
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-cream">
            <Flag
              code={country.code}
              name={country.name}
              className={
                collected
                  ? 'transition-transform duration-500 group-hover:scale-105'
                  : 'scale-105 opacity-70 blur-[4px] saturate-50'
              }
            />
            {!collected && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-lg shadow-lg">
                  🔒
                </span>
              </span>
            )}
            {collected && (
              <span className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-sm shadow star-pop">
                ⭐
              </span>
            )}
          </div>
          <div className="px-1 pt-2">
            <p className="truncate text-sm font-black leading-tight text-ink">{country.name}</p>
            <p
              className={`mt-0.5 text-[11px] font-extrabold ${
                collected ? 'text-mint' : 'text-ink-soft'
              }`}
            >
              {collected ? '✓ в альбоме' : 'Открыть флаг'}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
