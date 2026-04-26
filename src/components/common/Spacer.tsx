import { Spacing, SpacingKey } from "@/constants";
import { View } from "react-native";

type Props = {
  size?: SpacingKey | number;
  horizontal?: boolean;
};

export function Spacer({ size = "three", horizontal = false }: Props) {
  const value = typeof size === "number" ? size : Spacing[size];
  return <View style={horizontal ? { width: value } : { height: value }} />;
}
