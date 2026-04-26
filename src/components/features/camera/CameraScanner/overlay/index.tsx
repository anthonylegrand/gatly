import { StyleSheet, View } from "react-native";
import type { ScanRegion } from "react-native-vision-camera-ocr-plus";

import type { PlateDetectionResult } from "@/libs/plate-reader.lib";

import { ScanRegionOverlay } from "./ScanRegion";
import { ScannedTextOverlay } from "./ScannedText";

type Props = {
  region: ScanRegion;
  scannedText: PlateDetectionResult | null;
};

export function ScanOverlay({ region, scannedText }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ScanRegionOverlay region={region} />
      {scannedText && (
        <ScannedTextOverlay region={region} result={scannedText} />
      )}
    </View>
  );
}
