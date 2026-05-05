import { useRouter } from "expo-router";
import { Check, X } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { CountryPlateItem } from "@/components/features/CountryPlateItem";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import {
  COUNTRY_META,
  EXAMPLE_PLATES,
  PLATE_FORMATS,
  type PlateCountry,
} from "@/constants/plate.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { detectPlate, PlateDetectionResult } from "@/libs/plate-reader.lib";
import { useAppStore } from "@/utils/store";
import usePersistantStore from "@/utils/store/usePersistantStore";

const MONO = Platform.OS === "ios" ? "Courier New" : "monospace";

function extractSlots(regex: RegExp): ("L" | "D")[] {
  const slots: ("L" | "D")[] = [];
  const groupRe = /\(([^)]+)\)/g;
  let m;
  while ((m = groupRe.exec(regex.source)) !== null) {
    const content = m[1];
    const isDigit = content.includes("\\d") || /^\[[\d1-9]/.test(content);
    const type: "L" | "D" = isDigit ? "D" : "L";
    const countMatch = /\{(\d+)(?:,(\d+))?\}/.exec(content);
    const count = countMatch ? parseInt(countMatch[2] ?? countMatch[1]) : 1;
    for (let i = 0; i < count; i++) slots.push(type);
  }
  return slots;
}

function buildPreview(example: string, prefix: string): string {
  let i = 0;
  return example
    .split("")
    .map((ch) => {
      if (/[A-Z]/.test(ch)) return i < prefix.length ? prefix[i++] : "X";
      if (/\d/.test(ch)) return i < prefix.length ? prefix[i++] : "0";
      return ch;
    })
    .join("");
}

function isCompatiblePrefix(country: PlateCountry, n: string): boolean {
  if (!n) return true;
  for (const { regex } of PLATE_FORMATS[country]) {
    const slots = extractSlots(regex);
    if (n.length > slots.length) continue;
    let ok = true;
    for (let i = 0; i < n.length; i++) {
      const c = n[i];
      if (slots[i] === "L" && !/[A-Z]/.test(c)) {
        ok = false;
        break;
      }
      if (slots[i] === "D" && !/\d/.test(c)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

export default function ManualPlateScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { setSelectedPlate } = useAppStore();
  const { scannablePlateCountry } = usePersistantStore();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const normalized = query
    .trim()
    .toUpperCase()
    .replace(/[-\s.]/g, "");

  const matches: PlateDetectionResult[] = query.trim()
    ? detectPlate(query, scannablePlateCountry)
    : [];

  const matchedCountries = new Set(matches.map((m) => m.country));

  const suggestions = scannablePlateCountry
    .filter(
      (c) => !matchedCountries.has(c) && isCompatiblePrefix(c, normalized),
    )
    .map((c) => ({
      country: c,
      preview: buildPreview(EXAMPLE_PLATES[c], normalized),
    }));

  function handleSelect(match: PlateDetectionResult) {
    setSelectedPlate(match);
    router.back();
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ThemedView
        type="primary"
        style={[styles.header, { paddingTop: insets.top + Spacing.two }]}
      >
        <View style={styles.headerText}>
          <ThemedText type="subtitle" style={{ color: "#fff" }}>
            {t("option_page.ManualPlate.title")}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.headerDescription, { color: "rgba(255,255,255,0.75)" }]}
          >
            {t("option_page.ManualPlate.start_typing")}
          </ThemedText>
        </View>
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <X size={22} color="rgba(255,255,255,0.75)" />
        </Pressable>
      </ThemedView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputSection}>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.inputLabel}
          >
            {t("option_page.ManualPlate.input_label")}
          </ThemedText>
          <ThemedView type="backgroundElement" style={styles.inputWrapper}>
            <TextInput
              value={query}
              onChangeText={(v) => setQuery(v.toUpperCase())}
              autoFocus
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder={t("option_page.ManualPlate.input_label")}
              placeholderTextColor={theme.textSecondary}
              clearButtonMode="while-editing"
              style={[
                query.length !== 0 ? styles.plateInput : null,
                { color: theme.text },
              ]}
            />
          </ThemedView>
        </View>

        {matches.length > 0 && (
          <View style={styles.section}>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.sectionLabel}
            >
              {t("option_page.ManualPlate.section_match")}
            </ThemedText>
            {matches.map((m) => (
              <CountryPlateItem
                key={m.country}
                variant="match"
                country={m.country}
                plate={m.plate}
                onPress={() => handleSelect(m)}
              />
            ))}
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.section}>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.sectionLabel}
            >
              {t("option_page.ManualPlate.section_suggestions")}
            </ThemedText>
            {suggestions.map(({ country: c, preview }) => (
              <CountryPlateItem
                key={c}
                variant="suggestion"
                country={c}
                plate={preview}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ThemedView
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.three,
            borderTopColor: theme.backgroundElement,
          },
        ]}
      >
        {matches.length === 1 && (
          <TouchableOpacity
            onPress={() => handleSelect(matches[0])}
            activeOpacity={0.85}
            style={styles.confirmCard}
          >
            <ThemedText style={styles.confirmFlag}>
              {COUNTRY_META[matches[0].country].flag}
            </ThemedText>
            <View style={styles.confirmInfo}>
              <ThemedText style={styles.confirmPlate}>
                {matches[0].plate}
              </ThemedText>
              <ThemedText style={styles.confirmLabel}>
                {t("option_page.ManualPlate.confirm")}
              </ThemedText>
            </View>
            <Check size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        )}

        <ThemedButton
          variant="secondary"
          onPress={() => router.back()}
          style={styles.footerButton}
        >
          {t("GLOBAL.button.back")}
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerText: {
    gap: 4,
  },
  headerDescription: {
    fontWeight: "400",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  inputSection: {
    gap: 6,
  },
  inputLabel: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: "center",
    height: 52,
  },
  plateInput: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: MONO,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.two,
  },
  footerButton: {
    flex: 1,
  },
  confirmCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    backgroundColor: Colors.primary,
    borderRadius: 14,
  },
  confirmFlag: {
    fontSize: 28,
    lineHeight: 34,
  },
  confirmInfo: {
    flex: 1,
    gap: 3,
  },
  confirmPlate: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: MONO,
    color: "#fff",
  },
  confirmLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
});
