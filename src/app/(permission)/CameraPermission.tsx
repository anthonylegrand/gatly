import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useEffect } from "react";
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

  useEffect(() => {
    if (hasPermission) {
      router.back();
    }
  }, [hasPermission]);

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
            Accès à la caméra
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.text}
          >
            Gatly utilise la caméra pour scanner les plaques d'immatriculation
            en temps réel et les associer automatiquement à votre parking.
          </ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedButton onPress={requestPermission}>
          Autoriser la caméra
        </ThemedButton>
        <ThemedButton
          variant="ghost"
          onPress={() => router.dismissTo("/(tabs)/parking")}
        >
          Retour
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
