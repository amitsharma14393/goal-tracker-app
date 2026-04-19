import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useMoodStore = create(
  persist(
    (set, get) => ({
      _version: 1,
      entries: {}, // { 'YYYY-MM-DD': { rating: 1-5, note } }

      logMood: (date, rating, note = '') => set((s) => ({
        entries: { ...s.entries, [date]: { rating, note } },
      })),

      deleteEntry: (date) => set((s) => {
        const next = { ...s.entries }
        delete next[date]
        return { entries: next }
      }),
    }),
    { name: 'pocket-mood-storage', version: 1 }
  )
)

export default useMoodStore
