import { Link } from 'react-router'
import { buttonStyles } from '../components/Button'
import { Mascot, SpeechBubble } from '../components/Mascot'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-8 text-center">
      <div className="relative w-64 sm:w-72">
        <Mascot />
        <SpeechBubble className="absolute -bottom-2 left-1/2 w-max -translate-x-1/2">
          Ой! Кажется, я перепутал страны…
        </SpeechBubble>
      </div>

      <p className="mt-12 text-xs font-black uppercase tracking-widest text-ink-soft">Ошибка 404</p>
      <h1 className="mt-1 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
        Такой страницы нет на карте
      </h1>
      <p className="mt-3 max-w-md text-sm font-bold leading-relaxed text-ink-soft">
        Возможно, этот флаг ещё не открыт или адрес написан с ошибкой. Давай вернёмся
        в путешествие!
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/" className={buttonStyles('primary', 'lg')}>
          🏠 На главную
        </Link>
        <Link to="/map" className={buttonStyles('white', 'lg')}>
          🗺️ К карте мира
        </Link>
      </div>
    </div>
  )
}
