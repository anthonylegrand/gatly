export const PLATE_COUNTRIES = ["FR", "BE", "CH", "LU"];
export type PlateCountry = (typeof PLATE_COUNTRIES)[number];

export const PLATE_FORMATS: Record<PlateCountry, RegExp> = {
  FR: /^[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}$/,
  BE: /^[1-9]-[A-Z]{3}-\d{3}$/,
  CH: /^[A-Z]{2}\d{1,6}$/,
  LU: /^[A-Z]{2}\d{4}$/,
};

export const RECONSTRUCT: Record<PlateCountry, (n: string) => string | null> = {
  FR: (n) =>
    n.length === 7
      ? `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5, 7)}`
      : null,
  BE: (n) =>
    n.length === 7 ? `${n[0]}-${n.slice(1, 4)}-${n.slice(4, 7)}` : null,
  CH: (n) => (n.length >= 3 && n.length <= 8 ? n : null),
  LU: (n) => (n.length === 6 ? n : null),
};
