import { useIsFocused, useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import type { ScanRegion } from "react-native-vision-camera-ocr-plus";
import { useTextRecognition } from "react-native-vision-camera-ocr-plus";
import { Worklets } from "react-native-worklets-core";

import type { Text } from "react-native-vision-camera-ocr-plus";

import { ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { AdBanner } from "@/libs/admob/admob-banner.lib";
import { detectPlate } from "@/libs/plate-reader.lib";
import { useAppStore } from "@/utils/store";
import usePersistantStore from "@/utils/store/usePersistantStore";
import BlinkedEye from "./BlinkedEye";
import PlateIcon from "./PlateIcon";

const SCAN_REGION: ScanRegion = {
  left: "5%",
  top: "10%",
  width: "90%",
  height: "80%",
};

const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", EN: "🇬🇧", ES: "🇪🇸", DE: "🇩🇪",
  NL: "🇳🇱", IT: "🇮🇹", PL: "🇵🇱", CH: "🇨🇭", BE: "🇧🇪", LU: "🇱🇺",
};

const FRAME_SKIP_THRESHOLD = 30;
const CAMERA_WIDTH = Dimensions.get("window").width * 0.85;
const CAMERA_HEIGHT = CAMERA_WIDTH / 2.5;

export function CameraScanner() {
  const device = useCameraDevice("back");
  const isFocused = useIsFocused();
  const { selectedPlate, setSelectedPlate, plates, updatePlate } =
    useAppStore();
  const { scannablePlateCountry } = usePersistantStore();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const hasPlate = useRef(Worklets.createSharedValue(false));
  const platesRef = useRef(plates);

  useEffect(() => {
    platesRef.current = plates;
  }, [plates]);

  const { scanText } = useTextRecognition({
    language: "latin",
    frameSkipThreshold: FRAME_SKIP_THRESHOLD,
    scanRegion: SCAN_REGION,
    useLightweightMode: true,
  });

  const handleResult = useCallback(
    (result: Text) => {
      for (const block of result.blocks) {
        const solutions = detectPlate(block.blockText, scannablePlateCountry);
        if (solutions.length > 0) {
          hasPlate.current.value = true;
          setSelectedPlate(solutions[0]);

          const found = platesRef.current.find(
            (p) => p.plate === solutions[0].plate,
          );
          if (found) {
            const today = new Date().setHours(0, 0, 0, 0);
            const lastDay = new Date(found.lastSeen).setHours(0, 0, 0, 0);
            if (lastDay < today)
              updatePlate(found.id, { lastSeen: Date.now() });
          }
          return;
        }
      }
    },
    [updatePlate, scannablePlateCountry],
  );

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
    <SafeAreaView style={[styles.container, { paddingTop: -insets.top }]}>
      <AdBanner />

      <View style={styles.content}>
        <PlateIcon />

        <View style={styles.texts}>
          <ThemedText type="subtitle" style={styles.title}>
            {t("tabs_page.camera.title")}
          </ThemedText>
          <ThemedText type="small" style={styles.description}>
            {t("tabs_page.camera.description")}
          </ThemedText>
        </View>

        <View style={styles.cameraWrapper}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isFocused}
            frameProcessor={frameProcessor}
          />
        </View>

        <BlinkedEye />

        <ThemedText type="small" style={styles.footer}>
          {t("tabs_page.camera.footer")}
        </ThemedText>

        <Pressable
          style={styles.countriesChip}
          onPress={() => router.push("/(option)/scannablePlates")}
          hitSlop={8}
        >
          <ThemedText style={styles.chipFlags}>
            {scannablePlateCountry.map((c) => COUNTRY_FLAGS[c]).join("  ")}
          </ThemedText>
          <SlidersHorizontal size={14} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  texts: {
    alignItems: "center",
    gap: Spacing.one,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  cameraWrapper: {
    width: CAMERA_WIDTH,
    height: CAMERA_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  footer: {
    color: "rgba(255,255,255,0.35)",
    textAlign: "center",
  },
  countriesChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  chipFlags: {
    fontSize: 18,
    lineHeight: 22,
  },
});
