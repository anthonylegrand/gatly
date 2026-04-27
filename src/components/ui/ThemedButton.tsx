import type { LucideIcon } from "lucide-react-native";
import { Pressable, type PressableProps, View } from "react-native";

import { Colors, Spacing } from "@/constants";
import { useTheme } from "@/hooks/theme/useTheme";
import { ThemedText } from "./ThemedText";

type Variant = "primary" | "secondary" | "ghost";

type Props = Omit<PressableProps, "children"> & {
  children: string;
  variant?: Variant;
  subtitle?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
};

export function ThemedButton({
  children,
  variant = "primary",
  subtitle,
  icon: Icon,
  iconPosition = "left",
  style,
  ...rest
}: Props) {
  const theme = useTheme();

  const bg =
    variant === "primary"
      ? Colors.primary
      : variant === "secondary"
        ? theme.backgroundElement
        : "transparent";

  const textColor =
    variant === "primary"
      ? "#FFFFFF"
      : variant === "ghost"
        ? Colors.primary
        : theme.text;

  const borderColor = variant === "ghost" ? Colors.primary : undefined;

  const iconEl = Icon ? <Icon size={20} color={textColor} /> : null;

  const label = (
    <ThemedText style={{ color: textColor, fontWeight: "700", fontSize: 16 }}>
      {children}
    </ThemedText>
  );

  return (
    <Pressable
      {...rest}
      style={(state) => [
        {
          backgroundColor: bg,
          minHeight: 52,
          borderRadius: Spacing.two,
          paddingHorizontal: Spacing.three,
          paddingVertical: subtitle ? Spacing.two : 0,
          alignItems: "center",
          justifyContent: "center",
          opacity: state.pressed ? 0.8 : 1,
          gap: Spacing.one,
          borderWidth: borderColor ? 1.5 : 0,
          borderColor,
        },
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {Icon ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.two }}>
          {iconPosition === "left" && iconEl}
          {label}
          {iconPosition === "right" && iconEl}
        </View>
      ) : (
        label
      )}

      {subtitle && (
        <ThemedText style={{ color: textColor, opacity: 0.7, fontSize: 12 }}>
          {subtitle}
        </ThemedText>
      )}
    </Pressable>
  );
}
