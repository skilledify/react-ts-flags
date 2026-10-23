import { useProgress } from '../lib/progress'

export function ToastHost() {
  const { toasts, dismissToast } = useProgress()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[70] flex w-[min(90vw,20rem)] flex-col gap-2 md:bottom-6 md:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex animate-bounce-in items-center gap-3 rounded-2xl border-2 border-sunny bg-white p-3 shadow-[0_10px_30px_rgba(47,35,80,0.18)]"
          role="status"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sunny to-coral text-2xl shadow-inner">
            {toast.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wide text-coral">{toast.title}</p>
            <p className="truncate text-sm font-extrabold text-ink">{toast.description}</p>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
            aria-label="Закрыть уведомление"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
