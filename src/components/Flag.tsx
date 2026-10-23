import { useState } from 'react'
import { flagSrcSet, flagUrl } from '../lib/flags'

interface FlagProps {
  code: string
  name: string
  className?: string
  loading?: 'lazy' | 'eager'
}

export function Flag({ code, name, className = '', loading = 'lazy' }: FlagProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-grape to-sky text-lg font-black uppercase text-white ${className}`}
        aria-label={name}
      >
        {code}
      </div>
    )
  }

  return (
    <img
      src={flagUrl(code, 320)}
      srcSet={flagSrcSet(code)}
      alt={`Флаг: ${name}`}
      className={`h-full w-full object-cover ${className}`}
      loading={loading}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
