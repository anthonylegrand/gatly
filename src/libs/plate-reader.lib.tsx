import {
  reconstruct,
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
    const plate = reconstruct(country, n);
    if (plate) results.push({ country, plate });
  }
  return results;
}
