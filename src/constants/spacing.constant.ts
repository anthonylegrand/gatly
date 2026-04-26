/**
 * Design System: "The High-Contrast Court"
 * @see DESIGN.md §6
 */
export const spacing = {
  /** 4px  – tight internal padding */
  xs: 4,
  /** 8px  – gap between inline elements */
  sm: 8,
  /** 12px – compact padding */
  md: 12,
  /** 16px – default section padding */
  lg: 16,
  /** 24px – card / list vertical rhythm */
  xl: 24,
  /** 32px – generous list separation */
  '2xl': 32,
  /** 48px – large section gap */
  '3xl': 48,
  /** 64px – screen-level breathing room */
  '4xl': 64,
  /** 56px – touch target height (buttons, per design spec) */
  touchTarget: 56,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
