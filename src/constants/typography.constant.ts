/**
 * Design System: "The High-Contrast Court"
 * @see DESIGN.md §3
 */
export const typography = {
  /** 56px – match scores (with tight letter-spacing) */
  scoreLg: 56,
  /** 44px – large match context */
  scoreMd: 44,
  /** 24px – player names, section titles */
  headingLg: 24,
  /** 18px – secondary headings, metadata */
  headingSm: 18,
  /** 16px – minimum for readable body text */
  bodyLg: 16,
  /** 14px – supporting text, never for critical game state */
  bodySm: 14,
  /** 12px – descriptors in ALL CAPS only */
  label: 12,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  bold: '700',
} as const;

export const letterSpacing = {
  /** Signature move for score displays */
  tight: -0.02,
  normal: 0,
} as const;

export type TypographyKey = keyof typeof typography;
export type TypographyValue = (typeof typography)[TypographyKey];
export type FontWeightKey = keyof typeof fontWeight;
