import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { TOTAL_COUNTRIES } from '../data/countries'
import { useProgress } from '../lib/progress'
import { Clouds } from './Clouds'
import { ToastHost } from './ToastHost'

const NAV_ITEMS = [
  { to: '/map', label: 'Карта', emoji: '🗺️' },
  { to: '/quiz', label: 'Викторина', emoji: '🎯' },
  { to: '/memory', label: 'Мемори', emoji: '🃏' },
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
    <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Флаголэнд — на главную">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-grape via-sky to-mint text-2xl shadow-[0_4px_0_#5a3ee6] transition-transform duration-300 group-hover:rotate-12 md:h-12 md:w-12">
        🌍
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-fairy text-xl leading-none tracking-wide md:text-[1.6rem]">Флаголэнд</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-soft md:text-[11px]">
          мир на ладошке
        </span>
      </span>
    </Link>
  )
}

function Header() {
  const { collectedCount, soundOn, voiceOn, toggleSound, toggleVoice } = useProgress()

  return (
    <header className="sticky top-0 z-40 border-b-2 border-white/80 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:h-20">
        <Logo />

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-extrabold transition-all duration-200',
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

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <Link
            to="/collection"
            className="flex items-center gap-1.5 rounded-xl border-2 border-white bg-white/90 px-2.5 py-1.5 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-sunny"
            title="Открыть альбом флагов"
          >
            <span aria-hidden="true">🚩</span>
            <span className="tabular-nums">
              {collectedCount}
              <span className="text-ink-soft">/{TOTAL_COUNTRIES}</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-lg shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            aria-label={soundOn ? 'Выключить звуки' : 'Включить звуки'}
            aria-pressed={soundOn}
            title={soundOn ? 'Звуки включены' : 'Звуки выключены'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          <button
            type="button"
            onClick={toggleVoice}
            className="hidden h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-lg shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:flex"
            aria-label={voiceOn ? 'Выключить озвучку' : 'Включить озвучку'}
            aria-pressed={voiceOn}
            title={voiceOn ? 'Озвучка включена' : 'Озвучка выключена'}
          >
            {voiceOn ? '🗣️' : '🤐'}
          </button>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t-2 border-white/80 bg-white/90 backdrop-blur-xl md:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 py-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-black transition-colors',
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

  return (
    <div className="relative min-h-svh">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-xl bg-white px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержимому
      </a>

      <div className="sky-bg fixed inset-0 -z-10" aria-hidden="true" />
      <Clouds />
      <ScrollToTop />
      <Header />

      <main id="main-content" className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:pb-16 md:pt-10">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>

        <footer className="mt-14 border-t border-ink/10 pt-6 text-center text-[11px] font-bold leading-relaxed text-ink-soft md:mt-20">
          <p>Флаголэнд · игра-путешествие для маленьких исследователей 🌈</p>
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
