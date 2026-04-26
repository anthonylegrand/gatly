import type { LucideProps } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { Spacing, type ThemeColor } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";

type IconName = {
  [K in keyof typeof LucideIcons]: (typeof LucideIcons)[K] extends React.ComponentType<LucideProps>
    ? K
    : never;
}[keyof typeof LucideIcons];

type Props = Omit<LucideProps, "color"> & {
  name: IconName;
  color?: ThemeColor;
  background?: boolean;
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ThemedIcon({
  name,
  color = "text",
  size = 24,
  strokeWidth = 2,
  background,
  ...rest
}: Props) {
  const theme = useTheme();
  const iconColor = theme[color];
  const Icon = LucideIcons[name] as React.ComponentType<LucideProps>;

  const icon = (
    <Icon color={iconColor} size={size} strokeWidth={strokeWidth} {...rest} />
  );

  if (!background) return icon;

  const bgColor = hexToRgba(iconColor, 0.15);
  const padding =
    typeof size === "number" ? Math.round((size as number) * 0.5) : 12;
  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: Spacing.two,
        padding,
        alignSelf: "flex-start",
      }}
    >
      {icon}
    </View>
  );
}
