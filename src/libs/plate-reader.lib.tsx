import {
  PLATE_FORMATS,
  RECONSTRUCT,
  type PlateCountry,
} from "@/constants/plate.constant";

export interface PlateDetectionResult {
  country: PlateCountry;
  plate: string;
}

function normalize(text: string): string {
  return text
    .trim()
    .toUpperCase()
    .replace(/[-\s.]/g, "");
}

export function detectPlate(
  text: string,
  countries: PlateCountry[],
): PlateDetectionResult[] {
  const n = normalize(text);
  const results: PlateDetectionResult[] = [];
  for (const country of countries) {
    const candidate = RECONSTRUCT[country](n);
    if (candidate && PLATE_FORMATS[country].test(candidate)) {
      results.push({ country, plate: candidate });
    }
  }
  return results;
}
