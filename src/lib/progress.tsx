import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { BADGES, isBadgeEarned } from '../data/badges'
import { playSound, stopSpeaking } from '../lib/audio'
import type { BadgeDef, GameProgress, ToastMessage } from '../types'

const STORAGE_KEY = 'flagoland.progress.v1'

const DEFAULT_PROGRESS: GameProgress = {
  collected: {},
  quiz: {
    games: 0,
    bestCorrect: 0,
    bestTotal: 0,
    perfect: 0,
    bestStreak: 0,
    totalCorrect: 0,
  },
  memory: {
    games: 0,
    bestMoves: {},
  },
  sound: true,
  voice: true,
}

function loadProgress(): GameProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROGRESS
    const parsed = JSON.parse(raw) as Partial<GameProgress>
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      collected: parsed.collected ?? {},
      quiz: { ...DEFAULT_PROGRESS.quiz, ...parsed.quiz },
      memory: {
        ...DEFAULT_PROGRESS.memory,
        ...parsed.memory,
        bestMoves: parsed.memory?.bestMoves ?? {},
      },
      sound: parsed.sound ?? true,
      voice: parsed.voice ?? true,
    }
  } catch {
    return DEFAULT_PROGRESS
  }
}

type QuizResult = {
  correct: number
  total: number
  bestStreak: number
}

interface ProgressContextValue {
  progress: GameProgress
  soundOn: boolean
  voiceOn: boolean
  collectedCount: number
  isCollected: (code: string) => boolean
  collect: (code: string) => boolean
  recordQuiz: (result: QuizResult) => void
  recordMemory: (pairs: number, moves: number) => void
  toggleSound: () => void
  toggleVoice: () => void
  resetProgress: () => void
  earnedBadges: BadgeDef[]
  toasts: ToastMessage[]
  dismissToast: (id: string) => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>(loadProgress)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [earnedIds, setEarnedIds] = useState<Set<string>>(
    () => new Set(BADGES.filter((badge) => isBadgeEarned(badge, loadProgress())).map((b) => b.id)),
  )
  const toastCounter = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Приватный режим или переполненное хранилище — играем без сохранения.
    }
  }, [progress])

  const earnedBadges = useMemo(
    () => BADGES.filter((badge) => isBadgeEarned(badge, progress)),
    [progress],
  )

  useEffect(() => {
    const fresh = earnedBadges.filter((badge) => !earnedIds.has(badge.id))
    if (fresh.length === 0) return
    setEarnedIds(new Set(earnedBadges.map((badge) => badge.id)))
    setToasts((current) => [
      ...current,
      ...fresh.map((badge) => {
        toastCounter.current += 1
        return {
          id: `toast-${toastCounter.current}-${badge.id}`,
          emoji: badge.emoji,
          title: 'Новая награда!',
          description: badge.title,
        }
      }),
    ])
    playSound('collect', progress.sound)
  }, [earnedBadges, earnedIds, progress.sound])

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id))
      }, 4800),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [toasts])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const collect = useCallback(
    (code: string): boolean => {
      if (progress.collected[code]) return false
      setProgress((current) => {
        if (current.collected[code]) return current
        return { ...current, collected: { ...current.collected, [code]: true } }
      })
      return true
    },
    [progress.collected],
  )

  const recordQuiz = useCallback((result: QuizResult) => {
    setProgress((current) => {
      const isBetter =
        result.correct / result.total > current.quiz.bestCorrect / (current.quiz.bestTotal || 1)
      return {
        ...current,
        quiz: {
          games: current.quiz.games + 1,
          bestCorrect: isBetter ? result.correct : current.quiz.bestCorrect,
          bestTotal: isBetter ? result.total : current.quiz.bestTotal,
          perfect: current.quiz.perfect + (result.correct === result.total ? 1 : 0),
          bestStreak: Math.max(current.quiz.bestStreak, result.bestStreak),
          totalCorrect: current.quiz.totalCorrect + result.correct,
        },
      }
    })
  }, [])

  const recordMemory = useCallback((pairs: number, moves: number) => {
    setProgress((current) => {
      const key = String(pairs)
      const previous = current.memory.bestMoves[key]
      return {
        ...current,
        memory: {
          games: current.memory.games + 1,
          bestMoves: {
            ...current.memory.bestMoves,
            [key]: previous === undefined ? moves : Math.min(previous, moves),
          },
        },
      }
    })
  }, [])

  const toggleSound = useCallback(() => {
    setProgress((current) => {
      const next = !current.sound
      if (next) playSound('click', true)
      return { ...current, sound: next }
    })
  }, [])

  const toggleVoice = useCallback(() => {
    stopSpeaking()
    setProgress((current) => ({ ...current, voice: !current.voice }))
  }, [])

  const resetProgress = useCallback(() => {
    stopSpeaking()
    setToasts([])
    setEarnedIds(new Set())
    setProgress({ ...DEFAULT_PROGRESS, collected: {}, quiz: { ...DEFAULT_PROGRESS.quiz }, memory: { games: 0, bestMoves: {} } })
  }, [])

  const isCollected = useCallback(
    (code: string) => Boolean(progress.collected[code]),
    [progress.collected],
  )

  const value: ProgressContextValue = {
    progress,
    soundOn: progress.sound,
    voiceOn: progress.voice,
    collectedCount: Object.keys(progress.collected).length,
    isCollected,
    collect,
    recordQuiz,
    recordMemory,
    toggleSound,
    toggleVoice,
    resetProgress,
    earnedBadges,
    toasts,
    dismissToast,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress должен использоваться внутри ProgressProvider')
  return context
}
