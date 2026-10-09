import React, {
  useCallback,
  useState,
} from 'react';

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

import {
  getMyBuyerRequests,
} from '../../api/buyerRequestApi';

export default function MyRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data =
        await getMyBuyerRequests();

      console.log(
        'MY REQUESTS RESPONSE:',
        data
      );

      const requestList =
        Array.isArray(data)
          ? data
          : data?.requests || [];

      setRequests(requestList);

    } catch (error) {
      console.log(
        'MY REQUESTS ERROR:',
        error.response?.status,
        error.response?.data,
        error.message
      );

      Alert.alert(
        'Error',
        'Unable to load your requests.'
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

  const renderRequest = ({ item }) => {
    return (
      <View style={styles.card}>

        <Text style={styles.title}>
          {item.product?.name ||
            item.product_name ||
            `Product #${item.product_id}`}
        </Text>

        <Text style={styles.info}>
          Quantity: {item.quantity}
        </Text>

        {item.message ? (
          <Text style={styles.info}>
            Message: {item.message}
          </Text>
        ) : null}

        <Text style={styles.status}>
          Status: {item.status}
        </Text>

      </View>
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading your requests..."
      />
    );
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
            title="No Requests"
            message="You haven't sent any bulk-order requests yet."
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
    borderRadius: 12,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  info: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },

  status: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
  },
});