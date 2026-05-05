import { Tabs, useRouter } from "expo-router";
import { ParkingSquare, ScanLine } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LicensePlateInfos from "@/components/common/LicensePlateInfos";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { selectedParking } = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedParking) router.dismissTo("/(option)/parkingsList");
  }, [selectedParking, router]);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: theme["background"],
            paddingTop: insets.top,
          },
          tabBarStyle: { backgroundColor: theme["navigationBackground"] },
          tabBarActiveTintColor: theme["navigationActive"],
          tabBarInactiveTintColor: theme["navigationInactive"],
        }}
      >
        <Tabs.Screen
          name="parking"
          options={{
            title: t("GLOBAL.tab_navigation.parking_label"),
            tabBarIcon: ({ color, size }) => (
              <ParkingSquare color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: t("GLOBAL.tab_navigation.camera_label"),
            tabBarIcon: ({ color, size }) => (
              <ScanLine color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <LicensePlateInfos />
    </>
  );
}
