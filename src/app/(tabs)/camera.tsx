import BottomSheet from "@/components/common/BottomSheet";
import { ThemedText } from "@/components/ui";
import { Spacing } from "@/constants";
import { useBottomSectionState } from "@/store/useBottomSectionStore";
import { TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const { currentSection, toggleSection } = useBottomSectionState();

  return (
    <View style={{ padding: Spacing.three }}>
      <TouchableOpacity onPress={() => toggleSection()}>
        <ThemedText>
          Open BottomSection {currentSection ? "Open" : "Closed"}
        </ThemedText>
      </TouchableOpacity>

      {currentSection && (
        <BottomSheet
          snapPoints={["25%", "45%", "75%"]}
          onDismiss={() => toggleSection(false)}
        />
      )}
    </View>
  );
}
