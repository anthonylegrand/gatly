import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";
import { Plate } from "../../../../db/schema";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export function PlateCard(plate: Plate) {
  const theme = useTheme();
  const { setSelectedPlate } = useAppStore();

  const StatusIcon =
    plate.isAuthorized === null
      ? ShieldQuestion
      : plate.isAuthorized
        ? ShieldCheck
        : ShieldAlert;
  const statusColor =
    plate.isAuthorized === null
      ? "#9E9E9E"
      : plate.isAuthorized
        ? "#4CAF50"
        : "#FF5252";
  const statusLabel =
    plate.isAuthorized === null
      ? "Inconnu"
      : plate.isAuthorized
        ? "Autorisé"
        : "Non autorisé";

  return (
    <TouchableOpacity onPress={() => setSelectedPlate(plate)}>
      <ThemedCard style={styles.card}>
        <View style={styles.row}>
          {/* Left */}
          <View style={styles.left}>
            <ThemedText type="default" style={styles.customName}>
              {plate.customName || "-"}
            </ThemedText>
            <View
              style={[
                styles.plateBadge,
                { backgroundColor: theme.backgroundSheet },
              ]}
            >
              <ThemedText style={[styles.plateText, { color: theme.text }]}>
                {plate.plate}
              </ThemedText>
            </View>
            <View style={styles.lastSeenGroup}>
              <Clock size={10} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                Scanné {dayjs(plate.lastSeen).fromNow()}
              </ThemedText>
            </View>
          </View>

          {/* Right */}
          <View style={styles.right}>
            <View style={styles.statusGroup}>
              <StatusIcon size={13} color={statusColor} />
              <ThemedText
                type="small"
                style={[styles.statusLabel, { color: statusColor }]}
              >
                {statusLabel}
              </ThemedText>
            </View>
            {plate.isAuthorized && plate.authorizedUntil && (
              <ThemedText
                type="small"
                style={{ color: statusColor, opacity: 0.7 }}
              >
                expire {dayjs(plate.authorizedUntil).fromNow()}
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  left: {
    flex: 1,
    gap: Spacing.one,
  },
  right: {
    alignItems: "flex-end",
    gap: 3,
  },
  customName: {
    fontWeight: "700",
  },
  plateBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.one,
  },
  plateText: {
    fontFamily: "monospace",
    fontSize: 13,
    letterSpacing: 1.5,
  },
  lastSeenGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusLabel: {
    fontWeight: "600",
  },
});
