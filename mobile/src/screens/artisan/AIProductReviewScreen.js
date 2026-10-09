import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { createProduct } from '../../api/productApi';
import { attachExistingProductImage } from '../../api/imageApi';


export default function AIProductReviewScreen({
  navigation,
  route,
}) {

  const params = route.params || {};

  console.log(
    '🔥 REVIEW SCREEN PARAMS:',
    params
  );


  const {
    originalImage,
    enhancedImage,
    englishText,
  } = params;


  // IMPORTANT:
  // Accept either productData or catalog
  const productData =
    params.productData ||
    params.catalog ||
    {};


  console.log(
    '🔥 REVIEW PRODUCT DATA:',
    productData
  );


  const [name, setName] = useState(
    productData.name || ''
  );

  const [category, setCategory] = useState(
    productData.category || ''
  );

  const [material, setMaterial] = useState(
    productData.material || ''
  );

  const [origin, setOrigin] = useState(
    productData.origin || ''
  );

  const [color, setColor] = useState(
    productData.color || ''
  );

  const [craftType, setCraftType] = useState(
    productData.craft_type || ''
  );

  const [productionTime, setProductionTime] =
    useState(
      productData.production_time || ''
    );

  const [description, setDescription] =
    useState(
      productData.description_en || ''
    );

  const [keywords, setKeywords] =
    useState(
      Array.isArray(productData.keywords)
        ? productData.keywords.join(', ')
        : productData.keywords || ''
    );

  const [price, setPrice] =
    useState(
      productData.price
        ? String(productData.price)
        : ''
    );


  const handleContinue = async () => {

  if (!name.trim()) {

    Alert.alert(
      'Product Name Required',
      'Please enter a product name.'
    );

    return;
  }

  if (!price.trim()) {

    Alert.alert(
      'Price Required',
      'Please enter a selling price.'
    );

    return;
  }


  try {

    const finalProductData = {

      name: name.trim(),

      category: category.trim(),

      material: material.trim(),

      origin: origin.trim(),

      color: color.trim(),

      craft_type: craftType.trim(),

      description_en: description.trim(),

      description_hi: '',

      production_time:
        productionTime.trim(),

      keywords:
        keywords
          .split(',')
          .map(item => item.trim())
          .filter(
            item => item.length > 0
          ),

      price: Number(price),

      status: 'DRAFT',
    };


    console.log(
      '================================'
    );

    console.log(
      'SAVING PRODUCT:',
      finalProductData
    );

    console.log(
      'ENHANCED IMAGE BEFORE SAVE:',
      enhancedImage
    );

    console.log(
      '================================'
    );


    // ------------------------------------------
    // CREATE PRODUCT
    // ------------------------------------------

    const productResponse = await createProduct(
  finalProductData,
  enhancedImage
);


    console.log(
      'PRODUCT CREATED:',
      productResponse
    );


    const productId =
      productResponse?.id ||
      productResponse?.product_id;


    if (!productId) {

      throw new Error(
        'Product was created but product ID was not returned.'
      );
    }


    // ------------------------------------------
    // ATTACH AI IMAGE
    // ------------------------------------------

    if (enhancedImage) {

      let imageUrl = enhancedImage;


      // Handle object response too
      if (
        typeof enhancedImage === 'object'
      ) {

        imageUrl =
          enhancedImage.image_url ||
          enhancedImage.url ||
          enhancedImage.path ||
          null;
      }


      console.log(
        'FINAL IMAGE URL TO ATTACH:',
        imageUrl
      );


      if (imageUrl) {

        await attachExistingProductImage(
          productId,
          imageUrl
        );

        console.log(
          'IMAGE SUCCESSFULLY ATTACHED'
        );

      } else {

        console.log(
          'IMAGE OBJECT DID NOT CONTAIN IMAGE URL'
        );

      }

    } else {

      console.log(
        'NO ENHANCED IMAGE FOUND'
      );

    }


    Alert.alert(
      'Product Saved',
      'Your product and image have been saved as a draft.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace(
              'MyProducts'
            ),
        },
      ]
    );

  } catch (error) {

    console.log(
      'SAVE PRODUCT ERROR:',
      error
    );

    console.log(
      'ERROR RESPONSE:',
      error?.response?.data
    );


    Alert.alert(
      'Save Failed',
      error?.response?.data?.detail ||
      error?.message ||
      'Unable to save the product.'
    );
  }
};

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Text style={styles.title}>
        Review Your Product
      </Text>


      <Text style={styles.subtitle}>
        AI created these details from your voice.
        You can edit anything before continuing.
      </Text>


      {(enhancedImage || originalImage) && (

        <Image
          source={{
            uri:
              enhancedImage ||
              originalImage,
          }}
          style={styles.productImage}
        />

      )}


      {/* PRODUCT NAME */}

      <Text style={styles.label}>
        Product Name
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Product name"
      />


      {/* CATEGORY */}

      <Text style={styles.label}>
        Category
      </Text>

      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
      />


      {/* MATERIAL */}

      <Text style={styles.label}>
        Material
      </Text>

      <TextInput
        style={styles.input}
        value={material}
        onChangeText={setMaterial}
        placeholder="Material"
      />


      {/* ORIGIN */}

      <Text style={styles.label}>
        Origin
      </Text>

      <TextInput
        style={styles.input}
        value={origin}
        onChangeText={setOrigin}
        placeholder="Origin"
      />


      {/* COLOR */}

      <Text style={styles.label}>
        Color
      </Text>

      <TextInput
        style={styles.input}
        value={color}
        onChangeText={setColor}
        placeholder="Color"
      />


      {/* CRAFT TYPE */}

      <Text style={styles.label}>
        Craft Type
      </Text>

      <TextInput
        style={styles.input}
        value={craftType}
        onChangeText={setCraftType}
        placeholder="Craft type"
      />


      {/* PRODUCTION TIME */}

      <Text style={styles.label}>
        Production Time
      </Text>

      <TextInput
        style={styles.input}
        value={productionTime}
        onChangeText={setProductionTime}
        placeholder="Example: 5 days"
      />


      {/* DESCRIPTION */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.descriptionInput,
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Product description"
        multiline
        textAlignVertical="top"
      />


      {/* KEYWORDS */}

      <Text style={styles.label}>
        Keywords
      </Text>

      <TextInput
        style={styles.input}
        value={keywords}
        onChangeText={setKeywords}
        placeholder="bamboo, basket, handmade"
      />


      {/* PRICE */}

      <Text style={styles.label}>
        Selling Price
      </Text>

      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />


      {/* SAVE */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >

        <Text style={styles.buttonText}>
          Save Product →
        </Text>

      </TouchableOpacity>

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
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.small,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.large,
  },

  productImage: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    marginBottom: spacing.large,
    backgroundColor: colors.white,
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
    color: colors.text,
  },

  descriptionInput: {
    minHeight: 120,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.medium,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

});