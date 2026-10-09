import apiClient from './client';


// --------------------------------------------------
// GET ALL MARKETPLACE PRODUCTS
// --------------------------------------------------

export const getMarketplaceProducts = async () => {
  const response = await apiClient.get(
    '/marketplace/products'
  );

  return response.data;
};


// --------------------------------------------------
// SEARCH PRODUCTS
// --------------------------------------------------

export const searchMarketplaceProducts = async (query) => {
  const response = await apiClient.get(
    '/marketplace/search',
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
};


// --------------------------------------------------
// FILTER PRODUCTS
// --------------------------------------------------

export const filterMarketplaceProducts = async (filters) => {
  const response = await apiClient.get(
    '/marketplace/filter',
    {
      params: filters,
    }
  );

  return response.data;
};


// --------------------------------------------------
// GET ONE PRODUCT
// --------------------------------------------------

export const getMarketplaceProduct = async (productId) => {
  const response = await apiClient.get(
    `/marketplace/products/${productId}`
  );

  return response.data;
};