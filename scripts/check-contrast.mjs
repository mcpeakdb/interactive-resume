/**
 * WCAG 2.1 AA text-contrast audit.
 *
 * Reads the colour values Tailwind actually compiled into dist/ (the default
 * palette ships as oklch, so the values are converted rather than guessed),
 * then scans every class string in src/ for text colours and checks each one
 * against the surfaces it can land on.
 *
 * Run `npm run build` first, then `npm run a11y`.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { globSync } from 'node:fs'

const CSS_DIR = 'dist/assets'

// Utilities where a `text-*` class sets a pattern or gradient colour rather
// than actual glyph colour, so contrast rules don't apply.
const DECORATIVE_MARKERS = ['checkers', 'speed-lines', 'text-transparent']

// Colours used only for decorative icons that sit beside their own text label.
const DECORATIVE_COLOURS = new Set(['emerald-500', 'white'])

// ── colour plumbing ───────────────────────────────────────────────────────
const cssFile = readdirSync(CSS_DIR).find((f) => f.endsWith('.css'))
if (!cssFile) {
  console.error('No compiled CSS found — run `npm run build` first.')
  process.exit(1)
}
const css = readFileSync(`${CSS_DIR}/${cssFile}`, 'utf8')

const vars = {}
for (const m of css.matchAll(/--color-([a-z]+-\d+):\s*([^;]+);/g)) {
  vars[m[1]] = m[2].trim()
}

const gamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055)

function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.max(0, Math.min(1, gamma(v))) * 255)
}

function parse(token) {
  const v = vars[token]
  if (!v) return null
  if (v.startsWith('#')) {
    const hex = v.slice(1)
    const parts = hex.length === 3 ? hex.split('').map((c) => c + c) : hex.match(/../g)
    return parts.map((x) => parseInt(x, 16))
  }
  const ok = v.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/)
  return ok ? oklchToRgb(+ok[1] / 100, +ok[2], +ok[3]) : null
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// ── scan source for text colours ──────────────────────────────────────────
const files = globSync('src/**/*.vue')
const found = new Map() // `${mode}:${token}` -> Set(files)

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const m of source.matchAll(/class="([^"]+)"|:class="([^"]+)"/g)) {
    const classes = m[1] ?? m[2]
    if (DECORATIVE_MARKERS.some((d) => classes.includes(d))) continue
    for (const c of classes.matchAll(/(dark:)?text-([a-z]+-\d+)/g)) {
      const token = c[2]
      if (DECORATIVE_COLOURS.has(token)) continue
      const key = `${c[1] ? 'dark' : 'light'}:${token}`
      if (!found.has(key)) found.set(key, new Set())
      found.get(key).add(file.replace('src/', ''))
    }
  }
}

// Surfaces a given mode's text can sit on; the worst case is what must pass.
const SURFACES = {
  light: [
    ['page', parse('ink-50')],
    ['card', [255, 255, 255]],
  ],
  dark: [
    ['page', parse('ink-950')],
    ['card', parse('ink-900')],
  ],
}

const results = []
for (const [key, where] of found) {
  const [mode, token] = key.split(':')
  const fg = parse(token)
  if (!fg) continue
  let worst = { ratio: Infinity, surface: null }
  for (const [name, bg] of SURFACES[mode]) {
    const r = contrast(fg, bg)
    if (r < worst.ratio) worst = { ratio: r, surface: name }
  }
  results.push({ mode, token, ...worst, where: [...where] })
}

results.sort((a, b) => a.ratio - b.ratio)

const MIN = 4.5
let failures = 0
for (const r of results) {
  const pass = r.ratio >= MIN
  if (!pass) failures++
  console.log(
    `${pass ? 'PASS' : 'FAIL'}  ${r.ratio.toFixed(2).padStart(5)}:1  ` +
      `${r.mode.padEnd(5)} ${r.token.padEnd(14)} on ${r.surface.padEnd(4)}  ${r.where.join(', ')}`,
  )
}

console.log(
  `\n${results.length} colour/surface pairs checked against ${MIN}:1 — ${failures} failure(s)`,
)
process.exit(failures ? 1 : 0)
