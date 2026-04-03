import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import { supabase } from './src/services/supabase';
import { useAuthStore } from './src/features/auth/useAuthStore';
import { queryClient } from './src/shared/hooks/useQueryClient';
import { AppNavigator } from './src/navigation';
import { colors } from './src/tokens';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { session, setSession, setIsLoading } = useAuthStore();
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Medium': PlayfairDisplay_500Medium,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Light': DMSans_300Light,
  });

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!appReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" backgroundColor={colors.cream} />
      <AppNavigator isAuthenticated={!!session} />
    </QueryClientProvider>
  );
}
