import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  getMarketplaceProducts,
  searchMarketplaceProducts,
  filterMarketplaceProducts,
} from '../../api/marketplaceApi';

import {
  getPublicProductImages,
  getFullImageUrl,
} from '../../api/imageApi';

import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';


export default function MarketplaceScreen({
  navigation,
}) {

  const [products, setProducts] =
    useState([]);

  const [searchText, setSearchText] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [material, setMaterial] =
    useState('');

  const [craftType, setCraftType] =
    useState('');

  const [origin, setOrigin] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // --------------------------------------------------
  // ADD IMAGES TO PRODUCTS
  // --------------------------------------------------

  const attachImagesToProducts = async (
    productList
  ) => {

    const productsWithImages =
      await Promise.all(

        productList.map(
          async (product) => {

            try {

              const images =
                await getPublicProductImages(
                  product.id
                );

              const imageList =
                Array.isArray(images)
                  ? images
                  : images?.images || [];

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

            } catch (error) {

              console.log(
                `IMAGE ERROR FOR PRODUCT ${product.id}:`,
                error?.response?.data ||
                error?.message
              );

              return {
                ...product,
                image_url: null,
              };

            }

          }
        )

      );

    return productsWithImages;
  };


  // --------------------------------------------------
  // LOAD ALL PRODUCTS
  // --------------------------------------------------

  const loadProducts = async () => {

    try {

      setLoading(true);

      const data =
        await getMarketplaceProducts();

      const productList =
        Array.isArray(data)
          ? data
          : data?.products || [];

      const productsWithImages =
        await attachImagesToProducts(
          productList
        );

      console.log(
        'MARKETPLACE PRODUCTS WITH IMAGES:',
        productsWithImages
      );

      setProducts(
        productsWithImages
      );

    } catch (error) {

      console.log(
        'MARKETPLACE ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to load marketplace products.'
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const handleSearch = async () => {

    const query =
      searchText.trim();

    if (!query) {

      await applyFilters();

      return;

    }

    try {

      setLoading(true);

      const data =
        await searchMarketplaceProducts(
          query
        );

      const productList =
        Array.isArray(data)
          ? data
          : data?.products || [];

      const productsWithImages =
        await attachImagesToProducts(
          productList
        );

      setProducts(
        productsWithImages
      );

    } catch (error) {

      console.log(
        'SEARCH ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to search products.'
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // APPLY FILTERS
  // --------------------------------------------------

  const applyFilters = async () => {

    const filters = {};


    if (searchText.trim()) {

      filters.q =
        searchText.trim();

    }


    if (category.trim()) {

      filters.category =
        category.trim();

    }


    if (material.trim()) {

      filters.material =
        material.trim();

    }


    if (craftType.trim()) {

      filters.craft_type =
        craftType.trim();

    }


    if (origin.trim()) {

      filters.origin =
        origin.trim();

    }


    try {

      setLoading(true);


      if (
        Object.keys(filters).length === 0
      ) {

        await loadProducts();

        return;

      }


      const data =
        await filterMarketplaceProducts(
          filters
        );


      const productList =
        Array.isArray(data)
          ? data
          : data?.products || [];


      const productsWithImages =
        await attachImagesToProducts(
          productList
        );


      setProducts(
        productsWithImages
      );


    } catch (error) {

      console.log(
        'FILTER ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to apply filters.'
      );

    } finally {

      setLoading(false);

    }

  };


  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = async () => {

    setSearchText('');
    setCategory('');
    setMaterial('');
    setCraftType('');
    setOrigin('');

    await loadProducts();

  };


  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadProducts();

  };


  // --------------------------------------------------
  // LOAD SCREEN
  // --------------------------------------------------

  useFocusEffect(

    useCallback(() => {

      loadProducts();

    }, [])

  );


  // --------------------------------------------------
  // PRODUCT CARD
  // --------------------------------------------------

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
            'MarketplaceProductDetails',
            {
              productId: item.id,
            }
          )
        }

      >

        {imageUrl ? (

          <Image

            source={{
              uri: imageUrl,
            }}

            style={styles.productImage}

            resizeMode="cover"

          />

        ) : (

          <View
            style={styles.imagePlaceholder}
          >

            <Text
              style={styles.placeholderIcon}
            >
              🖼️
            </Text>

            <Text
              style={styles.placeholderText}
            >
              No product image
            </Text>

          </View>

        )}


        <Text
          style={styles.productName}
        >

          {item.name ||
            'Unnamed Product'}

        </Text>


        {item.category ? (

          <Text style={styles.info}>

            Category: {item.category}

          </Text>

        ) : null}


        {item.material ? (

          <Text style={styles.info}>

            Material: {item.material}

          </Text>

        ) : null}


        {item.craft_type ? (

          <Text style={styles.info}>

            Craft: {item.craft_type}

          </Text>

        ) : null}


        {item.origin ? (

          <Text style={styles.info}>

            Origin: {item.origin}

          </Text>

        ) : null}


        {item.price !== null &&
        item.price !== undefined ? (

          <Text style={styles.price}>

            ₹{item.price}

          </Text>

        ) : null}

      </TouchableOpacity>

    );

  };


  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {

    return (
      <LoadingScreen
        message="Loading marketplace..."
      />
    );

  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <View style={styles.container}>


      {/* SEARCH */}

      <View
        style={styles.searchContainer}
      >

        <TextInput

          style={styles.searchInput}

          placeholder="Search products..."

          value={searchText}

          onChangeText={setSearchText}

          onSubmitEditing={
            handleSearch
          }

          returnKeyType="search"

        />


        <TouchableOpacity

          style={styles.searchButton}

          onPress={handleSearch}

        >

          <Text style={styles.buttonText}>
            Search
          </Text>

        </TouchableOpacity>

      </View>


      {/* FILTERS */}

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />


      <TextInput
        style={styles.input}
        placeholder="Material"
        value={material}
        onChangeText={setMaterial}
      />


      <TextInput
        style={styles.input}
        placeholder="Craft Type"
        value={craftType}
        onChangeText={setCraftType}
      />


      <TextInput
        style={styles.input}
        placeholder="Origin"
        value={origin}
        onChangeText={setOrigin}
      />


      {/* FILTER BUTTONS */}

      <View
        style={styles.buttonRow}
      >

        <TouchableOpacity

          style={styles.filterButton}

          onPress={applyFilters}

        >

          <Text
            style={styles.buttonText}
          >
            Apply Filters
          </Text>

        </TouchableOpacity>


        <TouchableOpacity

          style={styles.clearButton}

          onPress={clearFilters}

        >

          <Text
            style={styles.clearButtonText}
          >
            Clear
          </Text>

        </TouchableOpacity>

      </View>


      {/* PRODUCTS */}

      <FlatList

        data={products}

        keyExtractor={(item) =>
          String(item.id)
        }

        renderItem={renderProduct}

        refreshControl={

          <RefreshControl

            refreshing={refreshing}

            onRefresh={handleRefresh}

          />

        }

        contentContainerStyle={

          products.length === 0

            ? styles.emptyContainer

            : styles.list

        }

        ListEmptyComponent={

          <EmptyState

            title="No Products Found"

            message="Try a different search or filter."

          />

        }

      />

    </View>

  );

}


// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 16,
    },


    searchContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },


    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 45,
    },


    searchButton: {
      marginLeft: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: 8,
      backgroundColor: '#333',
    },


    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 42,
      marginBottom: 8,
    },


    buttonRow: {
      flexDirection: 'row',
      marginBottom: 12,
    },


    filterButton: {
      flex: 1,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: '#333',
      marginRight: 6,
    },


    clearButton: {
      flex: 1,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#333',
      marginLeft: 6,
    },


    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },


    clearButtonText: {
      color: '#333',
      fontWeight: '600',
    },


    list: {
      paddingBottom: 20,
    },


    emptyContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },


    card: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
      backgroundColor: '#fff',
    },


    productImage: {
      width: '100%',
      height: 220,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: '#f2f2f2',
    },


    imagePlaceholder: {
      width: '100%',
      height: 220,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: '#f2f2f2',
      justifyContent: 'center',
      alignItems: 'center',
    },


    placeholderIcon: {
      fontSize: 40,
      marginBottom: 8,
    },


    placeholderText: {
      color: '#777',
      fontSize: 14,
    },


    productName: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
    },


    info: {
      marginBottom: 4,
    },


    price: {
      fontSize: 16,
      fontWeight: '700',
      marginTop: 8,
    },

  });