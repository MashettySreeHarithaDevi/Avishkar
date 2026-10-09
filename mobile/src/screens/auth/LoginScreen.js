import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import useAuth from '../../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

  try {

    setLoading(true);

    await login(
      email.trim(),
      password
    );

    // DO NOT NAVIGATE HERE

  } catch (error) {

    Alert.alert(
      'Login Failed',
      error.response?.data?.detail ||
      'Invalid email or password.'
    );

  } finally {

    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Login to your Artisan Business Manager
        </Text>

        <AppInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <AppButton
          title="Login"
          onPress={handleLogin}
          loading={loading}
        />

        <AppButton
          title="Create Account"
          secondary
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
});