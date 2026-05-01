import { PLATE_COUNTRIES, PlateCountry } from "@/constants";
import i18n from "@/libs/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const MAX_SCANNABLE_PLATES = 5;

type PersistantState = {
  scannablePlateCountry: PlateCountry[];
  setScannablePlateCountry: (list: PlateCountry[]) => void;

  scanCredits: number;
  addScanCredits: (value: number) => void;
  removeScanCredits: (value: number) => void;

  appLanguage: string | null;
  setAppLanguage: (code: string) => void;

  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

const usePersistantStore = create<PersistantState>()(
  persist(
    (set) => ({
      scannablePlateCountry: PLATE_COUNTRIES,
      setScannablePlateCountry: (list) => set({ scannablePlateCountry: list }),

      scanCredits: 20,
      addScanCredits: (value) =>
        set((state) => ({
          scanCredits: state.scanCredits + value,
        })),
      removeScanCredits: (value) =>
        set((state) => ({
          scanCredits: Math.max(0, state.scanCredits - value),
        })),

      appLanguage: null,
      setAppLanguage: (code) => set({ appLanguage: code }),

      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "gatly-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.appLanguage) {
          i18n.changeLanguage(state.appLanguage);
        }
        if ((state?.scanCredits || 0) < 3) state?.addScanCredits(3);
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useHasHydrated = () => usePersistantStore((s) => s._hasHydrated);

export default usePersistantStore;
