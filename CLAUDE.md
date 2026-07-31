# CLAUDE.md

Interactive single-page resume for Danny McPeak Jr. Vue 3 + Vite + Tailwind CSS 4,
deployed to GitHub Pages at https://mcpeakdb.github.io/interactive-resume/

## Commands

```bash
npm install
npm run dev           # http://localhost:5173
npm run build         # → dist/
npm run preview       # serve the production build

npm run lint          # eslint .
npm run lint:fix      # eslint . --fix
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

Both `lint` and `format:check` are clean — keep them that way. There is no test
framework, so verification is lint + build + checking the page in a browser.

Requires Node 20.19+ or 22.12+. CI pins Node 22.

## Stack

Vue 3.5 with `<script setup>` throughout — no Router, no Pinia, no TypeScript. Vite 8.
Tailwind CSS 4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js`; the theme
lives in `@theme` at the top of `src/style.css`). Vue is the only runtime dependency.

## Layout

```
src/
  data/
    resume.js       all content + the tag taxonomy   ← single source of truth
    tagStyles.js    literal Tailwind classes per tag color
  composables/
    useFilters.js   shared filter state (module-level singleton)
    useTheme.js     dark/light toggle + localStorage
    useScrollSpy.js active section for the sticky nav
    useCountUp.js   eased 0 → target animation
    reveal.js       v-reveal scroll-into-view directive
  components/       one per section, plus AppIcon / TagChip / SectionHeading
  style.css         theme tokens, reveal + print rules
  main.js           createApp + registers v-reveal globally
```

Section order is set in `App.vue`; the nav links come from `sections` in `resume.js`.

## Architecture — the non-obvious parts

**1. Filter state is a module-level singleton.** `useFilters.js` declares `activeTags` as
a `ref` _outside_ the exported function, so every caller shares one Set. That is what
makes clicking a skill in `SkillsSection` filter the timeline in `ExperienceSection`.
Don't "fix" this into per-caller state.

- Matching is OR: an item shows if it carries **at least one** active tag.
- `tagCounts` is derived by walking every highlight + project across all jobs.
- `ExperienceSection` watches `hasFilters` and auto-expands the cards that still match.

**2. Tag colors must be literal strings.** Tailwind scans source text, so
`bg-${color}-500` composed at runtime produces no CSS. Every variant is spelled out in
`src/data/tagStyles.js`. Adding a discipline means editing **both** `TAGS` in `resume.js`
and `STYLES` in `tagStyles.js`.

**3. Tenure is computed, never stored.** `JobCard.vue` derives the date span and the
"6 yrs 1 mo" duration from `start` / `end`. `stats[0]` computes years-in-tech from
`CAREER_START = 2013`. To change a tenure, edit the date string — nothing else.

## Data shapes (`src/data/resume.js`)

```js
TAGS = { key: { label, color } }        // color must exist in tagStyles.js STYLES
profile = { name, title, linkedin, linkedinUrl, summary }
stats = [{ value: Number, suffix, label }]
skills = [{ group, items: [{ name, tag }] }]
education = [{ school, location, credential, period }]
certifications = [{ name, code?, date, featured? }]   // featured → amber ring + "New"
sections = [{ id, label }]                            // id must match a section's DOM id

experience = [{
  id,                  // used for the aria-controls target and the open/closed Set
  company, location,
  site, url,           // both null → no link rendered on the card
  start: 'YYYY-MM',
  end:   'YYYY-MM' | null,   // null = present
  current: Boolean,          // drives the "Current" pill + green timeline node
  roles:      [{ title, period }],        // period is display text, written by hand
  highlights: [{ text, tags: [] }],
  projects:   [{ name, detail, tags: [] }],
}]
```

Jobs render in array order — newest first.

## Making common changes

- **Reword anything on the page** → `src/data/resume.js`. Nothing else needs editing.
- **Add a bullet or project** → add the object with its `tags`; the filter chips, counts
  and "Showing N of M" all update on their own.
- **Add a discipline** → `TAGS` in `resume.js` + a matching color block in `tagStyles.js`.
- **Add an icon** → a new stroked 24×24 path entry in the `PATHS` map in `AppIcon.vue`.
  Icons are inlined there, not loaded from an SVG file.
- **Add a section** → a component in `src/components/`, render it in `App.vue`, give the
  `<section>` an `id` and `class="scroll-mt-24"`, and add `{ id, label }` to `sections`.

## Conventions

Formatting is enforced by Prettier (`.prettierrc.json`) — **no semicolons**, single
quotes, trailing commas, 2-space indent, 90 columns. Don't hand-format; run
`npm run format`.

If VS Code's built-in Vue/Volar formatter is set as the default formatter it will fight
this, rewriting files to double quotes with semicolons on save. Point the editor at the
Prettier extension so format-on-save agrees with `npm run format`.

Linting is ESLint flat config (`eslint.config.js`): `js.configs.recommended` plus
`eslint-plugin-vue`'s `flat/recommended`, with `@vue/eslint-config-prettier` last to
disable every rule Prettier owns. `eslint-plugin-vue` parses `<template>` as well as
`<script>`, so identifiers used only in a template — `TagChip` in `FilterBar.vue`, for
instance — correctly count as used. A script-only linter reports those as dead code and
will happily "fix" them by deleting imports the template needs.

Components are PascalCase, one per section, `<script setup>` only. Composables are
`useX.js` returning an object of refs/functions. Comments explain _why_, not what — the
existing ones are a good model for density.

Styling is Tailwind utilities inline. Only three shared classes exist, in `style.css`:
`.card`, `.section-shell`, `.reveal`. Colors come from the custom `ink-*` ramp (a
green-tinted neutral) plus emerald/teal accents. Dark mode is class-based (`.dark` on
`<html>`), resolved by an inline script in `index.html` before first paint.

## Constraints — do not break these

**Privacy: LinkedIn is the only contact channel.** Never add an email address, phone
number, or home location anywhere on the site. This is deliberate (see the comment above
`profile` in `resume.js`); `ContactSection` closes with "Contact details and references
available on request."

**Accessibility is load-bearing.** Semantic landmarks, a skip link, `aria-expanded` on
the job cards, `aria-pressed` on every filter/skill chip, `aria-live` on the result
count, and visible focus rings. Keep them wired when editing interactive markup.

**Print output is a real feature.** The printer button (or Ctrl/Cmd-P) collapses the UI
into a PDF-ready document. New chrome that shouldn't print needs `no-print`; collapsible
content needs `print-expand` so it opens on paper regardless of UI state.

**Reduced motion is honored everywhere.** `reveal.js` and `useCountUp.js` both check
`prefers-reduced-motion` at module load and skip animating. Any new animation needs the
same branch, or a CSS rule under the existing media query in `style.css`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to
`main`, and can be run manually from the Actions tab.

`vite.config.js` derives `base` from `GITHUB_REPOSITORY` at build time, so the project
site resolves under `/interactive-resume/` in CI while local dev stays at `/`. There is
no hardcoded repo name — don't add one.

## Known quirks

- The `PATHS` map in `AppIcon.vue` carries a `// prettier-ignore` so it stays one icon per
  line. Prettier would otherwise explode it to 3× the length, since the SVG path strings
  can't be broken. Keep new icons on a single line each.
- `metric: '20,000+ agents'` on the Capital One highlight in `resume.js` is defined but
  never rendered by any component.
- `TagChip.vue` declares a `label` prop that no caller passes.
