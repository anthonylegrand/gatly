import { useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { IntroPage } from "@/components/features/setup/IntroPage";

export default function DatasPrivacy() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <IntroPage
      icon={ShieldCheck}
      title={t("intro_page.DatasPrivacy.title")}
      text={t("intro_page.DatasPrivacy.text")}
      page={2}
      total={2}
      nextLabel={t("intro_page.DatasPrivacy.button.title")}
      onNext={() => router.dismissTo("/(option)/parkingsList")}
    />
  );
}
