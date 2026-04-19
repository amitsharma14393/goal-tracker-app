import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set) => ({
      _version: 1,
      theme: 'dark',
      colorMode: 'utility', // 'utility' | 'app'
      appColor: '#6366f1',

      toggleTheme:  () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setColorMode: (mode)  => set({ colorMode: mode }),
      setAppColor:  (color) => set({ appColor: color }),
    }),
    { name: 'pocket-app-storage', version: 1 }
  )
)

export default useAppStore
