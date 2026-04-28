import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ui";
import { Colors, Spacing } from "@/constants";
import { PlateDetectionResult } from "@/libs/plate-reader.lib";

type Props = {} & PlateDetectionResult;

export function PlateVisual({ plate, country }: Props) {
  return (
    <View style={styles.plate}>
      <View style={styles.strip}>
        <ThemedText style={styles.stripCountry}>{country}</ThemedText>
      </View>
      <View style={styles.numberWrapper}>
        <ThemedText style={styles.number}>{plate}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plate: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  strip: {
    width: 36,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.two,
    gap: 2,
  },
  stripCountry: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  numberWrapper: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    justifyContent: "center",
  },
  number: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#111827",
    fontFamily: "monospace",
  },
});
