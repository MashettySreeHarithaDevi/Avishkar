import apiClient from './client';

export const predictPrice = async (pricingData) => {

  const response = await apiClient.post(
    '/pricing/predict',
    pricingData
  );

  return response.data;
};