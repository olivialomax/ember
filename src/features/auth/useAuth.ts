import { useState } from 'react';
import * as authService from '../../services/auth';
import { useAuthStore } from './useAuthStore';

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut: clearStore } = useAuthStore();

  async function login(email: string, password: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.signIn(email, password);
      // Session update handled by onAuthStateChange in App.tsx
    } catch (e: unknown) {
      setError(friendlyError(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function register(email: string, password: string, displayName: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.signUp(email, password, displayName);
    } catch (e: unknown) {
      setError(friendlyError(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateDisplayName(name: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.updateDisplayName(name);
    } catch (e: unknown) {
      setError(friendlyError(e));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setError(null);
    try {
      await authService.signOut();
      clearStore();
    } catch (e: unknown) {
      setError(friendlyError(e));
    }
  }

  return { login, register, logout, updateDisplayName, isSubmitting, error, clearError: () => setError(null) };
}

function friendlyError(e: unknown): string {
  if (e instanceof Error) {
    const msg = e.message.toLowerCase();
    if (msg.includes('invalid login')) return 'Incorrect email or password.';
    if (msg.includes('email not confirmed')) return 'Please confirm your email before signing in.';
    if (msg.includes('user already registered')) return 'An account with this email already exists.';
    if (msg.includes('password')) return 'Password must be at least 6 characters.';
    if (msg.includes('network')) return 'No connection. Please check your internet.';
    return e.message;
  }
  return 'Something went wrong. Please try again.';
}
