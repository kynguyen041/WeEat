import { User } from "../api/types";
import { BASE_URL } from "./config";

type LoginResponse = {
  token: string;
  user: User;
};

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return {
    token: data.token,
    user: data.data.user,
  };
}
