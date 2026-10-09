import apiClient from './client';


// =====================================================
// 1. IMAGE ENHANCEMENT
// =====================================================

export const enhanceProductImage = async (image) => {

  const formData = new FormData();

  formData.append('image', {
    uri: image.uri,
    name: `product-${Date.now()}.jpg`,
    type: 'image/jpeg',
  });

  console.log(
    'UPLOADING IMAGE TO AI:',
    image.uri
  );

  const response = await apiClient.post(
    '/ai/upload-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log(
    'IMAGE ENHANCEMENT RESPONSE:',
    response.data
  );

  return response.data;
};


// =====================================================
// 2. AUDIO UPLOAD
// =====================================================

export const uploadAudio = async (audioUri) => {

  const formData = new FormData();

  formData.append('audio', {
    uri: audioUri,
    name: `voice-${Date.now()}.m4a`,
    type: 'audio/m4a',
  });

  console.log(
    'UPLOADING AUDIO:',
    audioUri
  );

  const response = await apiClient.post(
    '/ai/upload-audio',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log(
    'AUDIO UPLOAD RESPONSE:',
    response.data
  );

  return response.data;
};


// =====================================================
// 3. TRANSLATE AUDIO
// =====================================================

export const translateAudio = async (filename) => {

  console.log(
    'TRANSLATING AUDIO:',
    filename
  );

  const response = await apiClient.post(
    `/ai/translate-audio?filename=${encodeURIComponent(filename)}`
  );

  console.log(
    'TRANSLATION RESPONSE:',
    response.data
  );

  return response.data;
};


// =====================================================
// 4. GENERATE AI PRODUCT CATALOG
// =====================================================

export const generateCatalog = async (englishText) => {

  console.log(
    'GENERATING CATALOG FROM:',
    englishText
  );

  const response = await apiClient.post(
    `/ai/generate-catalog?english_text=${encodeURIComponent(
      englishText
    )}`
  );

  console.log(
    'CATALOG RESPONSE:',
    response.data
  );

  return response.data;
};