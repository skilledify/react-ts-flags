import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'sunny' | 'mint' | 'white' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-grape text-white shadow-[0_6px_0_#5a3ee6] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#5a3ee6] active:translate-y-1 active:shadow-[0_2px_0_#5a3ee6]',
  sunny:
    'bg-sunny text-ink shadow-[0_6px_0_#e0a900] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#e0a900] active:translate-y-1 active:shadow-[0_2px_0_#e0a900]',
  mint:
    'bg-mint text-white shadow-[0_6px_0_#2aa596] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#2aa596] active:translate-y-1 active:shadow-[0_2px_0_#2aa596]',
  white:
    'bg-white text-ink shadow-[0_5px_0_rgba(47,35,80,0.14)] hover:-translate-y-0.5 hover:shadow-[0_7px_0_rgba(47,35,80,0.14)] active:translate-y-1 active:shadow-[0_2px_0_rgba(47,35,80,0.14)]',
  ghost: 'bg-white/60 text-ink hover:bg-white active:scale-95',
  danger:
    'bg-coral text-white shadow-[0_6px_0_#d9574f] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#d9574f] active:translate-y-1 active:shadow-[0_2px_0_#d9574f]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-7 py-4 text-lg rounded-3xl',
  icon: 'h-11 w-11 rounded-2xl text-xl',
}

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
): string {
  return [
    'relative inline-flex select-none items-center justify-center gap-2 font-extrabold tracking-tight transition-all duration-150 disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
  ].join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonStyles(variant, size, fullWidth)} ${className}`}
      {...props}
    />
  )
}
