const FLAG_CDN = import.meta.env.VITE_FLAG_CDN ?? 'https://flagcdn.com'

export function flagUrl(code: string, width: 160 | 320 | 640 | 1280 = 320): string {
  return `${FLAG_CDN}/w${width}/${code}.png`
}

export function flagSrcSet(code: string): string {
  return `${flagUrl(code, 320)} 1x, ${flagUrl(code, 640)} 2x`
}
