import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const registerUser = async (userData) => {
  console.log('authApi: registerUser called');
  console.log('authApi: apiClient =', apiClient);
  console.log('authApi: apiClient.post =', apiClient?.post);

  const response = await apiClient.post(
    '/auth/register',
    userData
  );

  console.log(
    'authApi: response received'
  );

  return response.data;
};


export const loginUser = async (
  email,
  password
) => {
  console.log(
    'authApi: loginUser called'
  );

  const response = await apiClient.post(
    '/auth/login',
    {
      email,
      password,
    }
  );

  console.log(
    'authApi: login response:',
    response.data
  );

  // Get JWT token from backend response
  const token =
    response.data?.access_token ||
    response.data?.token;

  if (!token) {
    console.log(
      'authApi: NO TOKEN FOUND IN LOGIN RESPONSE'
    );

    throw new Error(
      'Login successful but no authentication token was returned.'
    );
  }

  // Save token
  await AsyncStorage.setItem(
    'token',
    token
  );

  console.log(
    'authApi: TOKEN SAVED'
  );

  return response.data;
};