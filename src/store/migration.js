export function runMigrations() {
  const OLD_KEY    = 'goal-tracker-storage'
  const HABITS_KEY = 'pocket-habits-storage'
  const APP_KEY    = 'pocket-app-storage'

  if (localStorage.getItem(HABITS_KEY)) return // already migrated

  const raw = localStorage.getItem(OLD_KEY)
  if (!raw) return // fresh install

  try {
    const { state = {} } = JSON.parse(raw)

    localStorage.setItem(HABITS_KEY, JSON.stringify({
      state: { _version: 1, goals: state.goals || [], logs: state.logs || {} },
      version: 1,
    }))

    if (!localStorage.getItem(APP_KEY)) {
      localStorage.setItem(APP_KEY, JSON.stringify({
        state: {
          _version: 1,
          theme: state.theme || 'dark',
          colorMode: 'utility',
          appColor: '#6366f1',
        },
        version: 1,
      }))
    }

    localStorage.removeItem(OLD_KEY)
  } catch (_) {
    // silent — never crash the app over a migration
  }
}

