import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useNotesStore = create(
  persist(
    (set) => ({
      _version: 1,
      notes: [],

      addNote: (note) => {
        const id = crypto.randomUUID()
        set((s) => ({
          notes: [...s.notes, {
            id,
            title: 'Untitled',
            body: '',
            pinned: false,
            label: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...note,
          }],
        }))
        return id
      },

      updateNote: (id, updates) => set((s) => ({
        notes: s.notes.map((n) => n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n),
      })),

      togglePin: (id) => set((s) => ({
        notes: s.notes.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n),
      })),

      deleteNote: (id) => set((s) => ({
        notes: s.notes.filter((n) => n.id !== id),
      })),
    }),
    { name: 'pocket-notes-storage', version: 1 }
  )
)

export default useNotesStore
