import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function UpsertParkingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getParking, createParking, updateParking, removeParking } =
    useAppStore();

  const isEditing = !!id;

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getParking(id).then((parking) => {
      if (!parking) return;
      setName(parking.name);
    });
  }, [id]);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (isEditing && id) {
        await updateParking(id, {
          name: name.trim(),
        });
      } else {
        await createParking({ name: name.trim() });
      }
      router.back();
    } finally {
      setLoading(false);
    }
  }

  function handleDelete() {
    Alert.alert(
      "Supprimer le parking",
      `Supprimer "${name}" ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={22} color={theme.text} />
          </Pressable>
          <ThemedText type="subtitle">
            {isEditing ? "Modifier le parking" : "Nouveau parking"}
          </ThemedText>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.section}>
          <ThemedInput
            label="Nom du parking"
            placeholder="Ex : Parking principal"
            value={name}
            onChangeText={setName}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton onPress={handleSave} disabled={!canSave || loading}>
          {isEditing ? "Enregistrer" : "Créer le parking"}
        </ThemedButton>
        {isEditing && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Trash2 size={18} color={Colors.danger} />
            <ThemedText type="default" style={{ color: Colors.danger }}>
              Supprimer le parking
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
    alignItems: "center",
  },
  section: {
    gap: Spacing.two,
  },
  footer: {
    padding: Spacing.three,
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
