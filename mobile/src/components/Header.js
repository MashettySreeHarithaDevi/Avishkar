import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function Header({title, subtitle}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});