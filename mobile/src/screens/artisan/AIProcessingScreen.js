import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  uploadAudio,
  translateAudio,
  generateCatalog,
} from '../../api/aiApi';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';


export default function AIProcessingScreen({
  navigation,
  route,
}) {

  console.log('🔥 AI PROCESSING SCREEN OPENED');

  const {
    originalImage,
    enhancedImage,
    audioUri,
  } = route.params || {};


  const [status, setStatus] = useState(
    'Preparing your product information...'
  );


  useEffect(() => {

    processProduct();

  }, []);


  const processProduct = async () => {

    try {

      // --------------------------------
      // CHECK AUDIO
      // --------------------------------

      if (!audioUri) {

        throw new Error(
          'Audio recording not found.'
        );

      }


      // --------------------------------
      // STEP 1: UPLOAD AUDIO
      // --------------------------------

      setStatus(
        'Uploading your voice...'
      );

      console.log(
        'AI PROCESSING - AUDIO:',
        audioUri
      );


      const uploadResponse =
        await uploadAudio(audioUri);


      console.log(
        'AUDIO UPLOAD RESULT:',
        uploadResponse
      );


      const filename =
        uploadResponse?.filename;


      if (!filename) {

        throw new Error(
          'Audio upload failed.'
        );

      }


      // --------------------------------
      // STEP 2: SPEECH → ENGLISH
      // --------------------------------

      setStatus(
        'Understanding your description...'
      );


      console.log(
        'STARTING AUDIO TRANSLATION:',
        filename
      );


      const translationResponse =
        await translateAudio(filename);


      console.log(
        'TRANSLATION RESULT:',
        translationResponse
      );


      const englishText =
        translationResponse?.english_text;


      if (!englishText) {

        throw new Error(
          'Could not understand the voice description.'
        );

      }


      // --------------------------------
      // STEP 3: GEMINI CATALOG
      // --------------------------------

      setStatus(
        'Creating your product details...'
      );


      console.log(
        'STARTING CATALOG GENERATION'
      );


      console.log(
        'ENGLISH TEXT:',
        englishText
      );


      const catalogResponse =
        await generateCatalog(
          englishText
        );


      console.log(
        'CATALOG RESPONSE:',
        catalogResponse
      );


      // --------------------------------
      // GET ACTUAL CATALOG OBJECT
      // --------------------------------

      const productData =
        catalogResponse?.catalog ||
        catalogResponse;


      console.log(
        'PRODUCT DATA FROM AI:',
        productData
      );


      if (
        !productData ||
        !productData.name
      ) {

        throw new Error(
          'AI could not generate product details.'
        );

      }


      // --------------------------------
      // STEP 4: AI PROCESSING COMPLETE
      // --------------------------------

      console.log(
        'AI PROCESSING COMPLETED'
      );


      console.log(
        'MOVING TO AI PRICING'
      );


      // --------------------------------
      // STEP 5: GO TO PRICING
      // --------------------------------

      navigation.replace(
        'AIProductPricing',
        {
          originalImage,
          enhancedImage,
          audioUri,
          englishText,

          // IMPORTANT:
          // Pass the actual catalog object
          // as productData
          productData,
        }
      );


    } catch (error) {

      console.log(
        'AI PROCESSING ERROR:',
        error
      );


      console.log(
        'ERROR RESPONSE:',
        error?.response?.data
      );


      Alert.alert(
        'AI Processing Failed',

        error?.response?.data?.detail ||
        error?.message ||
        'Something went wrong while processing your product.'
      );


      navigation.goBack();

    }

  };


  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.icon}>
          🤖
        </Text>


        <Text style={styles.title}>
          Creating Your Product
        </Text>


        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />


        <Text style={styles.status}>
          {status}
        </Text>


        <Text style={styles.subtitle}>
          AI is turning your photo and voice
          description into a ready-to-review
          product.
        </Text>

      </View>

    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.large,
  },


  card: {
    width: '100%',
    padding: spacing.large,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
  },


  icon: {
    fontSize: 55,
    marginBottom: spacing.medium,
  },


  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },


  loader: {
    marginVertical: spacing.large,
  },


  status: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.medium,
  },


  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },

});