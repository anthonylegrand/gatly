import { StyleSheet, Text, View } from "react-native";
import type { ScanRegion } from "react-native-vision-camera-ocr-plus";

import { Colors, Spacing } from "@/constants/theme.constant";
import type { PlateDetectionResult } from "@/libs/plate-reader.lib";

const pct = (n: number) => `${n}%` as `${number}%`;

type Props = {
  region: ScanRegion;
  result: PlateDetectionResult;
};

export function ScannedTextOverlay({ region, result }: Props) {
  const pTop = parseFloat(region.top as string);
  const pHeight = parseFloat(region.height as string);
  const top = pct(pTop + pHeight + Spacing.one);

  return (
    <View style={[styles.container, { top }]}>
      <View style={styles.countryBadge}>
        <Text style={styles.country}>{result.country}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.plate}>{result.plate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: 24,
    gap: 8,
  },
  countryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  country: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  plate: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
});
