const THEME_STORAGE_KEY = 'tezoro-theme'
const SUPPORTED_THEMES = ['dark', 'light', 'high-contrast']

export function getStoredTheme(defaultTheme = 'light') {
  if (typeof window === 'undefined') {
    return defaultTheme
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return SUPPORTED_THEMES.includes(storedTheme) ? storedTheme : defaultTheme
}

export function storeTheme(theme) {
  if (typeof window === 'undefined' || !SUPPORTED_THEMES.includes(theme)) {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export { SUPPORTED_THEMES, THEME_STORAGE_KEY }
