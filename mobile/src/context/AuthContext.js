import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { loginUser } from '../api/authApi';
import { getMyProfile } from '../api/userApi';
import { getMyArtisanProfile } from '../api/artisanApi';

import {
  saveToken,
  getToken,
  removeToken,
} from '../utils/storage';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [artisanProfile, setArtisanProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // ============================================
  // CHECK ARTISAN PROFILE
  // ============================================

  const checkArtisanProfile = async () => {

    try {

      const profile =
        await getMyArtisanProfile();

      console.log(
        'ARTISAN PROFILE FOUND:',
        profile
      );

      setArtisanProfile(profile);

      return profile;

    } catch (error) {

      console.log(
        'ARTISAN PROFILE CHECK:',
        error.response?.status,
        error.response?.data
      );

      // 404 means artisan profile does not exist
      if (error.response?.status === 404) {

        setArtisanProfile(null);

        return null;
      }

      throw error;
    }
  };


  // ============================================
  // LOGIN
  // ============================================

  const login = async (email, password) => {

    console.log(
      'AUTH CONTEXT: LOGIN START'
    );

    try {

      // 1. Login
      const data =
        await loginUser(email, password);


      // 2. Save token
      await saveToken(
        data.access_token
      );


      // 3. Get user information
      const profile =
        await getMyProfile();


      console.log(
        'AUTH CONTEXT: USER PROFILE:',
        profile
      );


      // IMPORTANT:
      // Keep loading true while checking
      // artisan profile.
      setLoading(true);


      // 4. Check artisan profile BEFORE
      // exposing user to RootNavigator

      if (profile.role === 'ARTISAN') {

        const artisan =
          await checkArtisanProfile();

        console.log(
          'AUTH CONTEXT: ARTISAN PROFILE RESULT:',
          artisan
        );

        setArtisanProfile(artisan);

      } else {

        setArtisanProfile(null);
      }


      // 5. Only NOW set user
      setUser(profile);


      console.log(
        'AUTH CONTEXT: LOGIN COMPLETE'
      );


      return profile;

    } catch (error) {

      console.log(
        'AUTH CONTEXT: LOGIN ERROR:',
        error.response?.data ||
        error.message
      );


      await removeToken();

      setUser(null);

      setArtisanProfile(null);


      throw error;

    } finally {

      setLoading(false);
    }
  };


  // ============================================
  // REFRESH ARTISAN PROFILE
  // ============================================

  const refreshArtisanProfile = async () => {

    return await checkArtisanProfile();
  };


  // ============================================
  // LOGOUT
  // ============================================

  const logout = async () => {

    await removeToken();

    setUser(null);

    setArtisanProfile(null);
  };


  // ============================================
  // RESTORE LOGIN SESSION
  // ============================================

  useEffect(() => {

    const checkLogin = async () => {

      try {

        const token =
          await getToken();


        if (!token) {

          setLoading(false);

          return;
        }


        // Get saved user
        const profile =
          await getMyProfile();


        console.log(
          'RESTORED USER:',
          profile
        );


        // IMPORTANT:
        // Check artisan profile BEFORE
        // setting user.

        if (profile.role === 'ARTISAN') {

          await checkArtisanProfile();

        } else {

          setArtisanProfile(null);
        }


        // Now expose user
        setUser(profile);

      } catch (error) {

        console.log(
          'CHECK LOGIN ERROR:',
          error.response?.data ||
          error.message
        );


        await removeToken();

        setUser(null);

        setArtisanProfile(null);

      } finally {

        setLoading(false);
      }

    };


    checkLogin();

  }, []);


  return (

    <AuthContext.Provider
      value={{
        user,
        artisanProfile,
        loading,

        login,
        logout,

        refreshArtisanProfile,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};


export const useAuth = () =>
  useContext(AuthContext);