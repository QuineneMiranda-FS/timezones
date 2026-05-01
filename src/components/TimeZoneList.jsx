import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTimeZone } from "../hooks/useTimeZone";
import AddTimeZoneForm from "./AddTimeZoneForm";

const TimeZoneList = () => {
  const {
    timeZones,
    loading,
    removeTimeZone,
    addTimeZone,
    updateTimeZone,
    locations,
  } = useTimeZone();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    location: "",
  });

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      name: record.name,
      fullName: record.fullName,
      location: record.locationData?._id || record.location,
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleUpdate = async () => {
    const id = editingRecord?._id || editingRecord?.id;
    if (!id) return;
    try {
      await updateTimeZone(id, formData);
      setIsEditModalOpen(false);
    } catch (err) {
      console.log("Update Failed:", err);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Delete this timezone?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => removeTimeZone(id), style: "destructive" },
    ]);
  };

  const renderItem = ({ item }) => {
    const isHighlighted =
      item._id === highlightedId || item.id === highlightedId;
    return (
      <View style={[styles.row, isHighlighted && styles.highlighted]}>
        <View style={{ flex: 2 }}>
          <Text style={styles.codeText}>{item.id || item._id}</Text>
          <Text style={styles.boldText}>
            {item.name} - {item.cityName || "Unknown"}
          </Text>
          <Text style={styles.subText}>{item.fullName}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item.id || item._id)}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Zone Manager</Text>
      <AddTimeZoneForm onAdd={addTimeZone} locations={locations} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={timeZones}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No time zones found.</Text>}
        scrollEnabled={false}
      />

      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Time Zone</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(val) =>
                setFormData({ ...formData, name: val.toUpperCase() })
              }
            />
            {/* ... rest of your modal inputs ... */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleUpdate}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ); 
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  highlighted: { backgroundColor: "#fffbe6" },
  codeText: { fontSize: 10, color: "#888", fontFamily: "monospace" },
  boldText: { fontWeight: "bold", fontSize: 16 },
  subText: { color: "#666" },
  actions: { flexDirection: "row", gap: 10 },
  editBtn: { color: "#1890ff", marginRight: 10 },
  deleteBtn: { color: "#ff4d4f" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btn: { padding: 10, borderRadius: 4 },
  saveBtn: { backgroundColor: "#1890ff" },
});

export default TimeZoneList;
