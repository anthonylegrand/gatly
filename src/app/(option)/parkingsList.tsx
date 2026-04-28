import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Parking } from "@/../db/schema";
import { ParkingCard } from "@/components/features/option/ParkingCard";
import { ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function ParkingsListScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { parkings, loadParkings, selectedParking, setSelectedParking } =
    useAppStore();

  useEffect(() => {
    if (!parkings) loadParkings();
  }, []);

  useEffect(() => {
    if (parkings && !selectedParking) setSelectedParking(parkings[0]);
  }, [parkings, selectedParking]);

  function selectParking(parking: Parking) {
    setSelectedParking(parking);
    router.dismissTo("/(tabs)/parking");
  }

  function openUpsert(id?: string) {
    router.push(
      id
        ? { pathname: "/(option)/upsertParking", params: { id } }
        : "/(option)/upsertParking",
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle">Mes parkings</ThemedText>
        <Pressable
          style={[styles.addButton, { backgroundColor: Colors.primary }]}
          onPress={() => openUpsert()}
          hitSlop={8}
        >
          <Plus size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <FlatList
        data={parkings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText
              themeColor="textSecondary"
              style={{ textAlign: "center" }}
            >
              Aucun parking. Créez-en un pour commencer.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <ParkingCard
            parking={item}
            isSelected={selectedParking?.id === item.id}
            onSelect={() => selectParking(item)}
            onEdit={() => openUpsert(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    gap: Spacing.two,
  },
  empty: {
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
});
