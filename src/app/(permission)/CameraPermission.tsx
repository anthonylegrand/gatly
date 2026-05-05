import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCameraPermission } from "react-native-vision-camera";

import { ThemedButton, ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";

export default function CameraPermissionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { t } = useTranslation();

  useEffect(() => {
    if (hasPermission) {
      router.back();
    }
  }, [hasPermission, router]);

  if (hasPermission) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconGlow} />
          <Camera size={40} color="#FFFFFF" />
        </View>

        <View style={styles.texts}>
          <ThemedText type="subtitle" style={styles.title}>
            {t("permission_page.camera.title")}
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.text}
          >
            {t("permission_page.camera.description")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedButton onPress={requestPermission}>
          {t("permission_page.camera.button.accept")}
        </ThemedButton>
        <ThemedButton
          variant="ghost"
          onPress={() => router.dismissTo("/(tabs)/parking")}
        >
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
});
