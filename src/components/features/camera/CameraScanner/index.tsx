import { useIsFocused } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
import { detectPlate } from "@/libs/plate-reader.lib";
import { useAppStore } from "@/utils/store";
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
  const { selectedPlate, setSelectedPlate } = useAppStore();
  const hasPlate = useRef(Worklets.createSharedValue(false));

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
        hasPlate.current.value = true;
        setSelectedPlate(solutions[0]);
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
      if (hasPlate.current.value) return;
      const result = scanText(frame);
      if (result?.resultText) handleResultOnJS(result);
    },
    [scanText, handleResultOnJS],
  );

  useEffect(() => {
    if (!selectedPlate) hasPlate.current.value = false;
  }, [selectedPlate]);

  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor}
      />

      {/* #TODO Enlever display en remplacer scannedText par liste lest lecture
      Pour annimer les estimation et calculs
      Ajouter la liste des pays avec les quelles on hesite pour deselectionner certains */}
      <ScanOverlay region={SCAN_REGION} scannedText={selectedPlate} />
    </View>
  );
}
