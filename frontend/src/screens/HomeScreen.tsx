import { Food } from "@/api/types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFoodWithin } from "../api/foodAPI";
import styles from "../styles/HomeScreen.styles";

const categories = ["Burger", "Pizza", "Noodles", "Salad", "Dessert", "Drink"];

export default function HomeScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Getting location...");

  useEffect(() => {
    async function loadNearbyFoods() {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});

        // const latitude = location.coords.latitude;
        // const longitude = location.coords.longitude;

        // Raising Cane's Boston
        const latitude = 42.3517808;
        const longitude = -71.1187348;

        // Optional: Convert coordinates into a readable address
        const address = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (address.length > 0) {
          const place = address[0];

          setLocationName(`${place.city ?? ""} ${place.region ?? ""}`.trim());
        }

        // Fetch nearby foods (within 5 km)
        const nearbyFoods = await getFoodWithin(latitude, longitude, 5, "km");

        setFoods(nearbyFoods);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadNearbyFoods();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.greeting}>👋 Hello, Ky</Text>

          <Text style={styles.location}>Deliver to {locationName}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <View style={styles.searchInput}>
            <Text style={{ color: "#999" }}>Search food...</Text>
          </View>
        </TouchableOpacity> */}

        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Menu */}
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Ionicons name="menu" size={30} color="#222" />
            </TouchableOpacity>

            {/* Delivery location */}
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() => router.push("/addresses")}
            >
              <Ionicons name="location" size={18} color="#FF6B35" />

              <Text style={styles.locationText} numberOfLines={1}>
                {locationName}
              </Text>

              <Ionicons name="chevron-down" size={16} color="#555" />
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Ionicons name="person-circle" size={38} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <View style={styles.searchInput}>
            <Text style={{ color: "#999" }}>Search food...</Text>
          </View>
        </TouchableOpacity>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity key={category} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>

          {foods.map((food) => (
            <TouchableOpacity
              key={food._id}
              style={styles.foodCard}
              onPress={() =>
                router.push({
                  pathname: "/food/[id]",
                  params: {
                    id: food._id,
                  },
                })
              }
            >
              <View style={styles.imagePlaceholder}>
                <Image
                  source={{ uri: food.imageCover }}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>

                <Text style={styles.foodMeta}>
                  ⭐ {food.ratingsAverage} • {food.preparationTime} min
                </Text>

                <Text style={styles.foodPrice}>${food.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
