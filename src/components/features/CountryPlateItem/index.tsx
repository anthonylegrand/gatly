import { Check } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ui";
import { Colors, PlateCountry, Spacing } from "@/constants";
import { COUNTRY_META, EXAMPLE_PLATES } from "@/constants/plate.constant";
import { useTheme } from "@/hooks/theme/useTheme";

type Props = {
  country: PlateCountry;
  variant?: "select" | "match" | "suggestion";
  plate?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
};

export function CountryPlateItem({
  country,
  variant = "select",
  plate,
  isSelected = false,
  isDisabled = false,
  onPress,
}: Props) {
  const theme = useTheme();

  const isMatch = variant === "match";
  const isSuggestion = variant === "suggestion";
  const isSelect = variant === "select";

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isSelect && {
          backgroundColor: isSelected
            ? `${Colors.primary}18`
            : theme.backgroundElement,
          borderColor: isSelected ? Colors.primary : "transparent",
          opacity: isDisabled ? 0.4 : 1,
        },
        isMatch && {
          backgroundColor: `${Colors.primary}15`,
          borderColor: `${Colors.primary}40`,
        },
        isSuggestion && {
          backgroundColor: theme.backgroundElement,
          borderColor: "transparent",
        },
      ]}
      onPress={onPress}
      activeOpacity={isDisabled || isSuggestion ? 1 : 0.7}
      disabled={isDisabled || isSuggestion || !onPress}
    >
      <ThemedText style={styles.flag}>{COUNTRY_META[country].flag}</ThemedText>

      <View style={styles.rowContent}>
        <ThemedText type="default" style={{ fontWeight: "600" }}>
          {COUNTRY_META[country].name}
        </ThemedText>

        {isSelect && (
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
        )}

        {(isMatch || isSuggestion) && plate && (
          <ThemedText
            style={[
              styles.plateText,
              { color: isMatch ? Colors.primary : theme.textSecondary },
            ]}
          >
            {plate}
          </ThemedText>
        )}
      </View>

      {isSelect && (
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
      )}

      {isMatch && <Check size={18} color={Colors.primary} strokeWidth={2.5} />}
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
  plateText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
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
