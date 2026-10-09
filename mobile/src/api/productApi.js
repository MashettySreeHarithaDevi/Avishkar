import apiClient from './client';

export const createProduct = async (
  productData,
  imageUrl = null
) => {
  const response = await apiClient.post(
    '/products',
    productData,
    {
      params: imageUrl
        ? { image_url: imageUrl }
        : {},
    }
  );

  return response.data;
};

export const getProducts = async () => {
  const response = await apiClient.get('/products');
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await apiClient.get(
    `/products/${productId}`
  );
  return response.data;
};

export const updateProduct = async (
  productId,
  productData
) => {
  const response = await apiClient.put(
    `/products/${productId}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await apiClient.delete(
    `/products/${productId}`
  );

  return response.data;
};

export const publishProduct = async (productId) => {
  const response = await apiClient.put(
    `/products/${productId}/publish`
  );

  return response.data;
};

export const unpublishProduct = async (productId) => {
  const response = await apiClient.put(
    `/products/${productId}/unpublish`
  );

  return response.data;
};

