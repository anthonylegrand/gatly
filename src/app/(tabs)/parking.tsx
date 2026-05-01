import { useRouter } from "expo-router";
import { ChevronDown, Globe, Search, Settings2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
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
import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function ParkingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

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
            <ThemedText type="subtitle">{selectedParking?.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t(
                plates.length > 1
                  ? "GLOBAL.text.X_vehicles"
                  : "GLOBAL.text.X_vehicle",
              ).replace("%%%", plates.length.toString())}
            </ThemedText>
          </View>
          <ChevronDown size={16} color={theme.textSecondary} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            hitSlop={8}
            onPress={() => router.push("/(option)/appLanguage")}
          >
            <Globe size={20} color={theme.textSecondary} />
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
            placeholder={t("tabs_page.parking.search_input.placeholder")}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
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
