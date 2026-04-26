import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { Colors, Spacing } from "@/constants/theme.constant";

const BG = "rgba(0,0,0,0.55)";
const CORNER = { position: "absolute" as const, width: 16, height: 16, borderColor: "#FFFFFF" };

export function ScanOverlay() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", backgroundColor: BG }} />
      <View style={{ position: "absolute", top: "56%", left: 0, right: 0, bottom: 0, backgroundColor: BG }} />
      <View style={{ position: "absolute", top: "42%", left: 0, width: "10%", height: "14%", backgroundColor: BG }} />
      <View style={{ position: "absolute", top: "42%", right: 0, width: "10%", height: "14%", backgroundColor: BG }} />

      <View style={{ position: "absolute", top: "42%", left: "10%", width: "80%", height: "14%", borderWidth: 2, borderColor: Colors.primary, borderRadius: 8 }} />

      <View style={{ ...CORNER, top: "42%", left: "10%", borderTopWidth: 3, borderLeftWidth: 3 }} />
      <View style={{ ...CORNER, top: "42%", right: "10%", borderTopWidth: 3, borderRightWidth: 3 }} />
      <View style={{ ...CORNER, top: "54%", left: "10%", borderBottomWidth: 3, borderLeftWidth: 3 }} />
      <View style={{ ...CORNER, top: "54%", right: "10%", borderBottomWidth: 3, borderRightWidth: 3 }} />

      <ThemedText
        type="small"
        style={{ position: "absolute", top: "57%", alignSelf: "center", color: "rgba(255,255,255,0.7)", marginTop: Spacing.two }}
      >
        Pointez la caméra vers la plaque
      </ThemedText>
    </View>
  );
}