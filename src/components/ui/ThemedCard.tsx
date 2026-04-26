import { View, type ViewProps } from "react-native";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";

type Props = ViewProps;

export function ThemedCard({ style, children, ...rest }: Props) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.backgroundElement,
          borderRadius: Spacing.two,
          padding: Spacing.three,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
