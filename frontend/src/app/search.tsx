import { searchFood } from "@/api/foodAPI";
import { Food } from "@/api/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/SearchScreen.styles";
export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [food, setFood] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim() == "") {
        setFood([]);
        return;
      }
      try {
        setLoading(true);
        const result = await searchFood(search.trim());

        setFood(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
      return () => clearTimeout(timeout);
    }, 500);
  }, [search]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search food, cuisine, category or restaurant..."
        value={search}
        onChangeText={(food) => setSearch(food)}
        style={styles.searchInput}
        autoFocus
      />

      {loading && <ActivityIndicator size="large" style={styles.loading} />}

      {!loading && search.trim() !== "" && food.length === 0 && (
        <Text style={styles.emptyText}>No foods found.</Text>
      )}

      <FlatList
        data={food}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodCard}
            onPress={() =>
              router.push({
                pathname: "/food/[id]",
                params: {
                  id: item._id,
                },
              })
            }
          >
            <Image source={{ uri: item.imageCover }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.meta}>
                {item.cuisine} • {item.category}
              </Text>

              <Text style={styles.meta}>⭐ {item.ratingsAverage}</Text>

              <Text style={styles.price}>${item.price}</Text>

              <Text style={styles.restaurant}>{item.merchant?.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
