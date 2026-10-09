import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import colors from '../theme/colors';

export default function EmptyState({message}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📦</Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  icon: {
    fontSize: 40,
    marginBottom: 12,
  },

  message: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 15,
  },
});