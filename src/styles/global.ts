import { StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../tokens';

export const globalStyles = StyleSheet.create({
  cardStyle: {
    backgroundColor: colors.warmWhite,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    ...shadows.card,
  },

  insetStyle: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  sectionTitle: {
    fontFamily: typography.display,
    fontSize: 17,
    color: colors.ink,
  },

  eyebrow: {
    fontFamily: typography.body,
    fontSize: 10,
    textTransform: 'uppercase',
    color: colors.stone,
    letterSpacing: 0.14,
  },

  bodyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 21,
  },

  primaryButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    padding: 14,
    width: '100%',
    alignItems: 'center',
  },

  primaryButtonText: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: colors.warmWhite,
    letterSpacing: 0.02 * 14,
  },
});
