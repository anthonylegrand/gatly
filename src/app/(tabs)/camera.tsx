import { Redirect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useTextRecognition } from "react-native-vision-camera-ocr-plus";
import { Worklets } from "react-native-worklets-core";

import { ThemedCard } from "@/components/ui/ThemedCard";
import { ThemedText } from "@/components/ui/ThemedText";
import { Spacing } from "@/constants/theme.constant";

export default function CameraScreen() {
  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [scannedText, setScannedText] = useState<string | null>(null);

  const { scanText } = useTextRecognition({
    language: "latin",
    frameSkipThreshold: 10,
  });

  const handleText = useCallback((text: string) => {
    setScannedText(text);
  }, []);

  const handleTextOnJS = Worklets.createRunOnJS(handleText);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const result = scanText(frame);
      if (result?.resultText) {
        handleTextOnJS(result.resultText);
      }
    },
    [scanText, handleTextOnJS],
  );

  if (!hasPermission) {
    return <Redirect href={"/(permission)/CameraPermission"} />;
  }

  if (!device) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
      />

      {scannedText && (
        <ThemedCard
          style={{
            position: "absolute",
            bottom: Spacing.five,
            right: Spacing.three,
            maxWidth: "60%",
          }}
        >
          <ThemedText type="small" numberOfLines={4}>
            {scannedText}
          </ThemedText>
        </ThemedCard>
      )}
    </View>
  );
}
