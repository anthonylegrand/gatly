import { useRouter } from "expo-router";
import { ChevronRight, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";

export function LangChipButton() {
  const router = useRouter();
  const theme = useTheme();
  const { i18n } = useTranslation();

  const currentLang =
    (i18n.getResource(i18n.language, "translation", "language_name") as string) ??
    i18n.language;

  return (
    <Pressable
      style={[styles.chip, { backgroundColor: theme.backgroundElement }]}
      onPress={() => router.push("/(option)/appLanguage")}
    >
      <Globe size={14} color={theme.textSecondary} />
      <ThemedText type="small" themeColor="textSecondary">
        {currentLang}
      </ThemedText>
      <ChevronRight size={14} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    alignSelf: "center",
  },
});
