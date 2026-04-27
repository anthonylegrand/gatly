import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PersistantState = {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

const usePersistantStore = create<PersistantState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "gatly-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const useHasHydrated = () =>
  usePersistantStore((s) => s._hasHydrated);

export default usePersistantStore;