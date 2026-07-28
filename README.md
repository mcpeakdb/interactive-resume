# Interactive Resume — Danny McPeak Jr.

An interactive, single-page version of my resume. Built with Vue 3, Vite and Tailwind CSS.

**Live:** https://mcpeakdb.github.io/interactive-resume/

## Features

- **Discipline filters** — chips for Cloud & AWS, Frontend, Backend, Mobile, DevOps, Leadership and Infrastructure filter every accomplishment across the timeline at once. Non-matching roles dim out and matching cards auto-expand.
- **Clickable skills** — selecting a skill in the Skills section drives the same filter, jumping the timeline to the work where it was used.
- **Expandable role cards** — each job collapses to a summary and expands to bullets and major projects, with tenure computed from the start/end dates.
- **Animated stat counters** — headline numbers count up the first time they scroll into view.
- **Dark / light mode** — follows the system preference, overridable, and persisted to `localStorage`. Resolved before first paint so there's no flash.
- **Print stylesheet** — the printer button (or Ctrl/Cmd-P) collapses the UI chrome and expands every card into a clean PDF-ready document.
- **Accessible by default** — semantic landmarks, skip link, `aria-expanded` / `aria-pressed` state, visible focus rings, and full `prefers-reduced-motion` support.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build locally
```

Requires Node 20.19+ or 22.12+.

## Editing the content

`src/data/resume.js` is the single source of truth — profile, stats, skills, experience, education and certifications all live there. Nothing else needs editing to change what the page says.

Every highlight and project carries a `tags` array drawn from the `TAGS` map at the top of that file. Those tags are what the filter chips, the skill chips and the per-tag counts are all derived from, so adding a tag to an item is the only step needed to wire it into the filtering.

To add a new discipline, add an entry to `TAGS` and a matching color block in `src/data/tagStyles.js` — Tailwind scans for literal class strings, so the variants are spelled out there rather than composed at runtime.

## Project structure

```
src/
  data/
    resume.js       all resume content + the tag taxonomy
    tagStyles.js    literal Tailwind classes per tag color
  composables/
    useFilters.js   shared filter state across Skills and Experience
    useTheme.js     dark/light toggle + persistence
    useScrollSpy.js active section for the sticky nav
    useCountUp.js   eased 0 → target animation
    reveal.js       v-reveal scroll-into-view directive
  components/       one component per section, plus AppIcon / TagChip
  style.css         Tailwind theme tokens, reveal + print rules
```

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`, and can also be run manually from the Actions tab.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The base path is derived from `GITHUB_REPOSITORY` at build time in `vite.config.js`, so the project site resolves under `/interactive-resume/` in CI while local dev and any future user site stay at the root — no hardcoded repo name to keep in sync.

## Privacy

Email, phone number and home location are deliberately not in this repo. LinkedIn is the only contact channel the site exposes.
