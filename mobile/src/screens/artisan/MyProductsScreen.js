import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';

import {
  getProducts,
} from '../../api/productApi';

import {
  getProductImages,
  getFullImageUrl,
} from '../../api/imageApi';


export default function MyProductsScreen({
  navigation,
}) {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // ==========================================
  // LOAD PRODUCTS + IMAGES
  // ==========================================

  const loadProducts = async () => {

    try {

      console.log(
        'LOADING MY PRODUCTS...'
      );

      setLoading(true);


      const data =
        await getProducts();


      const productList =
        Array.isArray(data)
          ? data
          : data?.products || [];


      console.log(
        'PRODUCT COUNT:',
        productList.length
      );


      // ----------------------------------------
      // LOAD IMAGES FOR EACH PRODUCT
      // ----------------------------------------

      const productsWithImages =
        await Promise.all(

          productList.map(
            async (product) => {

              try {

                const imageResponse =
                  await getProductImages(
                    product.id
                  );


                const imageList =
                  Array.isArray(
                    imageResponse
                  )
                    ? imageResponse
                    : [];


                const firstImage =
                  imageList.length > 0
                    ? imageList[0]
                    : null;


                return {

                  ...product,

                  image_url:
                    firstImage?.image_url ||
                    null,
                };

              } catch (imageError) {

                console.log(
                  'IMAGE LOAD ERROR:',
                  product.id,
                  imageError?.response?.data ||
                  imageError?.message
                );


                return {

                  ...product,

                  image_url: null,

                };
              }
            }
          )
        );


      console.log(
        'PRODUCTS WITH IMAGES:',
        productsWithImages
      );


      setProducts(
        productsWithImages
      );

    } catch (error) {

      console.log(
        'GET MY PRODUCTS ERROR:',
        error?.response?.status,
        error?.response?.data,
        error?.message
      );

      Alert.alert(
        'Error',
        'Unable to open my products.'
      );

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };


  // ==========================================
  // LOAD WHEN SCREEN FOCUSES
  // ==========================================

  useFocusEffect(
    useCallback(() => {

      loadProducts();

    }, [])
  );


  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {

    setRefreshing(true);

    loadProducts();
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <LoadingScreen
        message="Loading your products..."
      />
    );
  }


  // ==========================================
  // PRODUCT CARD
  // ==========================================

  const renderProduct = ({
    item,
  }) => {

    const imageUrl =
      getFullImageUrl(
        item.image_url
      );


    return (

      <TouchableOpacity

        style={styles.card}

        onPress={() =>
          navigation.navigate(
            'ProductDetails',
            {
              productId: item.id,
            }
          )
        }

      >

        {/* IMAGE */}

        <View style={styles.imageContainer}>

          {imageUrl ? (

            <Image
              source={{
                uri: imageUrl,
              }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(error) =>
                console.log(
                  'IMAGE DISPLAY ERROR:',
                  error.nativeEvent
                )
              }
            />

          ) : (

            <View
              style={
                styles.noImageContainer
              }
            >

              <Text
                style={styles.noImageIcon}
              >
                🖼️
              </Text>

              <Text
                style={styles.noImageText}
              >
                No product image
              </Text>

            </View>

          )}

        </View>


        {/* NAME */}

        <Text style={styles.name}>
          {item.name ||
            'Unnamed Product'}
        </Text>


        {/* CATEGORY */}

        <Text style={styles.category}>
          {item.category ||
            'No category'}
        </Text>


        {/* MATERIAL */}

        <Text style={styles.material}>
          Material:{' '}
          {item.material ||
            'Not specified'}
        </Text>


        {/* ORIGIN */}

        <Text style={styles.origin}>
          Origin:{' '}
          {item.origin ||
            'Not specified'}
        </Text>


        {/* PRICE */}

        <Text style={styles.price}>
          ₹{item.price ?? 0}
        </Text>


        {/* STATUS */}

        <View
          style={[
            styles.statusBadge,

            item.status === 'PUBLISHED'
              ? styles.published
              : styles.draft,
          ]}
        >

          <Text
            style={styles.statusText}
          >
            {item.status ||
              'DRAFT'}
          </Text>

        </View>

      </TouchableOpacity>
    );
  };


  // ==========================================
  // SCREEN
  // ==========================================

  return (

    <View style={styles.container}>

      <FlatList

        data={products}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={
          renderProduct
        }

        contentContainerStyle={
          products.length === 0
            ? styles.emptyList
            : styles.list
        }

        refreshControl={

          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              handleRefresh
            }
          />

        }

        showsVerticalScrollIndicator={
          false
        }

        ListEmptyComponent={

          <EmptyState
            message={
              'You have not created any products yet.'
            }
          />

        }

      />

    </View>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  list: {
    padding: spacing.lg,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },


  card: {
    backgroundColor:
      colors.white,

    borderRadius: 16,

    padding: spacing.lg,

    marginBottom:
      spacing.md,

    borderWidth: 1,

    borderColor:
      colors.border,
  },


  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#F2F2F2',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  noImageIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  noImageText: {
    fontSize: 15,
    color:
      colors.textSecondary,
  },


  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  category: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 8,
  },

  material: {
    fontSize: 14,
    color:
      colors.textSecondary,
    marginBottom: 5,
  },

  origin: {
    fontSize: 14,
    color:
      colors.textSecondary,
    marginBottom: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  published: {
    backgroundColor: '#E8F5E9',
  },

  draft: {
    backgroundColor: '#EEEEEE',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

});