import { useRouter } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LangChipButton } from "@/components/common/LangChipButton";
import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";

type Props = {
  icon: LucideIcon;
  title: string;
  text: string;
  page: number;
  total: number;
  onNext: () => void;
  nextLabel?: string;
};

export function IntroPage({
  icon: Icon,
  title,
  text,
  page,
  total,
  onNext,
  nextLabel,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

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
        <View style={styles.iconWrapper}>
          <View style={styles.iconGlow} />
          <Icon size={40} color="#FFFFFF" />
        </View>

        <View style={styles.texts}>
          <ThemedText type="subtitle" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.text}
          >
            {text}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <LangChipButton />

        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i + 1 === page
                  ? styles.dotActive
                  : { backgroundColor: theme.backgroundElement },
              ]}
            />
          ))}
        </View>

        <ThemedButton onPress={onNext}>
          {nextLabel || t("GLOBAL.button.next")}
        </ThemedButton>
        <ThemedButton variant="ghost" onPress={() => router.back()}>
          {t("GLOBAL.button.back")}
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
  footer: {
    gap: Spacing.three,
  },
  topBar: {
    alignItems: "flex-end",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
});
