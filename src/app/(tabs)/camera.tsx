import { useRouter } from "expo-router";
import { useCameraPermission } from "react-native-vision-camera";

import { CameraScanner } from "@/components/features/camera/CameraScanner";

export default function CameraScreen() {
  const router = useRouter();
  const { hasPermission } = useCameraPermission();

  if (!hasPermission) {
    router.push("/(permission)/CameraPermission");
    return null;
  }

  return <CameraScanner />;
}