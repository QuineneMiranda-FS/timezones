import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Import your screen components
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // --- AUTHENTICATED STACK ---
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Global TimeZone" }}
        />
      ) : (
        // --- UNAUTHENTICATED STACK ---
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Create Account" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
