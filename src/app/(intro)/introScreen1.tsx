import { useRouter } from "expo-router";
import { ScanLine } from "lucide-react-native";

import { IntroPage } from "@/components/features/setup/IntroPage";

export default function AuthorisationsAndInfos() {
  const router = useRouter();

  return (
    <IntroPage
      icon={ScanLine}
      title="Vérification instantanée"
      text="Scannez une plaque et voyez immédiatement si le véhicule est autorisé. Consultez les informations qui y sont rattachées en un instant."
      page={1}
      total={2}
      onNext={() => router.push("/(intro)/introScreen2")}
    />
  );
}
