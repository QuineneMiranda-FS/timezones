import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import TimeZoneList from "./components/TimeZoneList";
import LocationList from "./components/LocationList";

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.h1}>Global Manager</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.p}>View and manage your timezones below.</Text>
        </View>

        <View style={styles.main}>
          <TimeZoneList />
          <LocationList />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  p: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  main: {
    flex: 1,
    marginTop: 10,
  },
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});
