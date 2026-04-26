import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useAppStore } from "@/utils/store";
import { TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const { selectedPlate, setSelectedPlate } = useAppStore();

  return (
    <View style={{ padding: Spacing.three }}>
      <TouchableOpacity>
        <ThemedText>
          Open BottomSection {selectedPlate ? "Open" : "Closed"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
