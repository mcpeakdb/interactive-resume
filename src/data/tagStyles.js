/**
 * Tailwind scans source files for literal class strings, so every tag variant is
 * spelled out here rather than composed at runtime from the color name.
 */
const STYLES = {
  amber: {
    chip: 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300',
    active: 'bg-amber-500 text-white ring-amber-500 dark:text-amber-950',
    dot: 'bg-amber-500',
  },
  cyan: {
    chip: 'bg-cyan-500/10 text-cyan-700 ring-cyan-500/25 dark:text-cyan-300',
    active: 'bg-cyan-500 text-white ring-cyan-500 dark:text-cyan-950',
    dot: 'bg-cyan-500',
  },
  violet: {
    chip: 'bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300',
    active: 'bg-violet-500 text-white ring-violet-500 dark:text-violet-950',
    dot: 'bg-violet-500',
  },
  rose: {
    chip: 'bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300',
    active: 'bg-rose-500 text-white ring-rose-500 dark:text-rose-950',
    dot: 'bg-rose-500',
  },
  emerald: {
    chip: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300',
    active: 'bg-emerald-500 text-white ring-emerald-500 dark:text-emerald-950',
    dot: 'bg-emerald-500',
  },
  blue: {
    chip: 'bg-blue-500/10 text-blue-700 ring-blue-500/25 dark:text-blue-300',
    active: 'bg-blue-500 text-white ring-blue-500 dark:text-blue-950',
    dot: 'bg-blue-500',
  },
  slate: {
    chip: 'bg-slate-500/10 text-slate-700 ring-slate-500/25 dark:text-slate-300',
    active: 'bg-slate-500 text-white ring-slate-500 dark:text-slate-950',
    dot: 'bg-slate-500',
  },
}

const FALLBACK = STYLES.slate

export function tagStyle(color) {
  return STYLES[color] ?? FALLBACK
}
