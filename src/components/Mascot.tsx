import { useId } from 'react'
import type { ReactNode } from 'react'

interface MascotProps {
  className?: string
  /** Добавить лёгкое покачивание всему попугаю */
  float?: boolean
  title?: string
}

export function Mascot({ className = '', float = true, title = 'Попугай Кеша' }: MascotProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '')
  const bodyId = `kesha-body-${rawId}`
  const bellyId = `kesha-belly-${rawId}`
  const beakId = `kesha-beak-${rawId}`

  return (
    <div className={`${float ? 'animate-float' : ''} ${className}`}>
      <svg viewBox="0 0 260 260" role="img" aria-label={title} className="h-full w-full drop-shadow-xl">
        <defs>
          <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6ee7b0" />
            <stop offset="55%" stopColor="#2fbf8a" />
            <stop offset="100%" stopColor="#159c6d" />
          </linearGradient>
          <linearGradient id={bellyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="100%" stopColor="#ffd23f" />
          </linearGradient>
          <linearGradient id={beakId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffc15e" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        <ellipse cx="130" cy="236" rx="60" ry="11" fill="#2f2350" opacity="0.13" />

        <g>
          {/* хвост */}
          <g style={{ transformBox: 'fill-box', transformOrigin: 'top right' }} className="animate-swing">
            <path d="M108 188 C88 212 70 228 50 238 C72 236 100 222 120 198 Z" fill="#159c6d" />
            <path d="M118 194 C108 222 100 238 88 250 C108 242 126 222 134 200 Z" fill="#2fbf8a" />
            <path d="M124 198 C124 224 120 240 112 252 C128 240 138 222 142 202 Z" fill="#ffc93c" />
          </g>

          {/* лапки */}
          <g stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M113 202 v17 m0-17 -9 16 m9-16 8 15" />
            <path d="M151 202 v17 m0-17 -9 16 m9-16 8 15" />
          </g>

          {/* тело */}
          <ellipse cx="132" cy="150" rx="55" ry="61" fill={`url(#${bodyId})`} />
          <ellipse cx="143" cy="160" rx="33" ry="43" fill={`url(#${bellyId})`} />

          {/* крыло */}
          <g style={{ transformBox: 'fill-box', transformOrigin: 'top left' }} className="animate-swing">
            <path
              d="M87 126 C67 136 61 164 73 188 C83 204 103 202 114 185 C99 169 95 146 87 126 Z"
              fill="#23a878"
              stroke="#159c6d"
              strokeWidth="3"
            />
            <path
              d="M79 154 C83 167 91 178 101 184"
              stroke="#159c6d"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* хохолок */}
          <g style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }} className="animate-swing">
            <path d="M139 52 C133 36 138 22 151 12 C148 27 149 39 155 50 Z" fill="#2fbf8a" />
            <path d="M153 49 C152 31 160 19 176 14 C169 28 165 40 166 51 Z" fill="#43d39b" />
            <path d="M150 52 C156 38 166 31 180 30 C172 40 167 48 166 54 Z" fill="#159c6d" />
          </g>

          {/* голова */}
          <circle cx="148" cy="92" r="47" fill={`url(#${bodyId})`} />
          <ellipse cx="166" cy="100" rx="25" ry="28" fill="#fff3cf" />

          {/* глаз */}
          <g>
            <circle cx="166" cy="85" r="12.5" fill="#ffffff" />
            <circle cx="169" cy="86" r="7" fill="#2f2350" />
            <circle cx="172" cy="83" r="2.7" fill="#ffffff" />
            <ellipse
              cx="166"
              cy="85"
              rx="12.5"
              ry="12.5"
              fill="#2fbf8a"
              className="animate-blink"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          </g>

          {/* клюв */}
          <path d="M190 91 C207 91 215 101 205 108 C197 114 185 110 181 102 Z" fill={`url(#${beakId})`} />
          <path d="M182 108 C191 115 201 116 207 109 C202 120 190 122 181 116 Z" fill="#ea580c" />
          <circle cx="179" cy="112" r="6" fill="#ff9b9b" opacity="0.65" />

          {/* шарф путешественника */}
          <path d="M115 124 C129 141 161 145 181 130 L186 145 C162 159 131 153 107 136 Z" fill="#ff6b6b" />
          <path d="M177 142 L192 180 L164 158 Z" fill="#ff6b6b" />
          <circle cx="148" cy="140" r="7" fill="#ffc93c" />
          <path d="M148 135 l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z" fill="#fff8e7" />
        </g>
      </svg>
    </div>
  )
}

export function SpeechBubble({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm font-bold shadow-[0_6px_0_rgba(47,35,80,0.08)] ${className}`}
    >
      {children}
      <span className="absolute -bottom-[9px] left-7 h-4 w-4 rotate-45 border-b-2 border-r-2 border-ink/10 bg-white" />
    </div>
  )
}
