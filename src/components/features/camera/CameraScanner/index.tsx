import { useIsFocused } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import type { ScanRegion } from "react-native-vision-camera-ocr-plus";
import { useTextRecognition } from "react-native-vision-camera-ocr-plus";
import { Worklets } from "react-native-worklets-core";

import type { Text } from "react-native-vision-camera-ocr-plus";

import { PLATE_COUNTRIES } from "@/constants";
import { detectPlate, PlateDetectionResult } from "@/libs/plate-reader.lib";
import { ScanOverlay } from "./overlay";

const SCAN_REGION: ScanRegion = {
  left: "10%",
  top: "35%",
  width: "80%",
  height: "14%",
};

const FRAME_SKIP_THRESHOLD = 20;

export function CameraScanner() {
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const [scannedText, setScannedText] = useState<PlateDetectionResult | null>(
    null,
  );

  const { scanText } = useTextRecognition({
    language: "latin",
    frameSkipThreshold: FRAME_SKIP_THRESHOLD,
    scanRegion: SCAN_REGION,
    useLightweightMode: true,
  });

  const handleResult = useCallback((result: Text) => {
    for (const block of result.blocks) {
      const solutions = detectPlate(block.blockText, PLATE_COUNTRIES);
      if (solutions.length > 0) {
        console.log(`[block] "${block.blockText}" →`, solutions[0]);
        setScannedText(solutions[0]);
        return;
      }
    }
  }, []);

  const handleResultOnJS = useMemo(
    () => Worklets.createRunOnJS(handleResult),
    [handleResult],
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const result = scanText(frame);
      if (result?.resultText) handleResultOnJS(result);
    },
    [scanText, handleResultOnJS],
  );

  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      />

      <ScanOverlay region={SCAN_REGION} scannedText={scannedText} />
    </View>
  );
}
