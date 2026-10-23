export type SoundName = 'click' | 'correct' | 'wrong' | 'collect' | 'win' | 'flip'

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.12,
) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start)
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(ctx.currentTime + start)
  oscillator.stop(ctx.currentTime + start + duration + 0.05)
}

const MELODIES: Record<SoundName, Array<[number, number, number, OscillatorType?]>> = {
  click: [[660, 0, 0.08, 'triangle']],
  flip: [[380, 0, 0.07, 'triangle'], [520, 0.05, 0.07, 'triangle']],
  correct: [
    [523.25, 0, 0.12, 'triangle'],
    [659.25, 0.09, 0.12, 'triangle'],
    [783.99, 0.18, 0.2, 'triangle'],
  ],
  collect: [
    [659.25, 0, 0.1, 'sine'],
    [880, 0.08, 0.1, 'sine'],
    [1046.5, 0.16, 0.22, 'sine'],
  ],
  wrong: [
    [220, 0, 0.16, 'sawtooth'],
    [174.61, 0.14, 0.22, 'sawtooth'],
  ],
  win: [
    [523.25, 0, 0.14, 'triangle'],
    [659.25, 0.12, 0.14, 'triangle'],
    [783.99, 0.24, 0.14, 'triangle'],
    [1046.5, 0.36, 0.32, 'triangle'],
    [783.99, 0.52, 0.12, 'sine'],
    [1046.5, 0.62, 0.4, 'sine'],
  ],
}

export function playSound(name: SoundName, enabled: boolean): void {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return
  for (const [frequency, start, duration, type] of MELODIES[name]) {
    tone(ctx, frequency, start, duration, type)
  }
}

export function speak(text: string, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.92
  utterance.pitch = 1.12
  const russian = window.speechSynthesis.getVoices().find((voice) => voice.lang.startsWith('ru'))
  if (russian) utterance.voice = russian
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
