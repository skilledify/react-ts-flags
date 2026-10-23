import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// На GitHub Pages приложение живёт в подпапке /<repo>/
// На Netlify и локально — в корне.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
