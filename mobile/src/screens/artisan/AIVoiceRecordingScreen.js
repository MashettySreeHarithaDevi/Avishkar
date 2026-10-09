import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function AIVoiceRecordingScreen({
  navigation,
  route,
}) {
  const { originalImage, enhancedImage } = route.params || {};

  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY
  );

  const recorderState = useAudioRecorderState(recorder);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // REQUEST MICROPHONE PERMISSION
  // -----------------------------------------

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const permission =
          await requestRecordingPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Microphone Permission',
            'Please allow microphone access to record your product description.'
          );

          return;
        }

        setPermissionGranted(true);

        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

      } catch (error) {
        console.log('AUDIO SETUP ERROR:', error);

        Alert.alert(
          'Error',
          'Unable to setup microphone.'
        );
      }
    };

    setupAudio();
  }, []);

  // -----------------------------------------
  // START RECORDING
  // -----------------------------------------

  const startRecording = async () => {
    try {
      if (!permissionGranted) {
        Alert.alert(
          'Permission Required',
          'Please allow microphone permission first.'
        );

        return;
      }

      setLoading(true);

      await recorder.prepareToRecordAsync();

      recorder.record();

      setRecordingUri(null);

      console.log('VOICE RECORDING STARTED');

    } catch (error) {
      console.log(
        'START RECORDING ERROR:',
        error
      );

      Alert.alert(
        'Recording Error',
        'Unable to start recording.'
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // STOP RECORDING
  // -----------------------------------------

  const stopRecording = async () => {
    try {
      setLoading(true);

      await recorder.stop();

      const uri = recorder.uri;

      console.log(
        'VOICE RECORDING FINISHED:',
        uri
      );

      setRecordingUri(uri);

    } catch (error) {
      console.log(
        'STOP RECORDING ERROR:',
        error
      );

      Alert.alert(
        'Recording Error',
        'Unable to stop recording.'
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // CONTINUE
  // -----------------------------------------

  const continueToNextStep = () => {
  if (!recordingUri) {
    Alert.alert(
      'Record Voice',
      'Please record your product description first.'
    );
    return;
  }

  console.log(
    'VOICE READY FOR AI:',
    recordingUri
  );

  navigation.navigate(
    'AIProcessing',
    {
      originalImage,
      enhancedImage,
      audioUri: recordingUri,
    }
  );
};

  // -----------------------------------------
  // UI
  // -----------------------------------------

  const isRecording =
    recorderState.isRecording;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Tell Us About Your Product
      </Text>

      <Text style={styles.subtitle}>
        Speak naturally about your handmade product.
      </Text>

      {/* MICROPHONE */}

      <View style={styles.recordCard}>

        <Text style={styles.microphone}>
          🎤
        </Text>

        {isRecording ? (

          <Text style={styles.recordingText}>
            Recording...
          </Text>

        ) : recordingUri ? (

          <Text style={styles.recordingText}>
            Recording complete
          </Text>

        ) : (

          <Text style={styles.recordingText}>
            Tap the button to start
          </Text>

        )}

      </View>

      {/* RECORD BUTTON */}

      {!isRecording ? (

        <TouchableOpacity
          style={styles.recordButton}
          onPress={startRecording}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color={colors.white}
            />

          ) : (

            <Text style={styles.recordButtonText}>
              🎤 Start Recording
            </Text>

          )}

        </TouchableOpacity>

      ) : (

        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopRecording}
          disabled={loading}
        >

          <Text style={styles.stopButtonText}>
            ⏹ Stop Recording
          </Text>

        </TouchableOpacity>

      )}

      {/* CONTINUE */}

      {recordingUri && !isRecording && (

        <TouchableOpacity
          style={styles.continueButton}
          onPress={continueToNextStep}
        >

          <Text style={styles.continueText}>
            Continue →
          </Text>

        </TouchableOpacity>

      )}

      {/* HELPER TEXT */}

      <View style={styles.infoCard}>

        <Text style={styles.infoTitle}>
          💡 What can you say?
        </Text>

        <Text style={styles.infoText}>
          Describe what the product is,
          what material you used, where it
          was made, its color, and anything
          special about the craft.
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  recordCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 35,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },

  microphone: {
    fontSize: 70,
    marginBottom: 20,
  },

  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  recordButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 25,
  },

  recordButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },

  stopButton: {
    backgroundColor: '#B33A3A',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 25,
  },

  stopButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },

  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 15,
  },

  continueText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: 25,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },

});