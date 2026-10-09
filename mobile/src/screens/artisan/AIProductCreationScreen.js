import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import { enhanceProductImage } from '../../api/aiApi';


export default function AIProductCreationScreen({
  navigation,
  route,
}) {

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // TAKE PHOTO
  const takePhoto = async () => {

    try {

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();


      if (!permission.granted) {

        Alert.alert(
          'Camera Permission',
          'Please allow camera access to take a product photo.'
        );

        return;
      }


      const result =
        await ImagePicker.launchCameraAsync({

          mediaTypes: ['images'],

          allowsEditing: false,

          quality: 0.8,

        });


      if (!result.canceled) {

        const selectedImage =
          result.assets[0];


        console.log(
          'IMAGE SELECTED:',
          selectedImage
        );


        setImage(selectedImage);

      }

    } catch (error) {

      console.log(
        'CAMERA ERROR:',
        error
      );


      Alert.alert(
        'Error',
        'Unable to open camera.'
      );

    }

  };


  // -----------------------------------------
  // SELECT FROM GALLERY
  // -----------------------------------------

  const chooseFromGallery = async () => {

    try {

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();


      if (!permission.granted) {

        Alert.alert(
          'Gallery Permission',
          'Please allow gallery access to select a product photo.'
        );

        return;
      }


      const result =
        await ImagePicker.launchImageLibraryAsync({

          mediaTypes: ['images'],

          allowsEditing: false,

          quality: 0.8,

        });


      if (!result.canceled) {

        const selectedImage =
          result.assets[0];


        console.log(
          'IMAGE SELECTED:',
          selectedImage
        );


        setImage(selectedImage);

      }

    } catch (error) {

      console.log(
        'GALLERY ERROR:',
        error
      );


      Alert.alert(
        'Error',
        'Unable to open gallery.'
      );

    }

  };


  // -----------------------------------------
  // REMOVE IMAGE
  // -----------------------------------------

  const removeImage = () => {

    setImage(null);

  };


  // -----------------------------------------
  // CONTINUE → AI IMAGE ENHANCEMENT
  // -----------------------------------------

const handleContinue = async () => {

  if (!image) {
    Alert.alert(
      'Select Image',
      'Please select a product image first.'
    );
    return;
  }

  if (loading) {
    return;
  }

  try {

    setLoading(true);

    console.log('STARTING IMAGE ENHANCEMENT');
    console.log('IMAGE URI:', image.uri);

    let result;

    try {

      result = await enhanceProductImage(image);

    } catch (firstError) {

      console.log(
        'FIRST IMAGE ENHANCEMENT ATTEMPT FAILED:',
        firstError?.message
      );

      /*
       * Retry once for transient network failures.
       * This is especially useful with Expo + local LAN backend.
       */

      if (
        firstError?.message === 'Network Error' ||
        !firstError?.response
      ) {

        console.log(
          'RETRYING IMAGE ENHANCEMENT...'
        );

        await new Promise(resolve =>
          setTimeout(resolve, 1000)
        );

        result = await enhanceProductImage(image);

      } else {

        throw firstError;

      }

    }

    console.log(
      'IMAGE ENHANCEMENT SUCCESS:',
      result
    );

    const enhancedImage = result?.image_url;

    if (!enhancedImage) {

      throw new Error(
        'Image enhancement succeeded but no image URL was returned.'
      );

    }

    navigation.navigate(
      'AIVoiceRecording',
      {
        originalImage: image.uri,
        enhancedImage: enhancedImage,
      }
    );

  } catch (error) {

    console.log(
      'AI IMAGE ENHANCEMENT ERROR:',
      error
    );

    console.log(
      'ERROR RESPONSE:',
      error?.response?.data
    );

    Alert.alert(
      'Image Enhancement Failed',
      error?.response?.data?.detail ||
      error?.message ||
      'Unable to enhance the image. Please try again.'
    );

  } finally {

    setLoading(false);

  }
};


  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (

    <ScrollView

      style={styles.container}

      contentContainerStyle={styles.content}

      showsVerticalScrollIndicator={false}

    >

      {/* HEADER */}

      <Text style={styles.title}>
        Create Product
      </Text>


      <Text style={styles.subtitle}>
        First, add a photo of your craft.
      </Text>


      {/* IMAGE PREVIEW */}

      {image ? (

        <View style={styles.previewContainer}>

          <Image

            source={{
              uri: image.uri,
            }}

            style={styles.preview}

          />


          <TouchableOpacity

            style={styles.removeButton}

            onPress={removeImage}

            disabled={loading}

          >

            <Text style={styles.removeText}>
              ✕ Remove
            </Text>

          </TouchableOpacity>

        </View>

      ) : (

        <View style={styles.placeholder}>

          <Text style={styles.placeholderIcon}>
            📷
          </Text>


          <Text style={styles.placeholderTitle}>
            No photo selected
          </Text>


          <Text style={styles.placeholderText}>
            Take a clear photo of your handmade product.
          </Text>

        </View>

      )}


      {/* CAMERA */}

      <TouchableOpacity

        style={styles.primaryButton}

        onPress={takePhoto}

        disabled={loading}

      >

        <Text style={styles.primaryIcon}>
          📸
        </Text>


        <View>

          <Text style={styles.primaryTitle}>
            Take Photo
          </Text>


          <Text style={styles.primarySubtitle}>
            Use your camera
          </Text>

        </View>

      </TouchableOpacity>


      {/* GALLERY */}

      <TouchableOpacity

        style={styles.secondaryButton}

        onPress={chooseFromGallery}

        disabled={loading}

      >

        <Text style={styles.secondaryIcon}>
          🖼️
        </Text>


        <View>

          <Text style={styles.secondaryTitle}>
            Choose Photo
          </Text>


          <Text style={styles.secondarySubtitle}>
            Select from gallery
          </Text>

        </View>

      </TouchableOpacity>


      {/* CONTINUE */}

      {image && (

        <TouchableOpacity

          style={[

            styles.continueButton,

            loading && styles.disabledButton,

          ]}

          onPress={handleContinue}

          disabled={loading}

        >

          {loading ? (

            <>

              <ActivityIndicator

                size="small"

                color={colors.white}

              />


              <Text style={styles.continueText}>
                Enhancing Image...
              </Text>

            </>

          ) : (

            <Text style={styles.continueText}>
              ✓ Use This Photo
            </Text>

          )}

        </TouchableOpacity>

      )}


      {/* AI INFORMATION */}

      <View style={styles.infoCard}>

        <Text style={styles.infoTitle}>
          ✨ What happens next?
        </Text>


        <Text style={styles.infoText}>

          AI will enhance your product image.
          Then you can describe your craft using
          your voice and AI will help create your
          product catalog.

        </Text>

      </View>


    </ScrollView>

  );

}


