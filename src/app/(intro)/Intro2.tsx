import { useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";

import { IntroPage } from "@/components/features/setup/IntroPage";

export default function DatasPrivacy() {
  const router = useRouter();

  return (
    <IntroPage
      icon={ShieldCheck}
      title="Vos données protégées"
      text="Toutes les données sont régies par la RGPD. Pour les informations personnelles, un simple email suffit — la personne concernée reçoit un lien et choisit ce qu'elle partage. Elle peut supprimer ses données à tout moment."
      page={2}
      total={2}
      nextLabel="C'est parti"
      onNext={() => router.dismissTo("/(setup)/UpsertParking")}
    />
  );
}
