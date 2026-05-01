import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import TimeZoneList from "../components/TimeZoneList";
import LocationList from "../components/LocationList";

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[1]}
        keyExtractor={(item) => item.toString()}
        keyExtractor={() => "key"}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.row}>
                <Text style={styles.h1}>Global Manager</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.p}>
                View and manage your timezones below.
              </Text>
            </View>

            {/* These components likely contain FlatLists. 
                Ensure they have 'scrollEnabled={false}' inside their own code! */}
            <TimeZoneList />
            <LocationList />
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
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
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});
