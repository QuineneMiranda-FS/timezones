import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />

      <TouchableOpacity style={[styles.button, { backgroundColor: "#34C759" }]}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: { padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#007AFF", marginTop: 20, textAlign: "center" },
});
