import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { runMigrations } from "@/../db/migrations";
import { useTheme } from "@/hooks/theme/useTheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  const theme = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runMigrations().then(() => setReady(true));
  }, []);

  if (!ready) return null;

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
