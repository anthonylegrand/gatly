import { Stack } from "expo-router";

import { useTheme } from "@/hooks/theme/useTheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const theme = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme["background"] },
          }}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
