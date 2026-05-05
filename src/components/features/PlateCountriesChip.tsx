import { useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

import { COUNTRY_META } from "@/constants/plate.constant";
import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import usePersistantStore from "@/utils/store/usePersistantStore";

type Props = {
  variant?: "themed" | "camera";
  style?: StyleProp<ViewStyle>;
};

export function PlateCountriesChip({ variant = "themed", style }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { scannablePlateCountry } = usePersistantStore();

  const isCamera = variant === "camera";

  return (
    <Pressable
      style={[
        styles.base,
        isCamera
          ? styles.chipCamera
          : { backgroundColor: theme.backgroundElement },
        style,
      ]}
      onPress={() => router.push("/(option)/scannablePlates")}
      hitSlop={8}
    >
      <ThemedText style={styles.flags}>
        {scannablePlateCountry.map((c) => COUNTRY_META[c].flag).join("  ")}
      </ThemedText>
      <SlidersHorizontal
        size={14}
        color={isCamera ? "rgba(255,255,255,0.6)" : theme.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
  },
  chipCamera: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  flags: {
    fontSize: 18,
    lineHeight: 22,
  },
});
