import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { registerUser } from '../../api/authApi';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('ARTISAN');
  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  console.log('REGISTER BUTTON PRESSED');

  if (!name || !email || !phone || !password) {
    Alert.alert('Error', 'Please fill all required fields.');
    return;
  }

  try {
    setLoading(true);

    console.log('Sending registration request...');

    const result = await registerUser({
      name,
      email,
      phone,
      password,
      role,
      language,
      location,
    });

    console.log('REGISTRATION SUCCESS:', result);

    Alert.alert(
      'Success',
      'Account created successfully.',
      [
        {
          text: 'Login',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );

  } catch (error) {
    console.log('========== REGISTRATION ERROR ==========');
    console.log('Message:', error.message);
    console.log('Response:', error.response?.data);
    console.log('Status:', error.response?.status);
    console.log('========================================');

    Alert.alert(
      'Registration Failed',
      error.response?.data?.detail ||
      error.message ||
      'Unable to register.'
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join Artisan Business Manager
      </Text>

      <AppInput
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <AppInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <AppInput
        label="Phone"
        placeholder="Enter phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <AppInput
        label="Password"
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AppInput
        label="Language"
        placeholder="Example: Hindi"
        value={language}
        onChangeText={setLanguage}
      />

      <AppInput
        label="Location"
        placeholder="Example: Assam"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.roleLabel}>Account Type</Text>

      <View style={styles.roleContainer}>
        <AppButton
          title="ARTISAN"
          secondary={role !== 'ARTISAN'}
          onPress={() => setRole('ARTISAN')}
        />

        <AppButton
          title="BUYER"
          secondary={role !== 'BUYER'}
          onPress={() => setRole('BUYER')}
        />
      </View>

      <AppButton
        title="Register"
        onPress={handleRegister}
        loading={loading}
      />

      <AppButton
        title="Already have an account? Login"
        secondary
        onPress={() => navigation.navigate('Login')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  roleContainer: {
    marginBottom: spacing.md,
  },
});