import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { useRewardedInterstitial } from "@/libs/admob/admob-interstitial.lib";
import { useAppStore } from "@/utils/store";
import usePersistantStore from "@/utils/store/usePersistantStore";
import ContentBottomSheet from "./content.bottomSheet";

export default function LicensePlateInfos() {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { selectedPlate, setSelectedPlate } = useAppStore();
  const { scanCredits, removeScanCredits, addScanCredits } =
    usePersistantStore();

  const { show: showAd, load: loadAd } = useRewardedInterstitial({
    onRewarded: (_, amount) => addScanCredits(amount),
  });

  useEffect(() => {
    const isLastCredit = scanCredits <= 1;

    if (selectedPlate) {
      removeScanCredits(1);
      bottomSheetRef.current?.present();
      if (isLastCredit) loadAd(); // Précharger à l'ouverture
    } else {
      bottomSheetRef.current?.close();
      if (isLastCredit) showAd(); // Afficher à la fermeture
    }
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
