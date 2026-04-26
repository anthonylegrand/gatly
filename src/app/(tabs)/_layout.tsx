import { Tabs } from "expo-router";
import { ParkingSquare, ScanLine } from "lucide-react-native";

import LicensePlateInfos from "@/components/common/LicensePlateInfos";
import { useTheme } from "@/hooks/theme/useTheme";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: theme["background"] },
          headerStyle: { backgroundColor: theme["headerBackground"] },
          headerTintColor: theme["headerText"],
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
