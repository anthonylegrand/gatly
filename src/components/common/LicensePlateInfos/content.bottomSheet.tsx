import { View } from "react-native";

import { Plate } from "@/../db/schema";
import { ThemedText } from "@/components/ui";
import { ThemedIcon } from "../ThemedIcon";

interface Props {
  plateData: Plate;
}

export default function ContentBottomSheet({ plateData }: Props) {
  return (
    <View>
      <ThemedText>Camera Bottom Section !</ThemedText>
      <ThemedIcon name="User" color="primary" background />
    </View>
  );
}
