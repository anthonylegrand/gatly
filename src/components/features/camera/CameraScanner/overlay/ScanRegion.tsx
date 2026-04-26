import { StyleSheet, View } from "react-native";
import type { ScanRegion } from "react-native-vision-camera-ocr-plus";

import { ThemedText } from "@/components/ui/ThemedText";
import { Colors, Spacing } from "@/constants/theme.constant";

const BG = "rgba(0,0,0,0.55)";
const CORNER = { position: "absolute" as const, width: 16, height: 16, borderColor: "#FFFFFF" };

const pct = (n: number) => `${n}%` as `${number}%`;

type Props = { region: ScanRegion };

export function ScanRegionOverlay({ region }: Props) {
  const pLeft = parseFloat(region.left as string);
  const pTop = parseFloat(region.top as string);
  const pWidth = parseFloat(region.width as string);
  const pHeight = parseFloat(region.height as string);

  const top = pct(pTop);
  const left = pct(pLeft);
  const width = pct(pWidth);
  const height = pct(pHeight);
  const right = pct(100 - pLeft - pWidth);
  const bottom = pct(pTop + pHeight);
  const bottomFromBottom = pct(100 - pTop - pHeight);

  return (
    <>
      {/* Dark masks */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: top, backgroundColor: BG }} />
      <View style={{ position: "absolute", top: bottom, left: 0, right: 0, bottom: 0, backgroundColor: BG }} />
      <View style={{ position: "absolute", top, left: 0, width: left, height, backgroundColor: BG }} />
      <View style={{ position: "absolute", top, right: 0, width: right, height, backgroundColor: BG }} />

      {/* Scan border */}
      <View style={{ position: "absolute", top, left, width, height, borderWidth: 2, borderColor: Colors.primary, borderRadius: 8 }} />

      {/* Corners */}
      <View style={{ ...CORNER, top, left, borderTopWidth: 3, borderLeftWidth: 3 }} />
      <View style={{ ...CORNER, top, right, borderTopWidth: 3, borderRightWidth: 3 }} />
      <View style={{ ...CORNER, bottom: bottomFromBottom, left, borderBottomWidth: 3, borderLeftWidth: 3 }} />
      <View style={{ ...CORNER, bottom: bottomFromBottom, right, borderBottomWidth: 3, borderRightWidth: 3 }} />

      <ThemedText
        type="small"
        style={{ position: "absolute", top: bottom, alignSelf: "center", color: "rgba(255,255,255,0.7)", marginTop: Spacing.two }}
      >
        Pointez la caméra vers la plaque
      </ThemedText>
    </>
  );
}
