import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";

interface Props {
  children: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
}

export default function BottomSheet({
  children,
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
      index={snapPoints.length - 1}
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
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
