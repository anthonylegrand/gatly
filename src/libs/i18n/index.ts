import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";

// Détecte la langue de l'appareil
const deviceLanguage = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: deviceLanguage, // Langue par défaut basée sur le téléphone
  fallbackLng: "en", // Langue de secours
  interpolation: {
    escapeValue: false, // Inutile pour React
  },
});

export default i18n;
