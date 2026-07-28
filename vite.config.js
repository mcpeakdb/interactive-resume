import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * On GitHub Pages a project site is served from /<repo>/, so assets need a
 * matching base. Derived from GITHUB_REPOSITORY at build time — user/org sites
 * (<name>.github.io) and local dev stay at the root.
 */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repo && !repo.endsWith('.github.io') ? `/${repo}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [vue(), tailwindcss()],
})
