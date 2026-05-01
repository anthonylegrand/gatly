import {
  CheckCircle,
  CircleOff,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import type { Plate } from "@/../db/schema";
import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useAppStore } from "@/utils/store";
import usePersistantStore from "@/utils/store/usePersistantStore";
import { AuthorizationForm } from "./AuthorizationForm";
import { PlateVisual } from "./PlateVisual";

function daysFromNow(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export default function ContentBottomSheet() {
  "use no memo";

  const {
    selectedPlate,
    plates,
    addPlate,
    updatePlate,
    removePlate,
    setSelectedPlate,
  } = useAppStore();
  const { scanCredits } = usePersistantStore();
  const { t } = useTranslation();

  const isDetection = selectedPlate ? !("id" in selectedPlate) : false;
  const plateString = selectedPlate?.plate ?? "";
  const country = selectedPlate?.country ?? "";

  const registeredPlate: Plate | null = useMemo(() => {
    if (!selectedPlate) return null;
    if (!isDetection) return selectedPlate as Plate;
    return plates.find((p) => p.plate === plateString) ?? null;
  }, [selectedPlate, plates, isDetection, plateString]);

  const isRegistered = !!registeredPlate;

  const [customName, setCustomName] = useState(
    registeredPlate?.customName ?? "",
  );
  const [customInfos, setCustomInfos] = useState(
    registeredPlate?.customInfos ?? "",
  );
  const [isAuthorized, setIsAuthorized] = useState(
    registeredPlate?.isAuthorized ?? false,
  );
  const [authorizedUntil, setAuthorizedUntil] = useState<Date | null>(
    registeredPlate?.authorizedUntil
      ? new Date(registeredPlate.authorizedUntil)
      : null,
  );
  const [durationKey, setDurationKey] = useState<number | null>(
    registeredPlate?.authorizedUntil ? 30 : null,
  );
  const [dateConfirmed, setDateConfirmed] = useState(
    !!registeredPlate?.authorizedUntil,
  );

  const registeredPlateId = isRegistered ? registeredPlate.id : null;

  useEffect(() => {
    setCustomName(registeredPlate?.customName ?? "");
    setCustomInfos(registeredPlate?.customInfos ?? "");
    setIsAuthorized(registeredPlate?.isAuthorized ?? false);
    const until = registeredPlate?.authorizedUntil
      ? new Date(registeredPlate.authorizedUntil)
      : null;
    setAuthorizedUntil(until);
    setDurationKey(until ? 30 : null);
    setDateConfirmed(!!until);
  }, [registeredPlateId]);

  if (!selectedPlate) return null;

  const handleSave = async () => {
    const payload = {
      customName: customName.trim() || null,
      customInfos: customInfos.trim() || null,
      isAuthorized,
      authorizedUntil:
        isAuthorized && authorizedUntil ? authorizedUntil.getTime() : null,
    };
    if (isRegistered) {
      await updatePlate(registeredPlate!.id, payload);
    } else {
      await addPlate({ plate: plateString, country, ...payload });
    }

    setSelectedPlate(null);
  };

  const handleDelete = async () => {
    await removePlate(registeredPlate!.id);
    setSelectedPlate(null);
  };

  const handleToggleAuthorized = (value: boolean) => {
    setIsAuthorized(value);
    if (value) {
      setAuthorizedUntil(new Date(daysFromNow(30)));
      setDurationKey(30);
      setDateConfirmed(true);
    } else {
      setAuthorizedUntil(null);
      setDurationKey(null);
      setDateConfirmed(false);
    }
  };

  const selectDuration = (days: number) => {
    setDurationKey(days);
    setAuthorizedUntil(new Date(daysFromNow(days)));
    setDateConfirmed(true);
  };

  const statusColor = !isRegistered
    ? "#9E9E9E"
    : registeredPlate?.isAuthorized
      ? "#22C55E"
      : Colors.danger;

  const statusBg = !isRegistered
    ? "#9E9E9E18"
    : registeredPlate?.isAuthorized
      ? "#22C55E18"
      : `${Colors.danger}18`;

  const StatusIcon = !isRegistered
    ? CircleOff
    : registeredPlate?.isAuthorized
      ? CheckCircle
      : TriangleAlert;

  const statusLabel = !isRegistered
    ? t("COMPONENTS.BottomSheet.plateStatus.notRegister")
    : registeredPlate.isAuthorized
      ? t("COMPONENTS.BottomSheet.plateStatus.authorized")
      : t("COMPONENTS.BottomSheet.plateStatus.unauthorized");

  return (
    <View style={styles.container}>
      <PlateVisual plate={plateString} country={country} />
      <View
        style={[
          styles.statusBanner,
          { backgroundColor: statusBg, borderColor: statusColor },
        ]}
      >
        <StatusIcon size={18} color={statusColor} />
        <ThemedText
          type="small"
          style={{ color: statusColor, fontWeight: "600" }}
        >
          {statusLabel}
        </ThemedText>
      </View>

      <AuthorizationForm
        isAuthorized={isAuthorized}
        onToggleAuthorized={handleToggleAuthorized}
        authorizedUntil={authorizedUntil}
        dateConfirmed={dateConfirmed}
        durationKey={durationKey}
        onSelectDuration={selectDuration}
        onEditDate={() => {
          setDateConfirmed(false);
          setDurationKey(null);
        }}
        customName={customName}
        onChangeCustomName={setCustomName}
        customInfos={customInfos}
        onChangeCustomInfos={setCustomInfos}
        lastSeen={registeredPlate?.lastSeen}
      />

      <ThemedButton icon={Save} onPress={handleSave}>
        {isRegistered
          ? t("GLOBAL.button.save")
          : t("GLOBAL.button.add_plate_to_parking")}
      </ThemedButton>

      <View style={styles.footer}>
        <ThemedButton
          variant="ghost"
          style={{ flex: 1 }}
          onPress={() => setSelectedPlate(null)}
          onLongPress={() => Alert.alert("Debug", "Tokens: " + scanCredits)}
          delayLongPress={3000}
        >
          {t("GLOBAL.button.close")}
        </ThemedButton>
        {isRegistered && (
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Trash2 size={18} color={Colors.danger} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  deleteBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.two,
    borderWidth: 1.5,
    borderColor: Colors.danger,
  },
});
