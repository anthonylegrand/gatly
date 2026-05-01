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

export const PLATE_FORMATS: Record<PlateCountry, RegExp> = {
  FR: /^[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}$/,
  EN: /^[A-Z]{2}\d{2} [A-Z]{3}$/,
  ES: /^\d{4}[A-Z]{3}$/,
  DE: /^[A-Z]{1,3}-[A-Z]{1,2}-\d{1,4}$/,
  NL: /^[A-Z]{2}-\d{3}-[A-Z]$/,
  IT: /^[A-Z]{2}\d{3}[A-Z]{2}$/,
  PL: /^[A-Z]{2} \d{5}$/,
  CH: /^[A-Z]{2}\d{1,6}$/,
  BE: /^[1-9]-[A-Z]{3}-\d{3}$/,
  LU: /^[A-Z]{2}\d{4}$/,
};

export const RECONSTRUCT: Record<PlateCountry, (n: string) => string | null> = {
  FR: (n) =>
    n.length === 7
      ? `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5, 7)}`
      : null,
  EN: (n) =>
    n.length === 7
      ? `${n.slice(0, 2)}${n.slice(2, 4)} ${n.slice(4, 7)}`
      : null,
  ES: (n) => (n.length === 7 ? n : null),
  DE: (n) => (n.length >= 4 && n.length <= 8 ? n : null),
  NL: (n) =>
    n.length === 6
      ? `${n.slice(0, 2)}-${n.slice(2, 5)}-${n[5]}`
      : null,
  IT: (n) => (n.length === 7 ? n : null),
  PL: (n) =>
    n.length === 7 ? `${n.slice(0, 2)} ${n.slice(2, 7)}` : null,
  CH: (n) => (n.length >= 3 && n.length <= 8 ? n : null),
  BE: (n) =>
    n.length === 7 ? `${n[0]}-${n.slice(1, 4)}-${n.slice(4, 7)}` : null,
  LU: (n) => (n.length === 6 ? n : null),
};

const FR_LETTERS = "ABCDEFGHJKLMNPQRSTVWXYZ";
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rndChar = (charset: string) =>
  charset[Math.floor(Math.random() * charset.length)];
const rndInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const rndStr = (charset: string, len: number) =>
  Array.from({ length: len }, () => rndChar(charset)).join("");

const assertNever = (x: never): never => {
  throw new Error(`Unhandled PlateCountry: ${x}`);
};

export function generateFakePlate(country: PlateCountry): string {
  switch (country) {
    case "FR":
      return `${rndStr(FR_LETTERS, 2)}-${String(rndInt(1, 999)).padStart(3, "0")}-${rndStr(FR_LETTERS, 2)}`;
    case "EN":
      return `${rndStr(ALL_LETTERS, 2)}${String(rndInt(0, 99)).padStart(2, "0")} ${rndStr(ALL_LETTERS, 3)}`;
    case "ES":
      return `${String(rndInt(0, 9999)).padStart(4, "0")}${rndStr(ALL_LETTERS, 3)}`;
    case "DE": {
      const city = rndStr(ALL_LETTERS, rndInt(1, 3));
      const id = rndStr(ALL_LETTERS, rndInt(1, 2));
      return `${city}-${id}-${rndInt(1, 9999)}`;
    }
    case "NL":
      return `${rndStr(ALL_LETTERS, 2)}-${String(rndInt(0, 999)).padStart(3, "0")}-${rndChar(ALL_LETTERS)}`;
    case "IT":
      return `${rndStr(ALL_LETTERS, 2)}${String(rndInt(0, 999)).padStart(3, "0")}${rndStr(ALL_LETTERS, 2)}`;
    case "PL":
      return `${rndStr(ALL_LETTERS, 2)} ${String(rndInt(0, 99999)).padStart(5, "0")}`;
    case "CH":
      return `${rndStr(ALL_LETTERS, 2)}${rndInt(1, 999999)}`;
    case "BE":
      return `${rndInt(1, 9)}-${rndStr(ALL_LETTERS, 3)}-${String(rndInt(0, 999)).padStart(3, "0")}`;
    case "LU":
      return `${rndStr(ALL_LETTERS, 2)}${String(rndInt(0, 9999)).padStart(4, "0")}`;
    default:
      return assertNever(country);
  }
}
