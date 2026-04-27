import { Tabs, useRouter } from "expo-router";
import { ParkingSquare, ScanLine } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LicensePlateInfos from "@/components/common/LicensePlateInfos";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";
import { useEffect } from "react";

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { selectedParking } = useAppStore();

  useEffect(() => {
    if (!selectedParking) router.dismissTo("/(option)/parkingsList");
  }, [selectedParking]);

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
            title: "Parking",
            tabBarIcon: ({ color, size }) => (
              <ParkingSquare color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: "Scanner",
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
