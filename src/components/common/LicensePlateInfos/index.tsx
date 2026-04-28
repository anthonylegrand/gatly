import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useAppStore } from "@/utils/store";
import ContentBottomSheet from "./content.bottomSheet";

export default function LicensePlateInfos() {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { selectedPlate, setSelectedPlate } = useAppStore();

  useEffect(() => {
    if (selectedPlate) bottomSheetRef.current?.present();
    else bottomSheetRef.current?.close();
  }, [selectedPlate]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      onDismiss={() => setSelectedPlate(null)}
      snapPoints={["25%", "45%", "75%", "85%"]}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: theme.backgroundSheet }}
      handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
    >
      <BottomSheetScrollView
        style={{ padding: Spacing.three }}
        contentContainerStyle={{ gap: Spacing.three }}
      >
        {selectedPlate && <ContentBottomSheet />}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
