import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function fmt(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

const useHabitsStore = create(
  persist(
    (set, get) => ({
      _version: 1,
      goals: [],
      logs: {},
      logNotes: {},

      addGoal: (goal) => set((s) => ({
        goals: [...s.goals, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), isActive: true, ...goal }],
      })),

      updateGoal: (id, updates) => set((s) => ({
        goals: s.goals.map((g) => g.id === id ? { ...g, ...updates } : g),
      })),

      deleteGoal: (id) => set((s) => {
        const logs = { ...s.logs }
        const logNotes = { ...s.logNotes }
        Object.keys(logs).forEach((k) => { if (k.startsWith(id + '_')) delete logs[k] })
        Object.keys(logNotes).forEach((k) => { if (k.startsWith(id + '_')) delete logNotes[k] })
        return { goals: s.goals.filter((g) => g.id !== id), logs, logNotes }
      }),

      setLog: (goalId, date, status) => {
        const key = `${goalId}_${date}`
        if (status === null) {
          const logs = { ...get().logs }
          delete logs[key]
          set({ logs })
        } else {
          set((s) => ({ logs: { ...s.logs, [key]: status } }))
        }
      },

      setLogNote: (goalId, date, note) => set((s) => {
        const key = `${goalId}_${date}`
        const logNotes = { ...s.logNotes }
        if (note) logNotes[key] = note
        else delete logNotes[key]
        return { logNotes }
      }),

      toggleLog: (goalId, date) => {
        const key = `${goalId}_${date}`
        const cur = get().logs[key]
        if (cur === undefined) {
          set((s) => ({ logs: { ...s.logs, [key]: true } }))
        } else if (cur === true) {
          set((s) => ({ logs: { ...s.logs, [key]: false } }))
        } else {
          const logs = { ...get().logs }
          delete logs[key]
          set({ logs })
        }
      },

      getStreak: (goalId) => {
        const { logs } = get()
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const key = `${goalId}_${fmt(d)}`
          if (logs[key] === true) streak++
          else if (logs[key] === false) break
          else if (i > 0) break
        }
        return streak
      },
    }),
    { name: 'pocket-habits-storage', version: 1 }
  )
)

export default useHabitsStore
