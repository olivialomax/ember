import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../tokens';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Root wrapper for every screen. Provides:
 * - cream background
 * - safe area insets
 * - paper texture overlay (approximated with a very subtle semi-transparent layer)
 */
export function ScreenWrapper({ children, style, ...props }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.root, style]} {...props}>
        {/* Paper texture approximation — replace with a noise image asset for full fidelity */}
        <View style={styles.texture} pointerEvents="none" />
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 247, 242, 0.03)',
    zIndex: 0,
  },
});
