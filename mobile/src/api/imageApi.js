import apiClient from './client';


// ==================================================
// API BASE URL
// ==================================================

const API_URL =
  process.env.EXPO_PUBLIC_API_URL;


// ==================================================
// NORMALIZE IMAGE URL
// ==================================================

export const getFullImageUrl = (imageUrl) => {

  if (!imageUrl) {
    return null;
  }

  // If backend already returned a complete URL
  if (
    typeof imageUrl === 'string' &&
    imageUrl.startsWith('http')
  ) {
    return imageUrl;
  }

  // Handle accidental object response
  if (typeof imageUrl === 'object') {

    imageUrl =
      imageUrl.image_url ||
      imageUrl.url ||
      imageUrl.path ||
      null;

    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
  }

  // Make sure there is a leading /
  if (!imageUrl.startsWith('/')) {
    imageUrl = `/${imageUrl}`;
  }

  const finalUrl = `${API_URL}${imageUrl}`;

  console.log(
    'FULL IMAGE URL:',
    finalUrl
  );

  return finalUrl;
};


// ==================================================
// ATTACH EXISTING AI IMAGE TO PRODUCT
// ==================================================

export const attachExistingProductImage = async (
  productId,
  imageUrl
) => {

  console.log(
    'ATTACHING AI IMAGE TO PRODUCT:',
    productId,
    imageUrl
  );

  const response = await apiClient.post(
    `/products/${productId}/images/from-existing`,
    null,
    {
      params: {
        image_url: imageUrl,
      },
    }
  );

  console.log(
    'IMAGE ATTACHED:',
    response.data
  );

  return response.data;
};


// ==================================================
// GET ARTISAN PRODUCT IMAGES
// ==================================================

export const getProductImages = async (
  productId
) => {

  console.log(
    'GETTING PRODUCT IMAGES:',
    productId
  );

  const response = await apiClient.get(
    `/products/${productId}/images`
  );

  console.log(
    'PRODUCT IMAGES:',
    response.data
  );

  return response.data;
};


// ==================================================
// GET PUBLIC PRODUCT IMAGES
// ==================================================

export const getPublicProductImages = async (
  productId
) => {

  console.log(
    'GETTING PUBLIC PRODUCT IMAGES:',
    productId
  );

  const response = await apiClient.get(
    `/products/${productId}/images/public`
  );

  console.log(
    'PUBLIC PRODUCT IMAGES:',
    response.data
  );

  return response.data;
};


// ==================================================
// UPLOAD PRODUCT IMAGE
// ==================================================

export const uploadProductImage = async (
  productId,
  image
) => {

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri: image.uri,
      name: `product-${Date.now()}.jpg`,
      type: 'image/jpeg',
    }
  );

  const response = await apiClient.post(
    `/products/${productId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


// ==================================================
// DELETE PRODUCT IMAGE
// ==================================================

export const deleteProductImage = async (
  productId,
  imageId
) => {

  const response = await apiClient.delete(
    `/products/${productId}/images/${imageId}`
  );

  return response.data;
};