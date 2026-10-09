import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;

console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token =
      await AsyncStorage.getItem('token');

    console.log(
      'REQUEST:',
      config.method?.toUpperCase(),
      config.url
    );

    console.log(
      'TOKEN EXISTS:',
      !!token
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      'RESPONSE:',
      response.status,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.log(
      'API ERROR:',
      error?.response?.status,
      error?.response?.data
    );

    console.log(
      'API ERROR MESSAGE:',
      error?.message
    );

    return Promise.reject(error);
  }
);

export default apiClient;