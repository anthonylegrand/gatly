/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme.constant";
import { useColorScheme } from "@/hooks/theme/useColorScheme";

const rootColors = Object.fromEntries(
  Object.entries(Colors).filter(([, v]) => typeof v === "string")
) as { [K in keyof typeof Colors as (typeof Colors)[K] extends string ? K : never]: string };

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === "unspecified" ? "light" : scheme;

  return { ...rootColors, ...Colors[theme] };
}
