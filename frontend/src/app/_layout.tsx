import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="food/[id]" />
      <Stack.Screen name="search" />
      <Stack.Screen name="profile" /> 
      <Stack.Screen name="settings" />
    </Stack>
  );
}