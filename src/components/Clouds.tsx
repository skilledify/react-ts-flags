interface CloudProps {
  className?: string
}

function Cloud({ className = '' }: CloudProps) {
  return (
    <svg viewBox="0 0 220 100" className={`absolute ${className}`} aria-hidden="true">
      <path
        d="M28 84c-16 0-26-10-26-23 0-13 10-23 24-24 2-17 16-29 34-29 16 0 29 10 33 25 4-3 9-4 14-4 14 0 25 11 25 25 0 2 0 4-1 6 10 2 17 10 17 20 0 12-10 20-24 20H28Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Clouds() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sunny/25 blur-3xl" />
      <div className="absolute right-6 top-7 hidden h-24 w-24 rounded-full bg-sunny shadow-[0_0_80px_rgba(255,201,60,0.85)] sm:block" />
      <div className="absolute right-16 top-16 hidden h-10 w-10 rounded-full bg-white/40 sm:block" />

      <Cloud className="left-[-4%] top-24 w-52 text-white/75 animate-float-slow" />
      <Cloud className="right-[8%] top-44 hidden w-64 text-white/60 animate-float md:block" />
      <Cloud className="left-[16%] top-[52%] w-40 text-white/50 animate-float-fast" />
      <Cloud className="right-[-6%] top-[70%] hidden w-72 text-white/50 animate-float-slow lg:block" />

      <div className="absolute left-[6%] top-[32%] h-3 w-3 rounded-full bg-coral/40 animate-float" />
      <div className="absolute right-[26%] top-[26%] h-2.5 w-2.5 rounded-full bg-grape/30 animate-float-slow" />
      <div className="absolute left-[46%] top-[14%] h-2 w-2 rounded-full bg-mint/50 animate-float-fast" />
      <div className="absolute right-[12%] top-[56%] h-4 w-4 rotate-12 rounded-md bg-sunny/40 animate-float" />
    </div>
  )
}
