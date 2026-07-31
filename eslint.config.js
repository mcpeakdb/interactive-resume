import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,

  // Parses <template> as well as <script>, so identifiers used only in the
  // template still count as used — the reason this project uses eslint-plugin-vue
  // rather than a script-only linter.
  ...pluginVue.configs['flat/recommended'],

  // Must stay last: turns off every rule Prettier already owns.
  skipFormatting,

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      // Single-word component names are fine here — every component is a
      // one-off section, not a shared library primitive.
      'vue/multi-word-component-names': 'off',
    },
  },

  // Build-time config files run in Node, not the browser.
  {
    files: ['vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
]
