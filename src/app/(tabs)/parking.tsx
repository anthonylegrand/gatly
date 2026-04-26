import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

import { Plate } from "@/../db/schema";
import { Spacer } from "@/components/common/Spacer";
import { ParkingCard } from "@/components/features/parking/ParkingCard";
import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function ParkingScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState("");

  const plates = useAppStore((s) => s.plates);
  const loadPlates = useAppStore((s) => s.loadPlates);

  useEffect(() => {
    loadPlates();
  }, []);

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
    <ScrollView
      style={{ padding: Spacing.three }}
      contentContainerStyle={{ gap: Spacing.two, paddingBottom: Spacing.four }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: Spacing.two,
        }}
      >
        <ThemedText type="subtitle">Plaques</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {filtered.length} plaque{filtered.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.two,
          backgroundColor: theme.backgroundElement,
          borderRadius: Spacing.two,
          paddingHorizontal: Spacing.three,
          paddingVertical: Spacing.two,
        }}
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
  );
}
