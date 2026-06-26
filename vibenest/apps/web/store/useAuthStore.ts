import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
  } | null;
  admin: {
    id: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  adminToken: string | null;
  login: (token: string, user: any) => void;
  adminLogin: (adminToken: string, admin: any) => void;
  logout: () => void;
  adminLogout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      admin: null,
      token: null,
      adminToken: null,

      login: (token, user) => {
        set({ token, user });
      },

      adminLogin: (adminToken, admin) => {
        set({ adminToken, admin });
      },

      logout: () => {
        set({ token: null, user: null });
      },

      adminLogout: () => {
        set({ adminToken: null, admin: null });
      },
    }),
    {
      name: 'vibenest-auth-storage',
    }
  )
);
