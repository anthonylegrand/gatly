/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  primary: "#1E88E5",
  primaryLight: "#64B5F6",
  secondary: "#FF6584",
  danger: "#EF4444",

  light: {
    text: "#1A1A1A",
    background: "#F8F8FA",
    backgroundSheet: "#FFFFFF",
    backgroundElement: "#EFEFF3",
    textSecondary: "#60646C",

    headerBackground: "#EFEFF3",
    headerText: "#1A1A1A",
    navigationBackground: "#EFEFF3",
    navigationActive: "#1A1A1A",
    navigationInactive: "#60646C",
  },
  dark: {
    text: "#F0F0F0",
    background: "#313338",
    backgroundSheet: "#383A40",
    backgroundElement: "#2B2D31",
    textSecondary: "#B5BAC1",

    headerBackground: "#2B2D31",
    headerText: "#F0F0F0",
    navigationBackground: "#2B2D31",
    navigationActive: "#F0F0F0",
    navigationInactive: "#B5BAC1",
  },
} as const;

type RootColorKeys = {
  [K in keyof typeof Colors]: (typeof Colors)[K] extends string ? K : never;
}[keyof typeof Colors];

export type ThemeColor =
  | (keyof typeof Colors.light & keyof typeof Colors.dark)
  | RootColorKeys;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export type SpacingKey = keyof typeof Spacing;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
