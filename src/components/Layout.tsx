import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { TOTAL_COUNTRIES } from '../data/countries'
import { useProgress } from '../lib/progress'
import { Clouds } from './Clouds'
import { ToastHost } from './ToastHost'

const NAV_ITEMS = [
  { to: '/map', label: 'Карта', emoji: '🗺️' },
  { to: '/quiz', label: 'Викторина', emoji: '🎯' },
  { to: '/memory', label: 'Пары', emoji: '🃏' },
  { to: '/collection', label: 'Альбом', emoji: '📔' },
  { to: '/achievements', label: 'Награды', emoji: '🏆' },
]

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Флажок — на главную">
      <span className="flex justify-center items-center bg-gradient-to-br from-grape via-sky to-mint shadow-[0_4px_0_#5a3ee6] rounded-2xl w-11 md:w-12 h-11 md:h-12 text-2xl group-hover:rotate-12 transition-transform duration-300">
        🌍
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-fairy md:text-[1.6rem] text-xl leading-none tracking-wide">Флажок</span>
        <span className="hidden sm:block mt-1 font-bold text-[10px] text-ink-soft sm:text-[11px] uppercase tracking-widest">
          мир на ладошке
        </span>
      </span>
    </Link>
  )
}

function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}) {
  const { collectedCount, soundOn, toggleSound } = useProgress()

  return (
    <header className="top-0 z-40 sticky bg-white/95 backdrop-blur-xl border-white/80 border-b-2">
      <div className="flex items-center justify-between gap-2 mx-auto px-3 sm:px-4 max-w-6xl h-14 sm:h-16 md:h-20">
        <Logo />


        <nav className="hidden min-[920px]:flex items-center gap-1 sm:gap-1.5 min-[920px]:gap-2 ml-auto" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-grape text-white shadow-[0_4px_0_#5a3ee6]'
                    : 'text-ink-soft hover:-translate-y-0.5 hover:bg-white hover:text-ink',
                ].join(' ')
              }
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 ml-auto md:ml-2">
          <Link
            to="/collection"
            className="flex items-center gap-1.5 bg-white/90 shadow-sm px-2.5 py-1.5 border-2 border-white hover:border-sunny rounded-xl font-black text-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-2"
            title="Открыть альбом флагов"
            aria-label={`Мой альбом — собрано ${collectedCount} из ${TOTAL_COUNTRIES} флагов`}
          >
            <span aria-hidden="true">🚩</span>
            <span className="tabular-nums">
              {collectedCount}
              <span className="hidden sm:inline text-ink-soft">/{TOTAL_COUNTRIES}</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleSound}
            className="flex justify-center items-center shrink-0 bg-white/90 hover:bg-white shadow-sm rounded-xl w-10 h-10 text-lg transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-2"
            aria-label={soundOn ? 'Выключить звуки' : 'Включить звуки'}
            aria-pressed={soundOn}
            title={soundOn ? 'Звуки включены' : 'Звуки выключены'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Закрыть навигацию' : 'Открыть навигацию'}
            className="min-[920px]:hidden shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 shadow-sm border border-white hover:bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-2"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      className="md:hidden bottom-0 safe-bottom z-40 fixed inset-x-0 bg-white/90 backdrop-blur-xl border-white/80 border-t-2"
      aria-label="Мобильная навигация"
    >
      <div className="gap-1 grid grid-cols-5 mx-auto px-2 py-2 max-w-md">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-[10px] font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape focus-visible:ring-offset-1',
                isActive ? 'bg-grape/10 text-grape' : 'text-ink-soft',
              ].join(' ')
            }
          >
            <span className={`text-xl transition-transform ${item.to === '/map' ? '' : ''}`} aria-hidden="true">
              {item.emoji}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [isMobileMenuOpen])

  return (
    <div className="relative min-h-svh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-4 focus:left-4 z-50 focus:fixed bg-white px-4 py-2 rounded-xl font-bold text-ink"
      >
        Перейти к содержимому
      </a>

      <div className="-z-10 fixed inset-0 sky-bg" aria-hidden="true" />
      <Clouds />
      <ScrollToTop />
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {isMobileMenuOpen && (
        <div
          className="md:hidden min-[920px]:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню навигации"
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className={`fixed top-0 right-0 z-10 w-full max-w-xs sm:max-w-md h-screen bg-white shadow-2xl flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="p-5 border-b border-white/80 flex items-center justify-between">
              <h2 className="font-black text-lg">Навигация</h2>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grape"
                aria-label="Закрыть меню"
              >
                ✕
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-black transition-colors block',
                      isActive
                        ? 'bg-grape text-white'
                        : 'text-ink hover:bg-grape/5 hover:text-grape',
                    ].join(' ')
                  }
                >
                  <span aria-hidden="true" className="text-xl">
                    {item.emoji}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main id="main-content" className="z-10 relative mx-auto px-4 pt-6 md:pt-10 pb-28 md:pb-16 w-full max-w-6xl">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>

        <footer className="mt-14 md:mt-20 pt-6 border-ink/10 border-t font-bold text-[11px] text-ink-soft text-center leading-relaxed">
          <p>Флажок · игра-путешествие для маленьких исследователей 🌈</p>
          <p className="mt-1">
            Флаги: <span className="text-ink">flagcdn.com</span> · факты собраны с любовью к географии
          </p>
        </footer>
      </main>

      <BottomNav />
      <ToastHost />
    </div>
  )
}
