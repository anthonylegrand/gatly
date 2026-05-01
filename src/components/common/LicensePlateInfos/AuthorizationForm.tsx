import { CalendarDays, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Switch, View } from "react-native";

import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useDayjs } from "@/hooks/useDayjs";

const DURATIONS = [
  { label: "1 sem.", days: 7 },
  { label: "1 mois", days: 30 },
  { label: "3 mois", days: 90 },
  { label: "6 mois", days: 180 },
  { label: "1 an", days: 365 },
];

type Props = {
  isAuthorized: boolean;
  onToggleAuthorized: (value: boolean) => void;
  authorizedUntil: Date | null;
  dateConfirmed: boolean;
  durationKey: number | null;
  onSelectDuration: (days: number) => void;
  onEditDate: () => void;
  customName: string;
  onChangeCustomName: (text: string) => void;
  customInfos: string;
  onChangeCustomInfos: (text: string) => void;
  lastSeen?: number | null;
};

export function AuthorizationForm({
  isAuthorized,
  onToggleAuthorized,
  authorizedUntil,
  dateConfirmed,
  durationKey,
  onSelectDuration,
  onEditDate,
  customName,
  onChangeCustomName,
  customInfos,
  onChangeCustomInfos,
  lastSeen,
}: Props) {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const day = useDayjs();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
    >
      {/* Authorization toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleLabel}>
          <ThemedText type="default" style={{ fontWeight: "600" }}>
            {t("COMPONENTS.BottomSheet.form.authorisation.label")}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t("COMPONENTS.BottomSheet.form.authorisation.description")}
          </ThemedText>
        </View>
        <Switch
          value={isAuthorized}
          onValueChange={onToggleAuthorized}
          trackColor={{ false: theme.backgroundSheet, true: Colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Duration */}
      {isAuthorized && (
        <View style={styles.durationSection}>
          {dateConfirmed ? (
            <View style={styles.confirmedDate}>
              <View style={styles.confirmedDateLeft}>
                <CalendarDays size={13} color={theme.textSecondary} />
                <ThemedText
                  type="small"
                  themeColor="textSecondary"
                  style={{ fontStyle: "italic" }}
                >
                  {authorizedUntil &&
                    t(
                      "COMPONENTS.BottomSheet.form.authorizedUntil.description",
                    ).replace(
                      "%%%",
                      authorizedUntil?.toLocaleDateString(i18n.language),
                    )}
                </ThemedText>
              </View>
              <Pressable hitSlop={8} onPress={onEditDate}>
                <ThemedText
                  type="small"
                  style={{ color: Colors.primary, fontWeight: "600" }}
                >
                  {t("GLOBAL.button.edit")}
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <>
              <ThemedText type="small" themeColor="textSecondary">
                {t("COMPONENTS.BottomSheet.form.authorizedUntil.label")}
              </ThemedText>
              <View style={styles.chips}>
                {DURATIONS.map((d) => {
                  const isActive = durationKey === d.days;
                  return (
                    <Pressable
                      key={d.label}
                      onPress={() => onSelectDuration(d.days)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isActive
                            ? Colors.primary
                            : theme.backgroundSheet,
                          borderColor: isActive
                            ? Colors.primary
                            : theme.backgroundElement,
                        },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: isActive ? "#FFFFFF" : theme.textSecondary,
                          fontWeight: isActive ? "700" : "400",
                        }}
                      >
                        {d.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>
      )}

      {/* Divider */}
      <View
        style={[styles.divider, { backgroundColor: theme.backgroundSheet }]}
      />

      <ThemedInput
        label={t("COMPONENTS.BottomSheet.form.customName.label")}
        placeholder={t("COMPONENTS.BottomSheet.form.customName.placeholder")}
        value={customName}
        onChangeText={onChangeCustomName}
      />

      <ThemedInput
        label={t("COMPONENTS.BottomSheet.form.additionalData.label")}
        placeholder={t(
          "COMPONENTS.BottomSheet.form.additionalData.placeholder",
        )}
        value={customInfos}
        onChangeText={onChangeCustomInfos}
        multiline
        numberOfLines={3}
      />

      {/* Last seen */}
      {!!lastSeen && (
        <View style={styles.lastSeenRow}>
          <Clock size={13} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            {t("COMPONENTS.BottomSheet.lastScan").replace(
              "%%%",
              day(lastSeen).fromNow(),
            )}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  toggleLabel: {
    flex: 1,
    gap: 2,
  },
  durationSection: {
    gap: Spacing.two,
  },
  confirmedDate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  confirmedDateLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  lastSeenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
