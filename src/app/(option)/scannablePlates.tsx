import { useRouter } from "expo-router";
import { ScanSearch } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, PLATE_COUNTRIES, PlateCountry, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { CountryPlateItem } from "@/components/features/CountryPlateItem";
import usePersistantStore, {
  MAX_SCANNABLE_PLATES,
} from "@/utils/store/usePersistantStore";

export default function ScannablePlatesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { scannablePlateCountry, setScannablePlateCountry } =
    usePersistantStore();

  const toggle = (country: PlateCountry) => {
    const isSelected = scannablePlateCountry.includes(country);
    if (isSelected) {
      setScannablePlateCountry(
        scannablePlateCountry.filter((c) => c !== country),
      );
    } else if (scannablePlateCountry.length < MAX_SCANNABLE_PLATES) {
      setScannablePlateCountry([...scannablePlateCountry, country]);
    }
  };

  const isLimitReached = scannablePlateCountry.length >= MAX_SCANNABLE_PLATES;
  const isEmpty = scannablePlateCountry.length === 0;

  const sortedCountries = useMemo(() => {
    const selected = PLATE_COUNTRIES.filter((c) =>
      scannablePlateCountry.includes(c),
    );
    const unselected = PLATE_COUNTRIES.filter(
      (c) => !scannablePlateCountry.includes(c),
    );
    return [...selected, ...unselected];
  }, [scannablePlateCountry]);

  const counterBg = isLimitReached
    ? Colors.primary
    : isEmpty
      ? "#F97316"
      : theme.backgroundElement;
  const counterTextColor = isLimitReached || isEmpty ? "#FFF" : theme.text;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconGlow} />
          <ScanSearch size={40} color="#FFFFFF" />
        </View>

        <View style={styles.texts}>
          <ThemedText type="subtitle" style={styles.title}>
            {t("option_page.ScannablePlates.title")}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.description}
          >
            {t("option_page.ScannablePlates.description").replace(
              "%%%",
              String(MAX_SCANNABLE_PLATES),
            )}
          </ThemedText>
        </View>

        <View style={[styles.counter, { backgroundColor: counterBg }]}>
          <ThemedText
            type="small"
            style={{ color: counterTextColor, fontWeight: "700" }}
          >
            {scannablePlateCountry.length} / {MAX_SCANNABLE_PLATES}
          </ThemedText>
          {isLimitReached && (
            <ThemedText type="small" style={{ color: "#FFF", opacity: 0.85 }}>
              {t("option_page.ScannablePlates.limit_reached").replace(
                "%%%",
                String(MAX_SCANNABLE_PLATES),
              )}
            </ThemedText>
          )}
          {isEmpty && (
            <ThemedText type="small" style={{ color: "#FFF", opacity: 0.85 }}>
              {t("option_page.ScannablePlates.no_selection")}
            </ThemedText>
          )}
        </View>
      </View>

      <FlatList
        data={sortedCountries}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item: country }) => (
          <CountryPlateItem
            country={country}
            isSelected={scannablePlateCountry.includes(country)}
            isDisabled={!scannablePlateCountry.includes(country) && isLimitReached}
            onPress={() => toggle(country)}
          />
        )}
      />

      <View style={styles.footer}>
        <ThemedButton variant="ghost" onPress={() => router.back()}>
          {t("GLOBAL.button.back")}
        </ThemedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  header: {
    alignItems: "center",
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  iconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    transform: [{ scale: 1.4 }],
  },
  texts: {
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    lineHeight: 20,
  },
  counter: {
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    gap: 2,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  footer: {
    paddingTop: Spacing.two,
  },
});
