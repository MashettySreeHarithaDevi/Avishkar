import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';
import AppButton from '../../components/AppButton';

import {
  getIncomingRequests,
  updateRequestStatus,
} from '../../api/buyerRequestApi';

export default function B2BRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    try {
      console.log('Loading incoming B2B requests...');

      setLoading(true);

      const data = await getIncomingRequests();

      console.log('B2B REQUESTS RESPONSE:', data);

      const requestList = Array.isArray(data)
        ? data
        : data?.requests || [];

      setRequests(requestList);
    } catch (error) {
      console.log(
        'GET B2B REQUESTS ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to load B2B requests.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);

      Alert.alert(
        'Success',
        `Request ${status.toLowerCase()} successfully.`
      );

      loadRequests();
    } catch (error) {
      console.log(
        'UPDATE REQUEST ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to update request.'
      );
    }
  };

  const confirmStatusUpdate = (requestId, status) => {
    Alert.alert(
      `${status} Request`,
      `Are you sure you want to ${status.toLowerCase()} this request?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: status,
          onPress: () =>
            handleStatusUpdate(requestId, status),
        },
      ]
    );
  };

  const renderRequest = ({ item }) => {
    return (
      <View style={styles.card}>

        <Text style={styles.productName}>
          {item.product?.name ||
            item.product_name ||
            `Product #${item.product_id}`}
        </Text>

        <Text style={styles.info}>
          Quantity: {item.quantity}
        </Text>

        {item.message ? (
          <Text style={styles.message}>
            Message: {item.message}
          </Text>
        ) : null}

        <Text style={styles.status}>
          Status: {item.status}
        </Text>

        {item.status === 'PENDING' && (
          <View style={styles.buttonRow}>

            <View style={styles.buttonContainer}>
              <AppButton
                title="Accept"
                onPress={() =>
                  confirmStatusUpdate(
                    item.id,
                    'ACCEPTED'
                  )
                }
              />
            </View>

            <View style={styles.buttonContainer}>
              <AppButton
                title="Reject"
                secondary
                onPress={() =>
                  confirmStatusUpdate(
                    item.id,
                    'REJECTED'
                  )
                }
              />
            </View>

          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading requests..." />;
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={requests}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={renderRequest}
        contentContainerStyle={
          requests.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No B2B Requests"
            message="You don't have any bulk-order requests yet."
          />
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    padding: spacing.md,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },

  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
  },

  productName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.text,
  },

  info: {
    fontSize: 15,
    marginBottom: spacing.xs,
    color: colors.text,
  },

  message: {
    fontSize: 14,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },

  status: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.text,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  buttonContainer: {
    flex: 1,
  },
});