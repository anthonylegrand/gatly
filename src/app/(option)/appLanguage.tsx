import { useRouter } from "expo-router";
import { Check, ChevronDown, Globe } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import i18n from "@/libs/i18n";
import usePersistantStore from "@/utils/store/usePersistantStore";

const getLangName = (code: string) =>
  (i18n.getResource(code, "translation", "language_name") as string) ?? code;

export default function AppLanguageScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, i18n: i18nHook } = useTranslation();
  const [open, setOpen] = useState(false);
  const setAppLanguage = usePersistantStore((s) => s.setAppLanguage);

  const languages = useMemo(
    () =>
      Object.keys(i18n.options.resources ?? {}).map((code) => ({
        code,
        label: getLangName(code),
      })),
    [],
  );

  const currentLabel = getLangName(i18nHook.language);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setAppLanguage(code);
    setOpen(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconGlow} />
          <Globe size={40} color="#FFFFFF" />
        </View>

        <View style={styles.texts}>
          <ThemedText type="subtitle" style={styles.title}>
            {t("option_page.AppLanguage.title")}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.text}
          >
            {t("option_page.AppLanguage.description")}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[
            styles.selector,
            { backgroundColor: theme.backgroundElement },
          ]}
          onPress={() => setOpen(true)}
          activeOpacity={0.7}
        >
          <ThemedText type="default">{currentLabel}</ThemedText>
          <ChevronDown size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ThemedButton variant="ghost" onPress={() => router.back()}>
          {t("GLOBAL.button.back")}
        </ThemedButton>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.backgroundSheet }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.sheetTitle}
            >
              {t("option_page.AppLanguage.title")}
            </ThemedText>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageRow}
                  onPress={() => handleSelect(item.code)}
                  activeOpacity={0.7}
                >
                  <ThemedText type="default">{item.label}</ThemedText>
                  {i18nHook.language === item.code && (
                    <Check size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: theme.backgroundElement },
                  ]}
                />
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.five,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  iconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 55,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    transform: [{ scale: 1.4 }],
  },
  texts: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
  },
  text: {
    textAlign: "center",
    lineHeight: 22,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
  },
  footer: {
    gap: Spacing.three,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    paddingHorizontal: Spacing.three,
  },
  sheetTitle: {
    textAlign: "center",
    marginBottom: Spacing.two,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  separator: {
    height: 1,
  },
});
