import { Spacing } from "@/constants";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function PlateIcon() {
  const { t } = useTranslation();

  return (
    <View style={[styles.plateIcon, styles.plateBorder]}>
      <View style={styles.plateBorder}>
        <Text style={styles.plateText}>
          {t("tabs_page.camera.PlateIconComponent.demoTextPlate")}
        </Text>
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
