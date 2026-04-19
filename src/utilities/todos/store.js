import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTodosStore = create(
  persist(
    (set) => ({
      _version: 1,
      todos: [],

      addTodo: (todo) => set((s) => ({
        todos: [...s.todos, {
          id: crypto.randomUUID(),
          title: '',
          priority: 'medium',
          dueDate: null,
          completed: false,
          completedAt: null,
          archived: false,
          createdAt: new Date().toISOString(),
          ...todo,
        }],
      })),

      updateTodo: (id, updates) => set((s) => ({
        todos: s.todos.map((t) => t.id === id ? { ...t, ...updates } : t),
      })),

      toggleComplete: (id) => set((s) => ({
        todos: s.todos.map((t) => t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
          : t),
      })),

      archiveTodo: (id) => set((s) => ({
        todos: s.todos.map((t) => t.id === id ? { ...t, archived: true } : t),
      })),

      unarchiveTodo: (id) => set((s) => ({
        todos: s.todos.map((t) => t.id === id ? { ...t, archived: false } : t),
      })),

      deleteTodo: (id) => set((s) => ({
        todos: s.todos.filter((t) => t.id !== id),
      })),
    }),
    { name: 'pocket-todos-storage', version: 1 }
  )
)

export default useTodosStore
