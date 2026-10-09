import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import LoadingScreen from '../../components/LoadingScreen';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import {
  getProduct,
  updateProduct,
} from '../../api/productApi';

export default function EditProductScreen({
  route,
  navigation,
}) {
  const { productId } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [origin, setOrigin] = useState('');
  const [color, setColor] = useState('');
  const [craftType, setCraftType] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const loadProduct = async () => {
    try {
      setLoading(true);

      console.log('Loading product for editing:', productId);

      const data = await getProduct(productId);

      console.log('PRODUCT FOR EDIT:', data);

      setName(data.name || '');
      setCategory(data.category || '');
      setMaterial(data.material || '');
      setOrigin(data.origin || '');
      setColor(data.color || '');
      setCraftType(data.craft_type || '');
      setProductionTime(data.production_time || '');
      setPrice(
        data.price !== null && data.price !== undefined
          ? String(data.price)
          : ''
      );
      setDescription(data.description_en || '');

    } catch (error) {
      console.log(
        'LOAD EDIT PRODUCT ERROR:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        'Unable to load product.'
      );

      navigation.goBack();

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const handleSave = async () => {

    if (saving) return;

    if (!name.trim()) {
      Alert.alert('Required', 'Product name is required.');
      return;
    }

    if (!category.trim()) {
      Alert.alert('Required', 'Category is required.');
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: name.trim(),
        category: category.trim(),
        material: material.trim() || null,
        origin: origin.trim() || null,
        color: color.trim() || null,
        craft_type: craftType.trim() || null,
        production_time: productionTime.trim() || null,
        price: price.trim()
          ? Number(price)
          : null,
        description_en: description.trim() || null,
      };

      console.log(
        'UPDATING PRODUCT:',
        productData
      );

      await updateProduct(
        productId,
        productData
      );

      Alert.alert(
        'Success',
        'Product updated successfully.'
      );

      navigation.goBack();

    } catch (error) {

      console.log(
        'UPDATE PRODUCT ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.detail ||
          'Unable to update product.'
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading product..."
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Edit Product
      </Text>

      <Text style={styles.subtitle}>
        Update your product information.
      </Text>

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
        placeholder="Example: Natural Brown"
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
        label="Production Time"
        placeholder="Example: 3 days"
        value={productionTime}
        onChangeText={setProductionTime}
      />

      <AppInput
        label="Price"
        placeholder="Example: 1200"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <AppInput
        label="Description"
        placeholder="Describe your product"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <AppButton
        title="Save Changes"
        onPress={handleSave}
        loading={saving}
      />

      <AppButton
        title="Cancel"
        secondary
        onPress={() => navigation.goBack()}
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
    paddingBottom: spacing.xxl,
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