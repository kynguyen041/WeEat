import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useCart } from "../context/CartContext";
import styles from "../styles/CartScreen.styles";

export default function CartScreen() {
  const {
    cartItems,
    totalAmount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#999" />

        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Cart</Text>

        {cartItems.map((item) => (
          <View key={item._id} style={styles.cartCard}>
            <Image source={{ uri: item.imageCover }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.price}>${item.price.toFixed(2)}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(item._id)}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={28}
                    color="#FF6B35"
                  />
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity onPress={() => increaseQuantity(item._id)}>
                  <Ionicons
                    name="add-circle-outline"
                    size={28}
                    color="#FF6B35"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            console.log("Place order");
          }}
        >
          <Text style={styles.orderButtonText}>Place My Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
