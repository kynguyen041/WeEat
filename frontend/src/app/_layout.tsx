import { Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="food/[id]" />
          <Stack.Screen name="search" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
