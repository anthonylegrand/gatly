import { create } from "zustand";

type useAppState = {};

export const useAppState = create<useAppState>()((set): useAppState => ({}));
