import { useMemo } from 'react'
import type { CSSProperties } from 'react'

const COLORS = ['#7a5cff', '#ffc93c', '#ff7a70', '#43c9b8', '#58b9f7', '#ff8fc8', '#8be28b']

interface ConfettiProps {
  count?: number
  /** Немного разлетается из центра, а не только падает сверху */
  burst?: boolean
}

interface Piece {
  id: number
  left: number
  color: string
  delay: number
  duration: number
  drift: number
  spin: number
  width: number
  height: number
  round: boolean
}

function makePieces(count: number, burst: boolean): Piece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: burst ? 35 + Math.random() * 30 : Math.random() * 100,
    color: COLORS[index % COLORS.length],
    delay: Math.random() * (burst ? 0.5 : 1.4),
    duration: 2.4 + Math.random() * 1.8,
    drift: (Math.random() - 0.5) * (burst ? 320 : 220),
    spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720),
    width: 7 + Math.random() * 7,
    height: 9 + Math.random() * 10,
    round: Math.random() > 0.6,
  }))
}

export function Confetti({ count = 80, burst = false }: ConfettiProps) {
  const pieces = useMemo(() => makePieces(count, burst), [count, burst])

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={
            {
              left: `${piece.left}%`,
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
              borderRadius: piece.round ? '999px' : '3px',
              '--delay': `${piece.delay}s`,
              '--duration': `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
