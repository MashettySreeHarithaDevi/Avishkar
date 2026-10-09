
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

import useAuth from '../../hooks/useAuth';


export default function ArtisanDashboardScreen({
  navigation,
}) {

  const { user, logout } = useAuth();


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.welcome}>
          Welcome 👋
        </Text>

        <Text style={styles.name}>
          {user?.name || 'Artisan'}
        </Text>

        <Text style={styles.subtitle}>
          What would you like to do?
        </Text>

      </View>


      {/* MAIN AI PRODUCT BUTTON */}

      <TouchableOpacity
        style={styles.mainCard}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('AIProductCreation')
        }
      >

        <Text style={styles.mainIcon}>
          📸
        </Text>

        <Text style={styles.mainTitle}>
          Add Product
        </Text>

        <Text style={styles.mainText}>
          Take a photo and speak about your craft
        </Text>

        <View style={styles.aiBadge}>

          <Text style={styles.aiBadgeText}>
            ✨ AI will create the catalog
          </Text>

        </View>

      </TouchableOpacity>


      {/* TWO MAIN OPTIONS */}

      <View style={styles.row}>

        {/* MY PRODUCTS */}

        <TouchableOpacity
          style={styles.smallCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('MyProducts')
          }
        >

          <Text style={styles.icon}>
            📦
          </Text>

          <Text style={styles.smallTitle}>
            My Products
          </Text>

          <Text style={styles.smallText}>
            View your products
          </Text>

        </TouchableOpacity>


        {/* B2B REQUESTS */}

        <TouchableOpacity
          style={styles.smallCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('B2BRequests')
          }
        >

          <Text style={styles.icon}>
            🤝
          </Text>

          <Text style={styles.smallTitle}>
            Buyers
          </Text>

          <Text style={styles.smallText}>
            View buyer requests
          </Text>

        </TouchableOpacity>

      </View>


      {/* PROFILE */}

      <TouchableOpacity
        style={styles.profileCard}
        activeOpacity={0.8}
      >

        <Text style={styles.profileIcon}>
          👤
        </Text>

        <View style={styles.profileInfo}>

          <Text style={styles.profileTitle}>
            My Profile
          </Text>

          <Text style={styles.profileText}>
            {user?.email || 'Your account'}
          </Text>

        </View>

      </TouchableOpacity>


      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </TouchableOpacity>


      {/* SIMPLE HELP TEXT */}

      <Text style={styles.helpText}>
        📸 Add a product → 🎤 Speak → ✨ AI creates your catalog
      </Text>

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },


  /* HEADER */

  header: {
    marginBottom: spacing.xl,
  },

  welcome: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  name: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },


  /* MAIN AI CARD */

  mainCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  mainIcon: {
    fontSize: 58,
    marginBottom: 10,
  },

  mainTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },

  mainText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },

  aiBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
  },

  aiBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },


  /* TWO CARDS */

  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  smallCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 155,
    justifyContent: 'center',
  },

  icon: {
    fontSize: 40,
    marginBottom: 10,
  },

  smallTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 5,
  },

  smallText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },


  /* PROFILE */

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  profileIcon: {
    fontSize: 35,
    marginRight: 15,
  },

  profileInfo: {
    flex: 1,
  },

  profileTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  profileText: {
    fontSize: 13,
    color: colors.textSecondary,
  },


  /* LOGOUT */

  logoutButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 5,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },


  /* HELP */

  helpText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

});
