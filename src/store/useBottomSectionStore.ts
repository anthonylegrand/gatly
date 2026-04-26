import { create } from "zustand";

type useBottomSectionState = {
  currentSection: boolean;
  toggleSection: (value?: boolean) => void;
};

export const useBottomSectionState = create<useBottomSectionState>()(
  (set): useBottomSectionState => ({
    currentSection: false,
    toggleSection: (value?: boolean) =>
      set((state) => ({ currentSection: value ?? !state.currentSection })),
  }),
);
