import { useRouter } from "expo-router";
import { Globe } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LangChipButton } from "@/components/common/LangChipButton";
import { Spacer } from "@/components/common/Spacer";
import { AnimatedIcon } from "@/components/features/setup/AnimatedIcon";
import { ThemedButton, ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  const { loadParkings, parkings } = useAppStore();

  const isFirstStart = parkings.length === 0;

  useEffect(() => {
    loadParkings();
  }, [loadParkings]);

  useEffect(() => {
    if (!isFirstStart) router.dismissTo("/(option)/parkingsList");
  }, [isFirstStart, router]);

  if (!isFirstStart) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.topBar}>
        <Pressable
          hitSlop={8}
          onPress={() => router.push("/(option)/appLanguage")}
        >
          <Globe size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <AnimatedIcon />

        <View style={styles.texts}>
          <ThemedText type="title" style={styles.appName}>
            Gatly
          </ThemedText>
          <ThemedText type="code">{t("welcome_page.main_job")}</ThemedText>

          <Spacer size={"one"} />

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.intro}
          >
            {t("welcome_page.intro")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <LangChipButton />

        <ThemedButton
          subtitle={t("welcome_page.button.subtitle")}
          onPress={() => router.push("/(intro)/introScreen1")}
        >
          {t("welcome_page.button.title")}
        </ThemedButton>
      </View>
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
  texts: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  appName: {
    fontWeight: "700",
    textAlign: "center",
  },
  intro: {
    textAlign: "center",
    lineHeight: 22,
  },
  topBar: {
    alignItems: "flex-end",
  },
  footer: {
    gap: Spacing.three,
  },
});
