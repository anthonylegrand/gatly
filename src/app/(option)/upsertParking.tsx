import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedInput } from "@/components/common/ThemedInput";
import { ThemedButton, ThemedText } from "@/components/ui";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { Colors, Spacing } from "@/constants";
import { PLATE_COUNTRIES, type PlateCountry } from "@/constants/plate.constant";
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
  const [selectedCountrys, setSelectedCountrys] = useState<PlateCountry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getParking(id).then((parking) => {
      if (!parking) return;
      setName(parking.name);
      setSelectedCountrys(parking.countrys ?? []);
    });
  }, [id]);

  function toggleCountry(country: PlateCountry) {
    setSelectedCountrys((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country],
    );
  }

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (isEditing && id) {
        await updateParking(id, {
          name: name.trim(),
          countrys: selectedCountrys,
        });
      } else {
        await createParking({ name: name.trim(), countrys: selectedCountrys });
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

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <ThemedText type="small" themeColor="textSecondary">
              Formats de plaques détectés
            </ThemedText>
          </View>
          <ThemedText type="small" style={[styles.infoText, { color: theme.textSecondary, opacity: 0.7 }]}>
            Seuls les véhicules dont la plaque correspond à un format sélectionné seront reconnus lors du scan.
          </ThemedText>
          <ThemedCard style={styles.countryList}>
            {PLATE_COUNTRIES.map((country, index) => {
              const isSelected = selectedCountrys.includes(
                country as PlateCountry,
              );
              const isLast = index === PLATE_COUNTRIES.length - 1;
              return (
                <View key={country}>
                  <Pressable
                    style={styles.countryRow}
                    onPress={() => toggleCountry(country as PlateCountry)}
                  >
                    <ThemedText type="default">
                      {COUNTRY_LABELS[country] ?? country}
                    </ThemedText>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected
                            ? Colors.primary
                            : "transparent",
                          borderColor: isSelected
                            ? Colors.primary
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      {isSelected && (
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                  </Pressable>
                  {!isLast && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: theme.background },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </ThemedCard>
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

const COUNTRY_LABELS: Record<string, string> = {
  FR: "France",
  BE: "Belgique",
  CH: "Suisse",
  LU: "Luxembourg",
};

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
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  infoText: {
    paddingHorizontal: Spacing.one,
  },
  countryList: {
    padding: 0,
    overflow: "hidden",
  },
  countryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.three,
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
