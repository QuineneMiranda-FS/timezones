import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTimeZone } from "../hooks/useTimeZone";

import AddTimeZoneForm from "../components/AddTimeZoneForm";

function TimeZoneList() {
  const { timeZones, locations, loading, error, removeTimeZone, addTimeZone } =
    useTimeZone();

  if (loading && timeZones.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Waking up server...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Zone Manager</Text>

      <AddTimeZoneForm onAdd={addTimeZone} locations={locations} />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={timeZones}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.tzName}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {item.cityName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeTimeZone(item._id || item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tzName: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
});

export default TimeZoneList;
