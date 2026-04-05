import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
} from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../../tokens';
import { useProfileStore } from './useProfileStore';

const AVATAR_OPTIONS = [
  '🌿', '🌸', '🌻', '🍃', '✨', '🌙',
  '☀️', '🌾', '🦋', '🌊', '🍀', '🌺',
  '🌱', '🫧', '🕊️', '🐚', '🌼', '🍂',
  '🦔', '🐝', '🌛', '🌬️', '🍵', '🪷',
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ProfilePickerModal({ visible, onClose }: Props) {
  const { avatar, setAvatar } = useProfileStore();

  function handleSelect(emoji: string) {
    setAvatar(emoji);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.title}>Choose your icon</Text>
              <Text style={styles.subtitle}>
                Pick something that feels like you
              </Text>

              <FlatList
                data={AVATAR_OPTIONS}
                keyExtractor={(item) => item}
                numColumns={6}
                scrollEnabled={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item === avatar && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionEmoji}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(44,40,37,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.warmWhite,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.md,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
    ...shadows.card,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.stone,
    opacity: 0.2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.stone,
    marginBottom: spacing.lg,
  },
  grid: {
    gap: spacing.sm,
  },
  row: {
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.cream,
  },
  optionSelected: {
    backgroundColor: colors.sagePale,
    borderWidth: 2,
    borderColor: colors.sageLight,
  },
  optionEmoji: {
    fontSize: 26,
  },
});