// -----------------------------------------
// STYLES
// -----------------------------------------

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: colors.background,

  },


  content: {

    padding: spacing.lg,

    paddingBottom: 40,

  },


  title: {

    fontSize: 30,

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


  placeholder: {

    height: 230,

    borderRadius: 24,

    backgroundColor: colors.white,

    borderWidth: 1,

    borderColor: colors.border,

    alignItems: 'center',

    justifyContent: 'center',

    padding: spacing.lg,

    marginBottom: spacing.md,

  },


  placeholderIcon: {

    fontSize: 55,

    marginBottom: 10,

  },


  placeholderTitle: {

    fontSize: 18,

    fontWeight: '700',

    color: colors.text,

    marginBottom: 5,

  },


  placeholderText: {

    fontSize: 13,

    color: colors.textSecondary,

    textAlign: 'center',

  },


  previewContainer: {

    marginBottom: spacing.md,

  },


  preview: {

    width: '100%',

    height: 300,

    borderRadius: 24,

    resizeMode: 'cover',

  },


  removeButton: {

    alignSelf: 'center',

    marginTop: 10,

    paddingHorizontal: 16,

    paddingVertical: 8,

  },


  removeText: {

    fontSize: 14,

    fontWeight: '600',

    color: colors.textSecondary,

  },


  primaryButton: {

    backgroundColor: colors.white,

    borderRadius: 20,

    padding: 18,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: colors.border,

    marginBottom: spacing.md,

  },


  primaryIcon: {

    fontSize: 36,

    marginRight: 15,

  },


  primaryTitle: {

    fontSize: 18,

    fontWeight: '700',

    color: colors.text,

  },


  primarySubtitle: {

    fontSize: 13,

    color: colors.textSecondary,

    marginTop: 3,

  },


  secondaryButton: {

    backgroundColor: colors.white,

    borderRadius: 20,

    padding: 18,

    flexDirection: 'row',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: colors.border,

    marginBottom: spacing.md,

  },


  secondaryIcon: {

    fontSize: 36,

    marginRight: 15,

  },


  secondaryTitle: {

    fontSize: 18,

    fontWeight: '700',

    color: colors.text,

  },


  secondarySubtitle: {

    fontSize: 13,

    color: colors.textSecondary,

    marginTop: 3,

  },


  continueButton: {

    backgroundColor: colors.primary,

    borderRadius: 18,

    paddingVertical: 16,

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 5,

    marginBottom: spacing.md,

    flexDirection: 'row',

    gap: 10,

  },


  disabledButton: {

    opacity: 0.7,

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

    marginTop: spacing.md,

  },


  infoTitle: {

    fontSize: 17,

    fontWeight: '700',

    color: colors.text,

    marginBottom: 7,

  },


  infoText: {

    fontSize: 14,

    lineHeight: 21,

    color: colors.textSecondary,

  },

});