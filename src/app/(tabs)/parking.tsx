import { useFocusEffect, useRouter } from "expo-router";
import { Bolt, ChevronLeft, Globe, PenBox, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Plate } from "@/../db/schema";
import { Spacer } from "@/components/common/Spacer";
import { PlateCard } from "@/components/features/parking/PlateCard";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function ParkingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const {
    loadPlates,
    plates,
    selectedParking,
    setSelectedParking,
    updateParking,
  } = useAppStore();

  useEffect(() => {
    loadPlates();
  }, []);

  useFocusEffect(() => {
    if (selectedParking && selectedParking.lastUsed < Date.now() - 60_000) {
      updateParking(selectedParking.id, { lastUsed: Date.now() }).then(
        (parking) => setSelectedParking(parking),
      );
    }
  });

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
    <ThemedView style={styles.container}>
      <ThemedView type="primary" style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={() => router.push("/(option)/parkingsList")}
            style={styles.parkingSelector}
          >
            <ChevronLeft size={16} color="rgba(255,255,255,0.7)" />
            <ThemedText type="small" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
              {t("tabs_page.parking.header.parking_list_link")}
            </ThemedText>
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              hitSlop={8}
              onPress={() => router.push("/(option)/appLanguage")}
            >
              <Globe size={20} color="rgba(255,255,255,0.75)" />
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
              <Bolt size={20} color="rgba(255,255,255,0.75)" />
            </Pressable>
          </View>
        </View>

        <View style={styles.headerContent}>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.65)", fontWeight: "400" }}>
            {t("tabs_page.parking.header.welcome_label")}
          </ThemedText>
          <ThemedText style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "700", lineHeight: 36 }}>
            {selectedParking?.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.65)" }}>
            {t(
              plates.length > 1
                ? "GLOBAL.text.X_vehicles"
                : "GLOBAL.text.X_vehicle",
            ).replace("%%%", plates.length.toString())}
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.addButtonWrapper}>
        <ThemedView style={{ borderRadius: Spacing.two }}>
          <ThemedButton
            variant="ghost"
            icon={PenBox}
            onPress={() => router.push("/(option)/manualPlate")}
            style={[
              styles.addButton,
              { backgroundColor: theme.backgroundSheet },
            ]}
          >
            {t("tabs_page.parking.header.add_plate")}
          </ThemedButton>
        </ThemedView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          gap: Spacing.two,
          paddingTop: Spacing.four,
          paddingBottom: Spacing.four,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView type="backgroundElement" style={styles.searchBar}>
          <Search size={16} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("tabs_page.parking.search_input.placeholder")}
            placeholderTextColor={theme.textSecondary}
            style={{ flex: 1, color: theme.text, fontSize: 15 }}
            autoCapitalize="characters"
            clearButtonMode="while-editing"
          />
        </ThemedView>

        <Spacer size={Spacing.two} />

        {authorized.length > 0 && (
          <View style={{ gap: Spacing.two }}>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
            >
              {t("tabs_page.parking.list_sections.authorized")} ·{" "}
              {authorized.length}
            </ThemedText>
            {authorized.map((plate: Plate) => (
              <PlateCard key={plate.id} {...plate} />
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
              {t("tabs_page.parking.list_sections.unknown")} · {unknown.length}
            </ThemedText>
            {unknown.map((plate: Plate) => (
              <PlateCard key={plate.id} {...plate} />
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
              ? t(
                  "tabs_page.parking.search_input.result_text.querry_no_result",
                ).replace("%%%", query)
              : t("tabs_page.parking.search_input.result_text.no_plates")}
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five + Spacing.two,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.four,
  },
  parkingSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  headerContent: {
    gap: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  addButtonWrapper: {
    marginTop: -22,
    paddingHorizontal: Spacing.three,
    zIndex: 10,
  },
  addButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
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
