import React, { useState } from 'react';

import {
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import {
  createArtisanProfile,
} from '../../api/artisanApi';

import useAuth from '../../hooks/useAuth';


export default function CreateArtisanProfileScreen() {

  const {
    refreshArtisanProfile,
  } = useAuth();


  const [craftType, setCraftType] = useState('');

  const [preferredLanguage, setPreferredLanguage] =
    useState('');

  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);


  const handleCreateProfile = async () => {

    if (loading) {
      return;
    }


    if (!craftType.trim()) {

      Alert.alert(
        'Required',
        'Please enter your craft type.'
      );

      return;
    }


    try {

      setLoading(true);


      const profileData = {

        craft_type: craftType.trim(),

        preferred_language:
          preferredLanguage.trim() || null,

        location:
          location.trim() || null,

      };


      console.log(
        'CREATING ARTISAN PROFILE:',
        profileData
      );


      await createArtisanProfile(
        profileData
      );


      console.log(
        'ARTISAN PROFILE CREATED'
      );


      /*
       * This updates AuthContext.
       *
       * artisanProfile becomes non-null.
       *
       * RootNavigator automatically changes:
       *
       * Create Profile
       *       ↓
       * Artisan Dashboard
       */

      await refreshArtisanProfile();


    } catch (error) {

      console.log(
        'ARTISAN PROFILE ERROR:',
        error.response?.status,
        error.response?.data
      );


      if (
        error.response?.status === 400
      ) {

        Alert.alert(
          'Profile already exists',
          'Your artisan profile already exists.'
        );

        await refreshArtisanProfile();

        return;
      }


      Alert.alert(
        'Error',
        error.response?.data?.detail ||
        'Unable to create artisan profile.'
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

      <Text style={styles.title}>
        Create Your Artisan Profile
      </Text>


      <Text style={styles.subtitle}>
        Tell us a little about your craft.
      </Text>


      <AppInput
        label="Craft Type"
        placeholder="Example: Bamboo Craft"
        value={craftType}
        onChangeText={setCraftType}
      />


      <AppInput
        label="Preferred Language"
        placeholder="Example: Telugu"
        value={preferredLanguage}
        onChangeText={setPreferredLanguage}
      />


      <AppInput
        label="Location"
        placeholder="Example: Assam"
        value={location}
        onChangeText={setLocation}
      />


      <AppButton
        title="Create Profile"
        onPress={handleCreateProfile}
        loading={loading}
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
    flexGrow: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
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