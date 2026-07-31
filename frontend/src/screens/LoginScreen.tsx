import { loginUser } from "../api/authAPI";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const { token, user } = await loginUser(email, password);

      await login(token, user);

      router.replace("/profile");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View>
      <Text>Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}
