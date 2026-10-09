import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const COLORS = {
  background: "#FFF9F1",
  white: "#FFFFFF",
  brown: "#895F3C",
  dark: "#302720",
  muted: "#82766B",
  border: "#E7DCCE",
  chip: "#F0E5D9",
};

const CATEGORIES = [
  "All Crafts",
  "Textiles",
  "Pottery",
  "Jewellery",
  "Bamboo Crafts",
];

export default function BuyerDashboard({ navigation, route }) {
  const buyerName = route?.params?.name || "Buyer";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Crafts");

  // Replace these sample items with products from your API.
  const featuredProducts = [
    {
      id: "1",
      name: "Handcrafted Pottery",
      category: "Pottery",
      price: "₹850",
      image:
        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600",
    },
    {
      id: "2",
      name: "Handwoven Textiles",
      category: "Textiles",
      price: "₹1,200",
      image:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600",
    },
  ];

  const filteredProducts = featuredProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Crafts" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const goTo = (screenName) => {
    if (navigation?.navigate) {
      navigation.navigate(screenName);
    } else {
      console.log("Connect navigation to:", screenName);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>ARTISAN MARKETPLACE</Text>
            <Text style={styles.heading}>Discover handmade.</Text>
            <Text style={styles.subtitle}>
              Unique crafts, made with care.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => goTo("Profile")}
          >
            <Text style={styles.profileIcon}>●</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <Text style={styles.welcome}>
          Welcome, {buyerName} 👋
        </Text>

        <Text style={styles.description}>
          Discover traditional crafts and connect directly
          with the artisans who create them.
        </Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search handmade products..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  active && styles.activeChip,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.activeChipText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured products */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Featured crafts
            </Text>
            <Text style={styles.sectionSubtitle}>
              Discover handmade treasures
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => goTo("Marketplace")}
          >
            <Text style={styles.viewAll}>View all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() =>
                goTo("ProductDetails")
              }
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={styles.productInfo}>
                <Text style={styles.productCategory}>
                  {product.category}
                </Text>

                <Text
                  style={styles.productName}
                  numberOfLines={2}
                >
                  {product.name}
                </Text>

                <Text style={styles.productPrice}>
                  {product.price}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredProducts.length === 0 && (
          <Text style={styles.emptyText}>
            No sample products match your search.
            Try another category or search term.
          </Text>
        )}

        {/* B2B bulk orders */}
        <View style={styles.orderCard}>
          <View style={styles.orderIconBox}>
            <Text style={styles.orderIcon}>▣</Text>
          </View>

          <Text style={styles.orderTitle}>
            Business & bulk orders
          </Text>

          <Text style={styles.orderDescription}>
            Need multiple products? Send bulk requests
            directly to artisans and track their status.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => goTo("MyB2BRequests")}
          >
            <Text style={styles.primaryButtonText}>
              View My Bulk Orders →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => goTo("BuyerDashboard")}
          >
            <Text style={styles.navIcon}>⌂</Text>
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => goTo("Marketplace")}
          >
            <Text style={styles.navIcon}>▦</Text>
            <Text style={styles.navText}>Marketplace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => goTo("MyB2BRequests")}
          >
            <Text style={styles.navIcon}>▣</Text>
            <Text style={styles.navText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => goTo("Profile")}
          >
            <Text style={styles.navIcon}>●</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  brand: {
    color: COLORS.brown,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  heading: {
    color: COLORS.dark,
    fontSize: 27,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 6,
  },
  profileButton: {
    backgroundColor: COLORS.chip,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIcon: {
    color: COLORS.brown,
    fontSize: 20,
  },
  welcome: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.dark,
    marginBottom: 8,
  },
  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  searchIcon: {
    fontSize: 25,
    color: COLORS.brown,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
  },
  categoryList: {
    marginTop: 18,
    marginBottom: 28,
    flexGrow: 0,
  },
  categoryChip: {
    backgroundColor: COLORS.chip,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 9,
  },
  activeChip: {
    backgroundColor: COLORS.brown,
  },
  categoryText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "600",
  },
  activeChipText: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 21,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 5,
  },
  viewAll: {
    color: COLORS.brown,
    fontWeight: "700",
    fontSize: 13,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImage: {
    width: "100%",
    height: 145,
    backgroundColor: COLORS.chip,
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    color: COLORS.brown,
    fontWeight: "700",
    marginBottom: 5,
  },
  productName: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: "700",
    minHeight: 38,
  },
  productPrice: {
    color: COLORS.brown,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
  },
  emptyText: {
    color: COLORS.muted,
    paddingVertical: 20,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#F0E3D5",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  orderIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  orderIcon: {
    color: COLORS.brown,
    fontSize: 23,
  },
  orderTitle: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: "800",
  },
  orderDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: COLORS.brown,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navItem: {
    alignItems: "center",
    minWidth: 60,
  },
  navIcon: {
    color: COLORS.brown,
    fontSize: 22,
    marginBottom: 4,
  },
  navText: {
    color: COLORS.muted,
    fontSize: 10,
  },
  activeNavText: {
    color: COLORS.brown,
    fontSize: 10,
    fontWeight: "800",
  },
});
