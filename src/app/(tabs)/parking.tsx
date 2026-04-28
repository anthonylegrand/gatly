import { useRouter } from "expo-router";
import { ChevronDown, Search, Settings2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Plate } from "@/../db/schema";
import { Spacer } from "@/components/common/Spacer";
import { ParkingCard } from "@/components/features/parking/ParkingCard";
import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function ParkingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState("");

  const { loadPlates, plates, selectedParking, updateParking } = useAppStore();

  useEffect(() => {
    loadPlates();
  }, []);

  useEffect(
    useCallback(() => {
      if (!selectedParking) return;
      const today = new Date().setHours(0, 0, 0, 0);
      const lastDay = new Date(selectedParking.lastUsed).setHours(0, 0, 0, 0);
      if (lastDay < today) {
        updateParking(selectedParking.id, { lastUsed: Date.now() });
      }
    }, [selectedParking?.id, selectedParking?.lastUsed]),
  );

  const filtered = query.trim()
    ? plates.filter(
        (p: Plate) =>
          p.plate.toLowerCase().includes(query.toLowerCase()) ||
          p.customName?.toLowerCase().includes(query.toLowerCase()),
      )
    : plates;

  const authorized = filtered.filter((p: Plate) => p.isAuthorized === true);
  const unknown = filtered.filter((p: Plate) => p.isAuthorized !== true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push("/(option)/parkingsList")}
          style={styles.parkingSelector}
        >
          <View>
            <ThemedText type="subtitle">
              {selectedParking?.name ?? "Parking"}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {plates.length} véhicule{plates.length !== 1 ? "s" : ""}
            </ThemedText>
          </View>
          <ChevronDown size={16} color={theme.textSecondary} />
        </Pressable>
        <Pressable
          hitSlop={8}
          onPress={() =>
            router.push({
              pathname: "/(option)/upsertParking",
              params: { id: selectedParking?.id },
            })
          }
        >
          <Settings2 size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          gap: Spacing.two,
          paddingBottom: Spacing.four,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <Search size={16} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Plaque ou nom..."
            placeholderTextColor={theme.textSecondary}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
            autoCapitalize="characters"
            clearButtonMode="while-editing"
          />
        </View>

        <Spacer size={Spacing.two} />

        {authorized.length > 0 && (
          <View style={{ gap: Spacing.two }}>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Autorisés · {authorized.length}
            </ThemedText>
            {authorized.map((plate: Plate) => (
              <ParkingCard key={plate.id} {...plate} />
            ))}
          </View>
        )}

        <Spacer size="two" />

        {unknown.length > 0 && (
          <View style={{ gap: Spacing.two }}>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              Inconnus · {unknown.length}
            </ThemedText>
            {unknown.map((plate: Plate) => (
              <ParkingCard key={plate.id} {...plate} />
            ))}
          </View>
        )}

        {filtered.length === 0 && (
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={{ textAlign: "center", paddingTop: Spacing.four }}
          >
            {query.trim()
              ? `Aucun résultat pour « ${query} »`
              : "Aucune plaque enregistrée"}
          </ThemedText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  parkingSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
