import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/features/setup/AnimatedIcon";
import { ThemedButton, ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <AnimatedIcon />

        <View style={styles.texts}>
          <ThemedText type="title" style={styles.appName}>
            Gatly
          </ThemedText>
          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.intro}
          >
            Gérez vos accès et vos véhicules simplement depuis votre téléphone.
          </ThemedText>
        </View>
      </View>

      <ThemedButton
        subtitle="Introduction"
        onPress={() => router.push("/(intro)/Intro1")}
      >
        Commencer
      </ThemedButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.five,
  },
  texts: {
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  appName: {
    fontWeight: "700",
    textAlign: "center",
  },
  intro: {
    textAlign: "center",
    lineHeight: 22,
  },
});
