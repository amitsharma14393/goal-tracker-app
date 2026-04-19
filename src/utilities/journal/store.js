import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useJournalStore = create(
  persist(
    (set) => ({
      _version: 1,
      entries: {}, // { 'YYYY-MM-DD': { promptIndex, response, savedAt } }

      saveEntry: (date, promptIndex, response) => set((s) => ({
        entries: { ...s.entries, [date]: { promptIndex, response, savedAt: new Date().toISOString() } },
      })),

      deleteEntry: (date) => set((s) => {
        const next = { ...s.entries }
        delete next[date]
        return { entries: next }
      }),
    }),
    { name: 'pocket-journal-storage', version: 1 }
  )
)

export default useJournalStore
