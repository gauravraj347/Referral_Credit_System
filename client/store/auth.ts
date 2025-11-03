import { create } from 'zustand'

type User = { id: string; email: string; referralCode: string; credits: number }

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => {
    set({ token, user })
    if (typeof window !== 'undefined') {
      localStorage.setItem('fs_token', token)
      localStorage.setItem('fs_user', JSON.stringify(user))
    }
  },
  logout: () => {
    set({ token: null, user: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fs_token')
      localStorage.removeItem('fs_user')
    }
  },
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('fs_token')
    const u = localStorage.getItem('fs_user')
    if (t && u) {
      try {
        set({ token: t, user: JSON.parse(u) })
      } catch {
        // ignore
      }
    }
  },
}))


