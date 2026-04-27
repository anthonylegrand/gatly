import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

import type { Parking } from "@/../db/schema";
import { ThemedIcon } from "@/components/common/ThemedIcon";
import { ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { Colors, Spacing } from "@/constants";
import { PLATE_COUNTRIES } from "@/constants/plate.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

type Props = {
  parking: Parking;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
};

const MAX_COUNTRIES = 10;

export function ParkingCard({ parking, isSelected, onSelect, onEdit }: Props) {
  const theme = useTheme();
  const { plates } = useAppStore();

  const plateCount = plates.filter((p) => p.parkingId === parking.id).length;

  const selectedCountrys = parking.countrys ?? [];
  const inactive = PLATE_COUNTRIES.filter((c) => !selectedCountrys.includes(c));
  const displayedCountries = [
    ...selectedCountrys,
    ...inactive.slice(0, Math.max(0, MAX_COUNTRIES - selectedCountrys.length)),
  ];

  return (
    <TouchableOpacity onPress={onSelect}>
      <ThemedCard
        style={[
          styles.card,
          isSelected && { borderColor: Colors.primary, borderWidth: 1.5 },
        ]}
      >
        <View style={styles.top}>
          <View style={styles.info}>
            <ThemedText type="default" style={{ fontWeight: "700" }}>
              {parking.name}
            </ThemedText>
            <View style={styles.chips}>
              {displayedCountries.map((c) => {
                const active = selectedCountrys.includes(c);
                return (
                  <View
                    key={c}
                    style={[
                      styles.chip,
                      active
                        ? { backgroundColor: Colors.primary }
                        : {
                            backgroundColor: theme.backgroundElement,
                            opacity: 0.6,
                          },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={{
                        color: active ? "#FFFFFF" : theme.textSecondary,
                      }}
                    >
                      {c}
                    </ThemedText>
                  </View>
                );
              })}
            </View>
          </View>

          <Pressable onPress={onEdit} hitSlop={8} style={styles.editButton}>
            <ThemedIcon
              name="Pencil"
              size={16}
              color={"textSecondary"}
              background
            />
          </Pressable>
        </View>

        <View style={[styles.footer, { justifyContent: "flex-end" }]}>
          <ThemedText type="small" themeColor="textSecondary">
            {plateCount} véhicule{plateCount !== 1 ? "s" : ""} enregistré
            {plateCount !== 1 ? "s" : ""}
          </ThemedText>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    gap: Spacing.two,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editButton: {
    padding: Spacing.one,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
