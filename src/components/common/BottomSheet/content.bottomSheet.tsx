import { ThemedText } from "@/components/ui";
import { View } from "react-native";
import { ThemedIcon } from "../ThemedIcon";

export default function ContentBottomSheet() {
  return (
    <View>
      <ThemedText>Camera Bottom Section !</ThemedText>
      <ThemedIcon name="User" color="primary" background />
    </View>
  );
}
