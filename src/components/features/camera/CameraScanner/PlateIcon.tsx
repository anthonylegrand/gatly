import { Spacing } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

export default function PlateIcon() {
  return (
    <View style={[styles.plateIcon, styles.plateBorder]}>
      <View style={styles.plateBorder}>
        <Text style={styles.plateText}>ABC12X</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plateIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  plateBorder: {
    padding: Spacing.one,
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "solid",
  },
  plateText: {
    color: "#FFFFFF",
    paddingHorizontal: Spacing.two,
  },
});
