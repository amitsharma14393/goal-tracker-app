import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useRemindersStore = create(
  persist(
    (set) => ({
      _version: 1,
      reminders: [],

      addReminder: (reminder) => set((s) => ({
        reminders: [...s.reminders, {
          id: crypto.randomUUID(),
          title: '',
          datetime: null,
          recurring: null, // null | 'daily' | 'weekly' | 'monthly'
          done: false,
          createdAt: new Date().toISOString(),
          ...reminder,
        }],
      })),

      updateReminder: (id, updates) => set((s) => ({
        reminders: s.reminders.map((r) => r.id === id ? { ...r, ...updates } : r),
      })),

      toggleDone: (id) => set((s) => ({
        reminders: s.reminders.map((r) => r.id === id ? { ...r, done: !r.done } : r),
      })),

      deleteReminder: (id) => set((s) => ({
        reminders: s.reminders.filter((r) => r.id !== id),
      })),
    }),
    { name: 'pocket-reminders-storage', version: 1 }
  )
)

export default useRemindersStore
