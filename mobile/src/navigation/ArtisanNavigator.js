import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ArtisanDashboardScreen from '../screens/artisan/ArtisanDashboardScreen';
import AddProductScreen from '../screens/artisan/AddProductScreen';
import MyProductsScreen from '../screens/artisan/MyProductsScreen';
import ProductDetailsScreen from '../screens/artisan/ProductDetailsScreen';
import EditProductScreen from '../screens/artisan/EditProductScreen';
import CreateArtisanProfileScreen from '../screens/artisan/CreateArtisanProfileScreen';
import B2BRequestsScreen from '../screens/artisan/B2BRequestsScreen';
import AIProductCreationScreen from '../screens/artisan/AIProductCreationScreen';
import AIVoiceRecordingScreen from '../screens/artisan/AIVoiceRecordingScreen';
import AIProcessingScreen from '../screens/artisan/AIProcessingScreen';
import AIProductReviewScreen from '../screens/artisan/AIProductReviewScreen';
import AIProductPricingScreen from '../screens/artisan/AIProductPricingScreen';


const Stack = createNativeStackNavigator();

export default function ArtisanNavigator({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || 'ArtisanDashboard'}
    >

      <Stack.Screen
        name="CreateArtisanProfile"
        component={CreateArtisanProfileScreen}
        options={{ title: 'Artisan Profile' }}
      />

      <Stack.Screen
        name="ArtisanDashboard"
        component={ArtisanDashboardScreen}
        options={{ title: 'Dashboard' }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{ title: 'Add Product' }}
      />

      <Stack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{ title: 'My Products' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />

      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ title: 'Edit Product' }}
      />

      <Stack.Screen
        name="B2BRequests"
        component={B2BRequestsScreen}
        options={{ title: 'B2B Requests' }}
      />

      <Stack.Screen
        name="AIProductCreation"
        component={AIProductCreationScreen}
        options={{
          title: 'Create Product',
        }}
      />

      <Stack.Screen
        name="AIVoiceRecording"
        component={AIVoiceRecordingScreen}
      />

      <Stack.Screen
        name="AIProcessing"
        component={AIProcessingScreen}
        options={{
          title: 'AI Processing',
        }}
      />

      <Stack.Screen
        name="AIProductReview"
        component={AIProductReviewScreen}
        options={{
          title: 'Review Product',
        }}
      />

      <Stack.Screen
        name="AIProductPricing"
        component={AIProductPricingScreen}
      />
      
    </Stack.Navigator>
  );
}