import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import {
  getProduct,
  publishProduct,
  unpublishProduct,
} from '../../api/productApi';

import {
  getProductImages,
  getFullImageUrl,
} from '../../api/imageApi';


export default function ProductDetailsScreen({
  route,
  navigation,
}) {

  const { productId } =
    route.params;


  const [product, setProduct] =
    useState(null);

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);


  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  const loadProductDetails =
    async () => {

      try {

        setLoading(true);


        console.log(
          'LOADING PRODUCT:',
          productId
        );


        // PRODUCT

        const productResponse =
          await getProduct(
            productId
          );


        console.log(
          'PRODUCT RESPONSE:',
          productResponse
        );


        setProduct(
          productResponse
        );


        // IMAGES

        const imageResponse =
          await getProductImages(
            productId
          );


        console.log(
          'PRODUCT IMAGE RESPONSE:',
          imageResponse
        );


        const imageList =
          Array.isArray(
            imageResponse
          )
            ? imageResponse
            : [];


        setImages(
          imageList
        );

      } catch (error) {

        console.log(
          'PRODUCT DETAILS ERROR:',
          error?.response?.data,
          error?.message
        );


        Alert.alert(
          'Error',
          'Unable to load product details.'
        );

      } finally {

        setLoading(false);
      }
    };


  // ==========================================
  // LOAD WHEN SCREEN OPENS
  // ==========================================

  useFocusEffect(
    useCallback(() => {

      loadProductDetails();

    }, [productId])
  );


  // ==========================================
  // PUBLISH / UNPUBLISH
  // ==========================================

  const handlePublishToggle =
    async () => {

      try {

        setActionLoading(
          true
        );


        if (
          product.status ===
          'PUBLISHED'
        ) {

          await unpublishProduct(
            product.id
          );

        } else {

          await publishProduct(
            product.id
          );
        }


        await loadProductDetails();

      } catch (error) {

        console.log(
          'PUBLISH ERROR:',
          error?.response?.data
        );


        Alert.alert(
          'Error',
          error?.response?.data?.detail ||
          'Unable to update product status.'
        );

      } finally {

        setActionLoading(
          false
        );
      }
    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
          color={
            colors.primary
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading product...
        </Text>

      </View>
    );
  }


  // ==========================================
  // NO PRODUCT
  // ==========================================

  if (!product) {

    return (

      <View
        style={
          styles.emptyContainer
        }
      >

        <Text
          style={
            styles.emptyText
          }
        >
          Product not found.
        </Text>

      </View>
    );
  }


  // ==========================================
  // IMAGE
  // ==========================================

  const imageUrl =
    images.length > 0
      ? getFullImageUrl(
          images[0].image_url
        )
      : null;


  // ==========================================
  // SCREEN
  // ==========================================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* ====================================== */}
      {/* PRODUCT IMAGE */}
      {/* ====================================== */}

      <View
        style={
          styles.imageContainer
        }
      >

        {imageUrl ? (

          <Image
            source={{
              uri: imageUrl,
            }}
            style={
              styles.productImage
            }
            resizeMode="cover"
            onLoad={() =>
              console.log(
                'PRODUCT IMAGE LOADED:',
                imageUrl
              )
            }
            onError={(error) =>
              console.log(
                'PRODUCT IMAGE ERROR:',
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
              style={
                styles.noImageIcon
              }
            >
              🖼️
            </Text>

            <Text
              style={
                styles.noImageText
              }
            >
              No product image
            </Text>

          </View>

        )}

      </View>


      {/* ====================================== */}
      {/* NAME */}
      {/* ====================================== */}

      <Text
        style={styles.name}
      >
        {product.name ||
          'Unnamed Product'}
      </Text>


      {/* ====================================== */}
      {/* PRICE */}
      {/* ====================================== */}

      <Text
        style={styles.price}
      >
        ₹{product.price ?? 0}
      </Text>


      {/* ====================================== */}
      {/* INFORMATION */}
      {/* ====================================== */}

      <View
        style={styles.card}
      >

        <Text
          style={
            styles.sectionTitle
          }
        >
          Product Information
        </Text>


        <Detail
          label="Category"
          value={
            product.category
          }
        />

        <Detail
          label="Material"
          value={
            product.material
          }
        />

        <Detail
          label="Craft Type"
          value={
            product.craft_type
          }
        />

        <Detail
          label="Origin"
          value={
            product.origin
          }
        />

        <Detail
          label="Color"
          value={
            product.color
          }
        />

        <Detail
          label="Production Time"
          value={
            product.production_time
          }
        />

      </View>


      {/* ====================================== */}
      {/* STATUS */}
      {/* ====================================== */}

      <View
        style={styles.card}
      >

        <Text
          style={
            styles.sectionTitle
          }
        >
          Status
        </Text>


        <Text
          style={
            styles.statusValue
          }
        >
          {product.status ||
            'DRAFT'}
        </Text>


        <TouchableOpacity
          style={
            styles.publishButton
          }
          onPress={
            handlePublishToggle
          }
          disabled={
            actionLoading
          }
        >

          {actionLoading ? (

            <ActivityIndicator
              color={
                colors.white
              }
            />

          ) : (

            <Text
              style={
                styles.publishText
              }
            >
              {product.status ===
              'PUBLISHED'
                ? 'Unpublish Product'
                : 'Publish Product'}
            </Text>

          )}

        </TouchableOpacity>

      </View>


      {/* ====================================== */}
      {/* DESCRIPTION */}
      {/* ====================================== */}

      <View
        style={styles.card}
      >

        <Text
          style={
            styles.sectionTitle
          }
        >
          Description
        </Text>

        <Text
          style={
            styles.description
          }
        >
          {product.description_en ||
            'No description available.'}
        </Text>

      </View>


      {/* ====================================== */}
      {/* KEYWORDS */}
      {/* ====================================== */}

      <View
        style={styles.card}
      >

        <Text
          style={
            styles.sectionTitle
          }
        >
          Keywords
        </Text>


        {Array.isArray(
          product.keywords
        ) &&
        product.keywords.length > 0 ? (

          <View
            style={
              styles.keywordContainer
            }
          >

            {product.keywords.map(
              (
                keyword,
                index
              ) => (

                <View
                  key={
                    `${keyword}-${index}`
                  }
                  style={
                    styles.keyword
                  }
                >

                  <Text
                    style={
                      styles.keywordText
                    }
                  >
                    {keyword}
                  </Text>

                </View>

              )
            )}

          </View>

        ) : (

          <Text
            style={
              styles.noData
            }
          >
            No keywords available.
          </Text>

        )}

      </View>


      {/* ====================================== */}
      {/* EDIT */}
      {/* ====================================== */}

      <TouchableOpacity
        style={
          styles.editButton
        }
        onPress={() =>
          navigation.navigate(
            'EditProduct',
            {
              productId:
                product.id,
            }
          )
        }
      >

        <Text
          style={
            styles.editText
          }
        >
          Edit Product
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}


// ==============================================
// DETAIL COMPONENT
// ==============================================

const Detail = ({
  label,
  value,
}) => {

  return (

    <View
      style={styles.detailRow}
    >

      <Text
        style={
          styles.detailLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.detailValue
        }
      >
        {value ||
          'Not specified'}
      </Text>

    </View>
  );
};


// ==============================================
// STYLES
// ==============================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingBottom: 40,
  },


  // IMAGE

  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F2F2F2',
    marginBottom: spacing.lg,
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
    fontSize: 50,
    marginBottom: 10,
  },

  noImageText: {
    fontSize: 16,
    color:
      colors.textSecondary,
  },


  // NAME

  name: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: 8,
  },


  // PRICE

  price: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },


  // CARD

  card: {
    backgroundColor:
      colors.white,
    marginHorizontal:
      spacing.lg,
    marginBottom:
      spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor:
      colors.border,
  },


  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },


  // DETAIL

  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor:
      '#EEEEEE',
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '700',
    color:
      colors.textSecondary,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 16,
    color: colors.text,
  },


  // STATUS

  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 15,
  },

  publishButton: {
    backgroundColor:
      colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  publishText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },


  // DESCRIPTION

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
  },


  // KEYWORDS

  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  keyword: {
    backgroundColor: '#F1F1F1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  keywordText: {
    fontSize: 13,
    color: colors.text,
  },

  noData: {
    color:
      colors.textSecondary,
  },


  // EDIT

  editButton: {
    marginHorizontal:
      spacing.lg,
    backgroundColor:
      colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  editText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },


  // LOADING

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      colors.background,
  },

  loadingText: {
    marginTop: 10,
    color:
      colors.textSecondary,
  },


  // EMPTY

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 18,
    color: colors.text,
  },

});