import { getFood } from "@/api/foodAPI";
import { Food } from "@/api/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import styles from "../styles/FoodDetailScreen.styles";

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();

  const [food, setFood] = useState<Food | null>(null);

  useEffect(() => {
    async function loadFood() {
      try {
        const result = await getFood(id as string);
        setFood(result);
      } catch (err) {
        console.error(err);
      }
    }

    loadFood();
  }, []);

  if (!food) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: food.imageCover }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.name}>{food.name}</Text>

        <Text style={styles.rating}>⭐ {food.ratingsAverage}</Text>

        <Text style={styles.orders}>{food.totalOrders} Orders</Text>

        <Text style={styles.descriptionTitle}>Description</Text>

        <Text style={styles.description}>{food.description}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            console.log("Add to Cart:", food.name);
          }}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
