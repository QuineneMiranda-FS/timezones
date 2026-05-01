import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as api from "../services/timezoneAPI";

export const useTimeZone = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tzRes, locRes] = await Promise.all([
        api.getTimeZone(),
        api.getLocations(),
      ]);

      const rawTZ = tzRes.data?.data || [];
      const rawLocs = locRes.data?.data || [];

      const enriched = rawTZ.map((tz) => {
        const currentTzId = String(tz.id || tz._id || "").trim();
        const cityMatch = rawLocs.find((loc) => {
          const locTzId = String(loc.timeZoneId || loc.tzId || "").trim();
          return locTzId === currentTzId;
        });

        return {
          ...tz,
          id: currentTzId,
          cityName: cityMatch ? cityMatch.cityName : "Unknown City",
        };
      });

      setTimeZones(enriched);
      setLocations(rawLocs);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load time zones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeZones();
  }, [fetchTimeZones]);

  const addTimeZone = async (values) => {
    setLoading(true);
    try {
      const res = await api.createTimeZone(values);
      const newRecord = res.data?.data || res.data;

      const enrichedNewRecord = {
        ...newRecord,
        id: newRecord._id || newRecord.id,
        cityName: values.cityName || "New City",
      };

      setTimeZones((prev) => [enrichedNewRecord, ...prev]);
      return newRecord;
    } catch (err) {
      Alert.alert("Error", "Could not add time zone");
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeZone = async (id, data) => {
    setLoading(true);
    try {
      const { _id, __v, id: oldId, ...updateData } = data;
      const res = await api.updateTimeZoneById(id, updateData);

      const updatedRecord = res.data?.data || res.data;

      const cityMatch = locations.find(
        (loc) => String(loc.timeZoneId || loc._id || loc.id) === String(id),
      );

      const enrichedUpdate = {
        ...updatedRecord,
        id: updatedRecord._id || updatedRecord.id || id,
        cityName: cityMatch
          ? cityMatch.cityName
          : data.cityName || "Updated City",
      };

      setTimeZones((prev) =>
        prev.map((tz) => {
          const currentId = (tz._id || tz.id)?.toString();
          const targetId = id?.toString();
          return currentId === targetId ? enrichedUpdate : tz;
        }),
      );

      return updatedRecord;
    } catch (err) {
      console.error("Update Failed:", err);
      Alert.alert(
        "Update Failed",
        err.response?.data?.message || "Check your connection.",
      );
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTimeZone = async (id) => {
    setLoading(true);
    try {
      await api.deleteTimeZoneById(id);
      setTimeZones((prev) => prev.filter((tz) => tz.id !== id));
    } catch (err) {
      Alert.alert("Delete Error", "Could not remove the entry.");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    timeZones,
    locations,
    loading,
    error,
    fetchTimeZones,
    addTimeZone,
    updateTimeZone,
    removeTimeZone,
  };
};
