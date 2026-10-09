import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import LoadingScreen from '../../components/LoadingScreen';
import AppButton from '../../components/AppButton';

import {
  getMarketplaceProduct,
} from '../../api/marketplaceApi';

import {
  createBuyerRequest,
} from '../../api/buyerRequestApi';

import {
  getPublicProductImages,
  getFullImageUrl,
} from '../../api/imageApi';


export default function MarketplaceProductDetailsScreen({
  route,
  navigation,
}) {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);

  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);


  useEffect(() => {
    loadProduct();
  }, []);


  const loadProduct = async () => {
    try {
      setLoading(true);

      // Get product details
      const data =
        await getMarketplaceProduct(productId);

      console.log(
        'MARKETPLACE PRODUCT:',
        data
      );

      setProduct(data);


      // Get product image
      try {
        const images =
          await getPublicProductImages(productId);

        console.log(
          'PRODUCT IMAGES:',
          images
        );

        if (
          Array.isArray(images) &&
          images.length > 0 &&
          images[0]?.image_url
        ) {
          const fullUrl =
            getFullImageUrl(
              images[0].image_url
            );

          console.log(
            'FULL PRODUCT IMAGE URL:',
            fullUrl
          );

          setProductImage(fullUrl);
        }
      } catch (imageError) {
        console.log(
          'PRODUCT IMAGE ERROR:',
          imageError?.response?.data ||
            imageError?.message
        );
      }

    } catch (error) {
      console.log(
        'PRODUCT DETAILS ERROR:',
        error?.response?.data,
        error?.message
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


  const handleRequest = async () => {
    const requestedQuantity =
      Number(quantity);

    if (
      !quantity ||
      Number.isNaN(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      Alert.alert(
        'Invalid Quantity',
        'Please enter a valid quantity.'
      );
      return;
    }

    try {
      setSending(true);

      await createBuyerRequest({
        product_id: product.id,
        quantity: requestedQuantity,
        message: message.trim() || null,
      });

      Alert.alert(
        'Request Sent',
        'Your bulk-order request has been sent to the artisan.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate(
                'MyRequests'
              ),
          },
        ]
      );

    } catch (error) {
      console.log(
        'CREATE REQUEST ERROR:',
        error?.response?.status,
        error?.response?.data,
        error?.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.detail ||
          'Unable to send bulk-order request.'
      );

    } finally {
      setSending(false);
    }
  };


  if (loading || !product) {
    return (
      <LoadingScreen
        message="Loading product..."
      />
    );
  }


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>

        {/* PRODUCT IMAGE */}

        {productImage ? (
          <Image
            source={{
              uri: productImage,
            }}
            style={styles.productImage}
            resizeMode="cover"
            onError={(error) => {
              console.log(
                'IMAGE DISPLAY ERROR:',
                error?.nativeEvent
              );
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              No product image
            </Text>
          </View>
        )}


        {/* PRODUCT NAME */}

        <Text style={styles.title}>
          {product.name}
        </Text>


        {/* PRICE */}

        <Text style={styles.price}>
          ₹{product.price}
        </Text>


        {/* CATEGORY */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Category
          </Text>

          <Text style={styles.value}>
            {product.category || 'N/A'}
          </Text>
        </View>


        {/* MATERIAL */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Material
          </Text>

          <Text style={styles.value}>
            {product.material || 'N/A'}
          </Text>
        </View>


        {/* CRAFT TYPE */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Craft Type
          </Text>

          <Text style={styles.value}>
            {product.craft_type || 'N/A'}
          </Text>
        </View>


        {/* ORIGIN */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Origin
          </Text>

          <Text style={styles.value}>
            {product.origin || 'N/A'}
          </Text>
        </View>


        {/* DESCRIPTION */}

        <View style={styles.section}>
          <Text style={styles.label}>
            Description
          </Text>

          <Text style={styles.description}>
            {product.description_en ||
              'No description available.'}
          </Text>
        </View>


        {/* BULK REQUEST */}

        <View style={styles.requestCard}>

          <Text style={styles.requestTitle}>
            Bulk Order Request
          </Text>


          <Text style={styles.label}>
            Quantity
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholderTextColor={
              colors.textSecondary
            }
          />


          <Text style={styles.label}>
            Message
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.messageInput,
            ]}
            placeholder="Optional message"
            multiline
            value={message}
            onChangeText={setMessage}
            placeholderTextColor={
              colors.textSecondary
            }
          />


          <AppButton
            title={
              sending
                ? 'Sending...'
                : 'Send Bulk Request'
            }
            onPress={handleRequest}
          />

        </View>

      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: spacing.xl,
  },

  content: {
    padding: spacing.md,
  },


  productImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
  },


  imagePlaceholder: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },


  placeholderText: {
    color: colors.textSecondary,
    fontSize: 15,
  },


  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },


  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },


  section: {
    marginBottom: spacing.md,
  },


  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },


  value: {
    fontSize: 16,
    color: colors.text,
  },


  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },


  requestCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },


  requestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },


  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
    color: colors.text,
    backgroundColor: colors.background,
  },


  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },

});