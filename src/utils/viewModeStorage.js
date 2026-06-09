const VIEW_MODE_STORAGE_KEY = 'tezoro-view-mode'
const SUPPORTED_VIEW_MODES = ['overview', 'pro']

export function getStoredViewMode(defaultValue = 'overview') {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  const storedViewMode = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)
  return SUPPORTED_VIEW_MODES.includes(storedViewMode) ? storedViewMode : defaultValue
}

export function setStoredViewMode(value) {
  if (typeof window === 'undefined' || !SUPPORTED_VIEW_MODES.includes(value)) {
    return
  }

  window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, value)
}

export { SUPPORTED_VIEW_MODES, VIEW_MODE_STORAGE_KEY }
