import { ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";

export default function CameraPermissionScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { hasPermission, requestPermission } = useCameraPermission();

  if (hasPermission) {
    router.push("/(tabs)/camera");
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        alignItems: "center",
        justifyContent: "center",
        padding: Spacing.five,
        gap: Spacing.four,
      }}
    >
      <View
        style={{
          backgroundColor: theme.backgroundElement,
          borderRadius: 999,
          padding: Spacing.four,
        }}
      >
        <Camera size={48} color={Colors.primary} />
      </View>

      <View style={{ alignItems: "center", gap: Spacing.two }}>
        <ThemedText type="subtitle" style={{ textAlign: "center" }}>
          Accès à la caméra
        </ThemedText>
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={{ textAlign: "center", lineHeight: 22 }}
        >
          Gatly utilise la caméra pour scanner les plaques d'immatriculation en
          temps réel et les associer automatiquement à ton parking.
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={requestPermission}
        style={{
          backgroundColor: Colors.primary,
          borderRadius: Spacing.two,
          paddingVertical: Spacing.three,
          paddingHorizontal: Spacing.five,
          width: "100%",
          alignItems: "center",
        }}
      >
        <ThemedText
          type="default"
          style={{ color: "#FFFFFF", fontWeight: "600" }}
        >
          Autoriser la caméra
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
