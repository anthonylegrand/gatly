import { PLATE_FORMATS, type PlateCountry } from "@/constants/plate.constant";

function normalize(text: string): string {
  return text.trim().toUpperCase().replace(/[-\s.]/g, "");
}

// Reconstruit le candidat formaté (avec séparateurs) depuis le texte normalisé
const RECONSTRUCT: Record<PlateCountry, (n: string) => string | null> = {
  FR: (n) => n.length === 7 ? `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5, 7)}` : null,
  BE: (n) => n.length === 7 ? `${n[0]}-${n.slice(1, 4)}-${n.slice(4, 7)}` : null,
  CH: (n) => n.length >= 3 && n.length <= 8 ? n : null,
  LU: (n) => n.length === 6 ? n : null,
};

export function detectPlate(text: string): string | null {
  const n = normalize(text);
  for (const country of Object.keys(PLATE_FORMATS) as PlateCountry[]) {
    const candidate = RECONSTRUCT[country](n);
    if (candidate && PLATE_FORMATS[country].test(candidate)) {
      return candidate;
    }
  }
  return null;
}