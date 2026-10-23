import type { ReactNode } from 'react'

interface ProgressRingProps {
  value: number
  total: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
}

export function ProgressRing({
  value,
  total,
  size = 84,
  stroke = 9,
  color = '#7a5cff',
  track = 'rgba(47, 35, 80, 0.12)',
  children,
}: ProgressRingProps) {
  const safeTotal = total || 1
  const percent = Math.min(1, value / safeTotal)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * percent} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {children ?? (
          <>
            <span className="text-lg font-black">{value}</span>
            <span className="text-[10px] font-bold text-ink-soft">из {total}</span>
          </>
        )}
      </div>
    </div>
  )
}
