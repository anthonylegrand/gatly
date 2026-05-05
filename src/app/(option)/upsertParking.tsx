import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Globe, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function UpsertParkingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    getParking,
    createParking,
    updateParking,
    removeParking,
    setSelectedParking,
  } = useAppStore();
  const { t } = useTranslation();

  const isEditing = !!id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getParking(id).then((parking) => {
      if (!parking) return;
      setName(parking.name);
    });
  }, [id, getParking]);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (isEditing && id) {
        await updateParking(id, {
          name: name.trim(),
        });
        router.dismissTo("/(option)/parkingsList");
      } else {
        const newParking = await createParking({ name: name.trim() });
        setSelectedParking(newParking);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDelete() {
    Alert.alert(
      t("GLOBAL.button.delete_parking"),
      t("option_page.UpsertParking.alert_message").replace("%%%", name),
      [
        { text: t("GLOBAL.button.cancel"), style: "cancel" },
        {
          text: t("GLOBAL.button.delete"),
          style: "destructive",
          onPress: async () => {
            await removeParking(id!);
            router.dismissTo("/(option)/parkingsList");
          },
        },
      ],
    );
  }

  const canSave = name.trim().length > 0;

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ThemedView
        type="primary"
        style={[styles.header, { paddingTop: Spacing.two }]}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color="#fff" />
        </Pressable>
        <View style={styles.headerText}>
          <ThemedText type="subtitle" style={{ color: "#fff" }}>
            {isEditing
              ? t("option_page.UpsertParking.title.edit")
              : t("option_page.UpsertParking.title.create")}
          </ThemedText>
          <ThemedText type="small" style={{ color: "rgba(255,255,255,0.75)" }}>
            {isEditing
              ? t("option_page.UpsertParking.description.edit")
              : t("option_page.UpsertParking.description.create")}
          </ThemedText>
        </View>
        <Pressable
          hitSlop={8}
          onPress={() => router.push("/(option)/appLanguage")}
        >
          <Globe size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>
      </ThemedView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <ThemedInput
            label={t("option_page.UpsertParking.inputs.parking_name.label")}
            placeholder={t(
              "option_page.UpsertParking.inputs.parking_name.placeholder",
            )}
            value={name}
            onChangeText={setName}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton onPress={handleSave} disabled={!canSave || loading}>
          {isEditing
            ? t("GLOBAL.button.save")
            : t("option_page.UpsertParking.button.create")}
        </ThemedButton>
        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={18} color={Colors.danger} />
            <ThemedText type="default" style={{ color: Colors.danger }}>
              {t("GLOBAL.button.delete_parking")}
            </ThemedText>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  section: {
    gap: Spacing.two,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
