import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useCameraPermission } from "react-native-vision-camera";

import { CameraScanner } from "@/components/features/camera/CameraScanner";

export default function CameraScreen() {
  const router = useRouter();
  const { hasPermission } = useCameraPermission();

  useFocusEffect(
    useCallback(() => {
      if (!hasPermission) {
        router.push("/(permission)/CameraPermission");
      }
    }, [hasPermission]),
  );

  if (!hasPermission) return null;

  return <CameraScanner />;
}
