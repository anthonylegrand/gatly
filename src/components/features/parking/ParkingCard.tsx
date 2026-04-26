import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react-native";
import { View } from "react-native";

import { ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { Spacing } from "@/constants/theme.constant";
import { Plate } from "../../../../db/schema";

export function ParkingCard(plate: Plate) {
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
    <ThemedCard style={{ gap: Spacing.one }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText type="default">{plate.plate}</ThemedText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.half,
          }}
        >
          <StatusIcon size={14} color={statusColor} />
          <ThemedText type="small" style={{ color: statusColor }}>
            {statusLabel}
          </ThemedText>
        </View>
      </View>

      {plate.customName && (
        <ThemedText type="small" themeColor="textSecondary">
          {plate.customName}
        </ThemedText>
      )}

      {plate.color && (
        <ThemedText type="small" themeColor="textSecondary">
          {plate.color}
        </ThemedText>
      )}

      {plate.isAuthorized && plate.authorizedUntil && (
        <ThemedText type="small" themeColor="textSecondary">
          Jusqu'au {new Date(plate.authorizedUntil).toLocaleDateString("fr-FR")}
        </ThemedText>
      )}
    </ThemedCard>
  );
}
