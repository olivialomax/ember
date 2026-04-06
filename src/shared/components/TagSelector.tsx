import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../tokens';

interface TagSelectorProps {
  label?: string;
  tags: readonly string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ label = 'Context', tags, selected, onChange }: TagSelectorProps) {
  const [customInput, setCustomInput] = useState('');

  function toggleTag(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  function addCustomTag() {
    const trimmed = customInput.trim().toLowerCase();
    if (!trimmed || selected.includes(trimmed)) {
      setCustomInput('');
      return;
    }
    onChange([...selected, trimmed]);
    setCustomInput('');
  }

  function removeTag(tag: string) {
    onChange(selected.filter((t) => t !== tag));
  }

  // Custom tags are those in `selected` that aren't in the predefined list
  const customTags = selected.filter((t) => !(tags as readonly string[]).includes(t));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chipsRow}>
        {tags.map((tag) => {
          const isSelected = selected.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleTag(tag)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}

        {customTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.chip, styles.chipSelected]}
            onPress={() => removeTag(tag)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: true }}
          >
            <Text style={[styles.chipText, styles.chipTextSelected]}>{tag}</Text>
            <Text style={styles.removeX}> ×</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom tag input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Add your own…"
          placeholderTextColor={colors.stone}
          value={customInput}
          onChangeText={setCustomInput}
          onSubmitEditing={addCustomTag}
          returnKeyType="done"
          maxLength={40}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addCustomTag}
          accessibilityLabel="Add custom tag"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.08 * 10,
    color: colors.stone,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(44,40,37,0.10)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipSelected: {
    backgroundColor: colors.sagePale,
    borderColor: colors.sage,
  },
  chipText: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  chipTextSelected: {
    color: colors.sage,
  },
  removeX: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.sage,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(44,40,37,0.10)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: typography.body,
    fontSize: 22,
    color: colors.sage,
    lineHeight: 28,
  },
});
