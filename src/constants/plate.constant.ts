import RandExp from "randexp";

import { resources, type I18NLanguage } from "@/libs/i18n/resources";

type I18NPlateCountry = Uppercase<I18NLanguage>;

const EXTRA_PLATE_COUNTRIES = ["CH", "BE", "LU"] as const;
type ExtraPlateCountry = (typeof EXTRA_PLATE_COUNTRIES)[number];

export type PlateCountry = I18NPlateCountry | ExtraPlateCountry;

export const PLATE_COUNTRIES: PlateCountry[] = [
  ...(Object.keys(resources) as I18NLanguage[]).map(
    (l) => l.toUpperCase() as I18NPlateCountry,
  ),
  ...EXTRA_PLATE_COUNTRIES,
];

export type PlateFormat = {
  regex: RegExp;
  connectors: string[];
};

export const PLATE_FORMATS: Record<PlateCountry, PlateFormat[]> = {
  FR: [{ regex: /^([A-HJ-NP-TV-Z]{2})(\d{3})([A-HJ-NP-TV-Z]{2})$/, connectors: ["-", "-"] }],
  EN: [{ regex: /^([A-Z]{2})(\d{2})([A-Z]{3})$/, connectors: ["", " "] }],
  ES: [{ regex: /^(\d{4})([A-Z]{3})$/, connectors: [""] }],
  DE: [{ regex: /^([A-Z]{1,3})([A-Z]{1,2})(\d{1,4})$/, connectors: ["-", "-"] }],
  NL: [{ regex: /^([A-Z]{2})(\d{3})([A-Z])$/, connectors: ["-", "-"] }],
  IT: [{ regex: /^([A-Z]{2})(\d{3})([A-Z]{2})$/, connectors: ["", ""] }],
  PL: [{ regex: /^([A-Z]{2})(\d{5})$/, connectors: [" "] }],
  CH: [{ regex: /^([A-Z]{2})(\d{1,6})$/, connectors: [""] }],
  BE: [{ regex: /^([1-9])([A-Z]{3})(\d{3})$/, connectors: ["-", "-"] }],
  LU: [{ regex: /^([A-Z]{2})(\d{4})$/, connectors: [""] }],
  PT: [
    { regex: /^(\d{2})(\d{2})([A-Z]{2})$/, connectors: ["-", "-"] },
    { regex: /^([A-Z]{2})(\d{2})(\d{2})$/, connectors: ["-", "-"] },
    { regex: /^(\d{2})([A-Z]{2})(\d{2})$/, connectors: ["-", "-"] },
  ],
};

export const COUNTRY_META: Record<PlateCountry, { flag: string; name: string }> = {
  FR: { flag: "🇫🇷", name: "France" },
  EN: { flag: "🇬🇧", name: "United Kingdom" },
  ES: { flag: "🇪🇸", name: "España" },
  DE: { flag: "🇩🇪", name: "Deutschland" },
  NL: { flag: "🇳🇱", name: "Nederland" },
  IT: { flag: "🇮🇹", name: "Italia" },
  PL: { flag: "🇵🇱", name: "Polska" },
  CH: { flag: "🇨🇭", name: "Schweiz" },
  BE: { flag: "🇧🇪", name: "Belgique" },
  LU: { flag: "🇱🇺", name: "Luxembourg" },
  PT: { flag: "🇵🇹", name: "Portugal" },
};

export function reconstruct(country: PlateCountry, text: string): string | null {
  for (const { regex, connectors } of PLATE_FORMATS[country]) {
    const match = text.match(regex);
    if (!match) continue;
    const groups = match.slice(1);
    let result = groups[0];
    for (let i = 1; i < groups.length; i++) result += (connectors[i - 1] ?? "") + groups[i];
    return result;
  }
  return null;
}

export const EXAMPLE_PLATES: Record<PlateCountry, string> = Object.fromEntries(
  PLATE_COUNTRIES.map((c) => {
    const raw = new RandExp(PLATE_FORMATS[c][0].regex).gen();
    return [c, reconstruct(c, raw) ?? raw];
  }),
) as Record<PlateCountry, string>;
