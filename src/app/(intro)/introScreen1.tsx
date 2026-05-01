import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { IntroPage } from "@/components/features/setup/IntroPage";

export default function AuthorisationsAndInfos() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <IntroPage
      icon={ScanLine}
      title={t("intro_page.AuthorisationsAndInfos.title")}
      text={t("intro_page.AuthorisationsAndInfos.text")}
      page={1}
      total={2}
      onNext={() => router.push("/(intro)/introScreen2")}
    />
  );
}
