import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import it from "./it.json";
import nl from "./nl.json";
import pl from "./pl.json";
import pt from "./pt.json";

export const resources = {
  fr: { translation: fr },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  nl: { translation: nl },
  it: { translation: it },
  pl: { translation: pl },
  pt: { translation: pt },
} as const;

export type I18NLanguage = keyof typeof resources;
