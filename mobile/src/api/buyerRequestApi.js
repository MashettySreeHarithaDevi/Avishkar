import apiClient from './client';

export const getIncomingRequests = async () => {
  const response = await apiClient.get(
    '/buyer-requests/incoming/all'
  );

  return response.data;
};

export const updateRequestStatus = async (
  requestId,
  status
) => {
  const response = await apiClient.put(
    `/buyer-requests/${requestId}/status`,
    {
      status,
    }
  );

  return response.data;
};

export const createBuyerRequest = async (requestData) => {
  const response = await apiClient.post(
    '/buyer-requests',
    requestData
  );

  return response.data;
};

export const getMyBuyerRequests = async () => {
  const response = await apiClient.get(
    '/buyer-requests/my'
  );

  return response.data;
};

export const getBuyerRequest = async (requestId) => {
  const response = await apiClient.get(
    `/buyer-requests/${requestId}`
  );

  return response.data;
};