import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Header from '../../components/Header';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import { createProduct } from '../../api/productApi';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [origin, setOrigin] = useState('');
  const [color, setColor] = useState('');
  const [craftType, setCraftType] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [keywords, setKeywords] = useState('');
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async () => {
    if (!name || !category || !material) {
      Alert.alert(
        'Required',
        'Please enter product name, category and material.'
      );
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name,
        category,
        material,
        origin,
        color,
        craft_type: craftType,
        description_en: descriptionEn,
        description_hi: descriptionHi,
        production_time: productionTime,
        keywords: keywords
          .split(',')
          .map(item => item.trim())
          .filter(Boolean),
        price: Number(price) || 0,
      };

      const result = await createProduct(productData);

      console.log('PRODUCT CREATED:', result);

      Alert.alert(
        'Success',
        'Product created successfully.',
        [
          {
            text: 'View Products',
            onPress: () =>
              navigation.navigate('MyProducts'),
          },
        ]
      );

    } catch (error) {
      console.log(
        'CREATE PRODUCT ERROR:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.detail ||
          'Unable to create product.'
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

      <Header
        title="Create Product"
        subtitle="Add your handmade product details"
      />

      <AppInput
        label="Product Name"
        placeholder="Example: Bamboo Basket"
        value={name}
        onChangeText={setName}
      />

      <AppInput
        label="Category"
        placeholder="Example: Home Decor"
        value={category}
        onChangeText={setCategory}
      />

      <AppInput
        label="Material"
        placeholder="Example: Bamboo"
        value={material}
        onChangeText={setMaterial}
      />

      <AppInput
        label="Origin"
        placeholder="Example: Assam"
        value={origin}
        onChangeText={setOrigin}
      />

      <AppInput
        label="Color"
        placeholder="Example: Natural"
        value={color}
        onChangeText={setColor}
      />

      <AppInput
        label="Craft Type"
        placeholder="Example: Bamboo Craft"
        value={craftType}
        onChangeText={setCraftType}
      />

      <AppInput
        label="English Description"
        placeholder="Describe the product"
        value={descriptionEn}
        onChangeText={setDescriptionEn}
        multiline
      />

      <AppInput
        label="Hindi Description"
        placeholder="हिंदी विवरण"
        value={descriptionHi}
        onChangeText={setDescriptionHi}
        multiline
      />

      <AppInput
        label="Production Time"
        placeholder="Example: 3 days"
        value={productionTime}
        onChangeText={setProductionTime}
      />

      <AppInput
        label="Keywords"
        placeholder="bamboo, handmade, basket"
        value={keywords}
        onChangeText={setKeywords}
      />

      <AppInput
        label="Price"
        placeholder="Example: 850"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <AppButton
        title="Create Product"
        onPress={handleCreateProduct}
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
  },
});