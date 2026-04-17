import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { formatDate } from '../utils/dateHelpers'

const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],
      logs: {}, // { "goalId_YYYY-MM-DD": boolean }
      theme: 'dark', // 'light' | 'dark'

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // --- Goals ---
      addGoal: (goal) => {
        const newGoal = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          isActive: true,
          ...goal,
        }
        set((state) => ({ goals: [...state.goals, newGoal] }))
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }))
      },

      deleteGoal: (id) => {
        set((state) => {
          const newLogs = { ...state.logs }
          Object.keys(newLogs).forEach((key) => {
            if (key.startsWith(id + '_')) delete newLogs[key]
          })
          return {
            goals: state.goals.filter((g) => g.id !== id),
            logs: newLogs,
          }
        })
      },

      // --- Logs ---
      logGoal: (goalId, date, completed) => {
        const key = `${goalId}_${date}`
        set((state) => ({
          logs: { ...state.logs, [key]: completed },
        }))
      },

      toggleLog: (goalId, date) => {
        const key = `${goalId}_${date}`
        const current = get().logs[key]
        // null/undefined → true → false → null (remove)
        let next
        if (current === undefined || current === null) next = true
        else if (current === true) next = false
        else {
          const newLogs = { ...get().logs }
          delete newLogs[key]
          set({ logs: newLogs })
          return
        }
        set((state) => ({ logs: { ...state.logs, [key]: next } }))
      },

      getLog: (goalId, date) => {
        const key = `${goalId}_${date}`
        return get().logs[key] // true | false | undefined
      },

      // --- Derived ---
      getStreak: (goalId) => {
        const logs = get().logs
        let streak = 0
        const today = new Date()
        for (let i = 0; i < 365; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          const key = `${goalId}_${formatDate(d)}`
          if (logs[key] === true) streak++
          else if (logs[key] === false) break
          else if (i > 0) break // unlogged past day breaks streak
        }
        return streak
      },
    }),
    {
      name: 'goal-tracker-storage',
    }
  )
)

export default useGoalStore
