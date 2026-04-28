import type { LucideIcon } from "lucide-react-native";
import { TextInput, View, type TextInputProps } from "react-native";

import { Spacing } from "@/constants/theme.constant";
import { useTheme } from "@/hooks/theme/useTheme";
import { ThemedText } from "../ui/ThemedText";

type Props = TextInputProps & {
  label?: string;
  icon?: LucideIcon;
  inputComponent?: React.ComponentType<TextInputProps>;
};

export function ThemedInput({
  label,
  icon: Icon,
  style,
  inputComponent: Input = TextInput,
  multiline,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <View style={{ gap: Spacing.one }}>
      {label && (
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: theme.backgroundElement,
          borderRadius: Spacing.two,
          paddingHorizontal: Spacing.two,
          ...(multiline ? { paddingVertical: Spacing.two, minHeight: 44 } : { height: 44 }),
        }}
      >
        {Icon && <Icon size={18} color={theme.textSecondary} />}
        <Input
          multiline={multiline}
          placeholderTextColor={theme.textSecondary}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: 14,
              paddingHorizontal: Icon ? Spacing.two : Spacing.one,
              ...(multiline && { textAlignVertical: "top" }),
            },
            style,
          ]}
          {...rest}
        />
      </View>
    </View>
  );
}