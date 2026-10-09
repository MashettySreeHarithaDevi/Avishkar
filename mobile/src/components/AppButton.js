import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  secondary = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        secondary && styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            secondary && styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },

  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  disabledButton: {
    opacity: 0.5,
  },

  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryText: {
    color: colors.primary,
  },
});