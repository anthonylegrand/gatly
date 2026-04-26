import BottomSheet from "@/components/common/BottomSheet";
import { ThemedText } from "@/components/ui";
import { spacing } from "@/constants";
import { useBottomSectionState } from "@/store/useBottomSectionStore";
import { TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const { currentSection, toggleSection } = useBottomSectionState();

  return (
    <View style={{ padding: spacing.md }}>
      <ThemedText>CameraScreen</ThemedText>

      <TouchableOpacity onPress={() => toggleSection()}>
        <ThemedText>
          Open BottomSection {currentSection ? "Open" : "Closed"}
        </ThemedText>
      </TouchableOpacity>

      {currentSection && (
        <BottomSheet
          snapPoints={["20%", "45%"]}
          onDismiss={() => toggleSection(false)}
        >
          <ThemedText>Camera Bottom Section</ThemedText>
        </BottomSheet>
      )}
    </View>
  );
}
