import { ThemedText } from "@/components/ui";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <ThemedText>Edit src/app/index.tsx to edit this screen.</ThemedText>

      <TouchableOpacity onPress={() => router.push("/(tabs)/parking")}>
        <ThemedText>Press me</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
