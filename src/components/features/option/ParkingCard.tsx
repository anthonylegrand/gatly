import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { Car, Check, Clock, Pencil } from "lucide-react-native";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

dayjs.extend(relativeTime);
dayjs.locale("fr");

import { ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import type { ParkingWithCount } from "@/utils/services/parking.service";

type Props = {
  parking: ParkingWithCount;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
};

export function ParkingCard({ parking, isSelected, onSelect, onEdit }: Props) {
  const theme = useTheme();
  const { plateCount } = parking;

  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <ThemedCard
        style={[
          styles.card,
          isSelected && { borderColor: Colors.primary, borderWidth: 1.5 },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.left}>
            <View style={styles.nameRow}>
              {isSelected && (
                <Check size={14} color={Colors.primary} strokeWidth={2.5} />
              )}
              <ThemedText style={[styles.name, isSelected && { color: Colors.primary }]}>
                {parking.name}
              </ThemedText>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Car size={11} color={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  {plateCount} véhicule{plateCount !== 1 ? "s" : ""}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">·</ThemedText>
              <View style={styles.metaItem}>
                <Clock size={11} color={theme.textSecondary} />
                <ThemedText type="small" themeColor="textSecondary">
                  {dayjs(parking.lastUsed).fromNow()}
                </ThemedText>
              </View>
            </View>
          </View>

          <Pressable onPress={onEdit} hitSlop={12} style={styles.editBtn}>
            <Pencil size={15} color={theme.textSecondary} />
          </Pressable>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editBtn: {
    padding: Spacing.one,
  },
});
