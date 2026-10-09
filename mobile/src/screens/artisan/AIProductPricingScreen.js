import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

import { predictPrice } from '../../api/pricingApi';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';


export default function AIProductPricingScreen({
  navigation,
  route,
}) {

  const {
    originalImage,
    enhancedImage,
    englishText,
    productData,
  } = route.params || {};


  const [rawMaterialCost, setRawMaterialCost] =
    useState('');

  const [labourCost, setLabourCost] =
    useState('');

  const [productionDays, setProductionDays] =
    useState(
      productData?.production_time
        ? productData.production_time.replace(/\D/g, '')
        : ''
    );

  const [packagingCost, setPackagingCost] =
    useState('');

  const [transportCost, setTransportCost] =
    useState('');

  const [demandScore, setDemandScore] =
    useState('3');

  const [loading, setLoading] =
    useState(false);

  const [predictedPrice, setPredictedPrice] =
    useState(null);


  const calculatePrice = async () => {

    try {

      if (!rawMaterialCost ||
          !labourCost ||
          !productionDays ||
          !packagingCost ||
          !transportCost) {

        Alert.alert(
          'Missing Information',
          'Please enter all cost details.'
        );

        return;
      }


      setLoading(true);


      const pricingData = {

        category:
          productData?.category || 'Other',

        material:
          productData?.material || 'Other',

        craft_type:
          productData?.craft_type || 'Handmade',

        region:
          productData?.origin || 'India',

        raw_material_cost:
          Number(rawMaterialCost),

        labour_cost:
          Number(labourCost),

        production_days:
          Number(productionDays),

        packaging_cost:
          Number(packagingCost),

        transport_cost:
          Number(transportCost),

        demand_score:
          Number(demandScore),

        season:
          'Normal',
      };


      console.log(
        'PRICING INPUT:',
        pricingData
      );


      const response =
        await predictPrice(pricingData);


      console.log(
        'PRICING RESPONSE:',
        response
      );


      const price =
            response?.recommended_price ??
            response?.predicted_price ??
            response?.selling_price ??
            response?.price;


      if (price === undefined) {

        throw new Error(
          'Pricing API did not return a predicted price.'
        );

      }


      setPredictedPrice(
        Math.round(Number(price))
      );


    } catch (error) {

      console.log(
        'PRICING ERROR:',
        error
      );

      console.log(
        'PRICING ERROR RESPONSE:',
        error?.response?.data
      );


      Alert.alert(
        'Pricing Failed',
        error?.response?.data?.detail ||
        error?.message ||
        'Unable to calculate product price.'
      );

    } finally {

      setLoading(false);

    }

  };


  const continueToReview = () => {

    if (!predictedPrice) {

      Alert.alert(
        'Calculate Price',
        'Please calculate the price first.'
      );

      return;

    }


    navigation.navigate(
      'AIProductReview',
      {
        originalImage,
        enhancedImage,
        englishText,

        productData: {
          ...productData,

          price: predictedPrice,
        },
      }
    );

  };


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Set Product Price
      </Text>

      <Text style={styles.subtitle}>
        Tell us your approximate production costs.
        AI will suggest a suitable selling price.
      </Text>


      {/* PRODUCT */}

      <View style={styles.productCard}>

        <Text style={styles.productName}>
          {productData?.name || 'Your Product'}
        </Text>

        <Text style={styles.productInfo}>
          {productData?.material || 'Material'} •{' '}
          {productData?.craft_type || 'Handmade'}
        </Text>

      </View>


      {/* RAW MATERIAL */}

      <Text style={styles.label}>
        Raw Material Cost
      </Text>

      <TextInput
        style={styles.input}
        value={rawMaterialCost}
        onChangeText={setRawMaterialCost}
        placeholder="Example: 300"
        keyboardType="numeric"
      />


      {/* LABOUR */}

      <Text style={styles.label}>
        Labour Cost
      </Text>

      <TextInput
        style={styles.input}
        value={labourCost}
        onChangeText={setLabourCost}
        placeholder="Example: 500"
        keyboardType="numeric"
      />


      {/* PRODUCTION */}

      <Text style={styles.label}>
        Production Days
      </Text>

      <TextInput
        style={styles.input}
        value={productionDays}
        onChangeText={setProductionDays}
        placeholder="Example: 5"
        keyboardType="numeric"
      />


      {/* PACKAGING */}

      <Text style={styles.label}>
        Packaging Cost
      </Text>

      <TextInput
        style={styles.input}
        value={packagingCost}
        onChangeText={setPackagingCost}
        placeholder="Example: 50"
        keyboardType="numeric"
      />


      {/* TRANSPORT */}

      <Text style={styles.label}>
        Transport Cost
      </Text>

      <TextInput
        style={styles.input}
        value={transportCost}
        onChangeText={setTransportCost}
        placeholder="Example: 100"
        keyboardType="numeric"
      />


      {/* DEMAND */}

      <Text style={styles.label}>
        Demand Score
      </Text>

      <TextInput
        style={styles.input}
        value={demandScore}
        onChangeText={setDemandScore}
        placeholder="1 - 5"
        keyboardType="numeric"
      />

      <Text style={styles.helper}>
        1 = Low demand • 5 = High demand
      </Text>


      {/* CALCULATE */}

      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculatePrice}
        disabled={loading}
      >

        {loading ? (

          <ActivityIndicator
            color={colors.white}
          />

        ) : (

          <Text style={styles.buttonText}>
            Calculate AI Price
          </Text>

        )}

      </TouchableOpacity>


      {/* RESULT */}

      {predictedPrice !== null && (

        <View style={styles.priceCard}>

          <Text style={styles.priceLabel}>
            AI Suggested Price
          </Text>

          <Text style={styles.price}>
            ₹{predictedPrice}
          </Text>

          <Text style={styles.priceNote}>
            You can review and edit this price
            before publishing your product.
          </Text>

        </View>

      )}


      {/* CONTINUE */}

      {predictedPrice !== null && (

        <TouchableOpacity
          style={styles.continueButton}
          onPress={continueToReview}
        >

          <Text style={styles.continueText}>
            Continue to Review →
          </Text>

        </TouchableOpacity>

      )}

    </ScrollView>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.large,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.small,
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.large,
  },

  productCard: {
    backgroundColor: colors.white,
    padding: spacing.medium,
    borderRadius: 16,
    marginBottom: spacing.large,
  },

  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  productInfo: {
    marginTop: 5,
    color: colors.textSecondary,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: spacing.medium,
  },

  helper: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -8,
    marginBottom: spacing.medium,
  },

  calculateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.small,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  priceCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.large,
    alignItems: 'center',
    marginTop: spacing.large,
  },

  priceLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },

  price: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 8,
  },

  priceNote: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  continueButton: {
    marginTop: spacing.large,
    backgroundColor: colors.text,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  continueText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

});