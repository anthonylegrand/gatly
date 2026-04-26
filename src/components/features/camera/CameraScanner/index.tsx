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

import { detectPlate } from "@/utils/detectPlate";
import { ScanOverlay } from "./overlay";

const SCAN_REGION: ScanRegion = {
  left: "10%",
  top: "42%",
  width: "80%",
  height: "14%",
};

export function CameraScanner() {
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const [scannedText, setScannedText] = useState<string | null>(null);

  const { scanText } = useTextRecognition({
    language: "latin",
    frameSkipThreshold: 15,
    scanRegion: SCAN_REGION,
  });

  const handleResult = useCallback((result: Text) => {
    for (const block of result.blocks) {
      const plate = detectPlate(block.blockText);
      if (plate) {
        console.log(`[block] "${block.blockText}" →`, plate);
        setScannedText(plate);
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

      <ScanOverlay />
    </View>
  );
}
