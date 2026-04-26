import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import ContentBottomSheet from "./content.bottomSheet";

interface Props {
  snapPoints?: string[];
  onDismiss?: () => void;
}

export default function BottomSheet({
  snapPoints = ["20%", "45%"],
  onDismiss: handleDismiss,
}: Props) {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      // index={snapPoints.length - 2}
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.backgroundSheet }}
      handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
    >
      <BottomSheetScrollView
        style={{ padding: Spacing.three }}
        contentContainerStyle={{ gap: Spacing.three }}
      >
        <ContentBottomSheet />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
