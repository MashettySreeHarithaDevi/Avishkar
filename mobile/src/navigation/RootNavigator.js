import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import ArtisanNavigator from './ArtisanNavigator';

import BuyerDashboardScreen
  from '../screens/buyer/BuyerDashboardScreen';

import CreateArtisanProfileScreen
  from '../screens/artisan/CreateArtisanProfileScreen';

import LoadingScreen
  from '../components/LoadingScreen';

import useAuth from '../hooks/useAuth';

import MarketplaceScreen from '../screens/buyer/MarketplaceScreen';
import MarketplaceProductDetailsScreen from '../screens/buyer/MarketplaceProductDetailsScreen';
import MyRequestsScreen from '../screens/buyer/MyRequestsScreen';


const Stack =
  createNativeStackNavigator();


export default function RootNavigator() {

  const {
    user,
    artisanProfile,
    loading,
  } = useAuth();


  console.log(
    'ROOT:',
    {
      loading,
      userRole: user?.role,
      artisanProfileExists:
        !!artisanProfile,
    }
  );


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (
      <LoadingScreen
        message="Checking account..."
      />
    );
  }


  // ============================================
  // LOGIN
  // ============================================

  if (!user) {

    console.log(
      'ROOT: NO USER → LOGIN'
    );

    return <AuthNavigator />;
  }


  // ============================================
  // ARTISAN
  // ============================================

  if (user.role === 'ARTISAN') {

    // ------------------------------------------
    // EXISTING ARTISAN
    // ------------------------------------------

    if (artisanProfile) {

      console.log(
        'ROOT: EXISTING ARTISAN → DASHBOARD'
      );

      return (

        <Stack.Navigator>

          <Stack.Group
            navigationKey="existing-artisan"
          >

            <Stack.Screen
              name="ArtisanApp"
              component={
                ArtisanNavigator
              }
              options={{
                headerShown: false,
              }}
            />

          </Stack.Group>

        </Stack.Navigator>
      );
    }


    // ------------------------------------------
    // NEW ARTISAN
    // ------------------------------------------

    console.log(
      'ROOT: NEW ARTISAN → CREATE PROFILE'
    );

    return (

      <Stack.Navigator>

        <Stack.Group
          navigationKey="new-artisan"
        >

          <Stack.Screen
            name="CreateArtisanProfile"
            component={
              CreateArtisanProfileScreen
            }
            options={{
              title:
                'Create Artisan Profile',

              headerBackVisible: false,
            }}
          />

        </Stack.Group>

      </Stack.Navigator>
    );
  }


  // ============================================
  // BUYER
  // ============================================

  return (

    <Stack.Navigator>

  <Stack.Group navigationKey="buyer">

    <Stack.Screen
      name="BuyerDashboard"
      component={BuyerDashboardScreen}
      options={{
        title: 'Buyer Dashboard',
      }}
    />

    <Stack.Screen
      name="Marketplace"
      component={MarketplaceScreen}
      options={{
        title: 'Marketplace',
      }}
    />

    <Stack.Screen
      name="MarketplaceProductDetails"
      component={MarketplaceProductDetailsScreen}
      options={{
        title: 'Product Details',
      }}
    />

    <Stack.Screen
      name="MyRequests"
      component={MyRequestsScreen}
      options={{
        title: 'My Requests',
      }}
    />

  </Stack.Group>

</Stack.Navigator>
  );
}