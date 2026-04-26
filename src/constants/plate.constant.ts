export const PLATE_FORMATS = {
  FR: /^[A-HJ-NP-TV-Z]{2}-\d{3}-[A-HJ-NP-TV-Z]{2}$/,
  BE: /^[1-9]-[A-Z]{3}-\d{3}$/,
  CH: /^[A-Z]{2}\d{1,6}$/,
  LU: /^[A-Z]{2}\d{4}$/,
};

export type PlateCountry = keyof typeof PLATE_FORMATS;
