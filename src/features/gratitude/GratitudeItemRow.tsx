import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';
import { GratitudeItem } from '../../types';

interface GratitudeItemRowProps {
  item: GratitudeItem;
  onDelete: (id: string) => void;
}

export function GratitudeItemRow({ item, onDelete }: GratitudeItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.accent} />
      <Text style={styles.content} numberOfLines={3}>
        {item.content}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
        accessibilityLabel="Remove gratitude item"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.amberPale,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  accent: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: colors.amber,
  },
  content: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkSoft,
    lineHeight: 14 * 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  deleteButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.stone,
    opacity: 0.6,
  },
});
