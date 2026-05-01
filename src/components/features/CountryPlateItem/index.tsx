import { Check } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ui";
import { Colors, PlateCountry, Spacing } from "@/constants";
import { generateFakePlate, PLATE_COUNTRIES } from "@/constants/plate.constant";
import { useTheme } from "@/hooks/theme/useTheme";

export const COUNTRY_META: Record<PlateCountry, { flag: string; name: string }> = {
  FR: { flag: "🇫🇷", name: "France" },
  EN: { flag: "🇬🇧", name: "United Kingdom" },
  ES: { flag: "🇪🇸", name: "España" },
  DE: { flag: "🇩🇪", name: "Deutschland" },
  NL: { flag: "🇳🇱", name: "Nederland" },
  IT: { flag: "🇮🇹", name: "Italia" },
  PL: { flag: "🇵🇱", name: "Polska" },
  CH: { flag: "🇨🇭", name: "Schweiz" },
  BE: { flag: "🇧🇪", name: "Belgique" },
  LU: { flag: "🇱🇺", name: "Luxembourg" },
};

export const EXAMPLE_PLATES: Record<PlateCountry, string> = Object.fromEntries(
  PLATE_COUNTRIES.map((c) => [c, generateFakePlate(c)]),
) as Record<PlateCountry, string>;

type Props = {
  country: PlateCountry;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

export function CountryPlateItem({ country, isSelected, isDisabled, onPress }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: isSelected
            ? `${Colors.primary}18`
            : theme.backgroundElement,
          borderColor: isSelected ? Colors.primary : "transparent",
          opacity: isDisabled ? 0.4 : 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={isDisabled ? 1 : 0.7}
      disabled={isDisabled}
    >
      <ThemedText style={styles.flag}>{COUNTRY_META[country].flag}</ThemedText>

      <View style={styles.rowContent}>
        <ThemedText type="default" style={{ fontWeight: "600" }}>
          {COUNTRY_META[country].name}
        </ThemedText>
        <View
          style={[
            styles.codeChip,
            {
              backgroundColor: isSelected
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <ThemedText type="small" style={styles.codeText}>
            EX: {EXAMPLE_PLATES[country]}
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: isSelected ? Colors.primary : theme.background,
            borderColor: isSelected ? Colors.primary : theme.textSecondary,
          },
        ]}
      >
        {isSelected && <Check size={14} color="#FFF" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  flag: {
    fontSize: 28,
    lineHeight: 32,
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  codeChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    letterSpacing: 0.3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
