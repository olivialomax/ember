import { create } from 'zustand';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setIsLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null, session: null }),
}));
