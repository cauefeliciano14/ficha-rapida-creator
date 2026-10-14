/** CSS uses these inclusive maxima; complementary minima are max + 1. */
export const BREAKPOINTS = {
  sm: 479,
  md: 767,
  lg: 1023,
  xl: 1279,
} as const;

export const MEDIA_QUERIES = {
  sm: `(max-width: ${BREAKPOINTS.sm}px)`,
  md: `(max-width: ${BREAKPOINTS.md}px)`,
  lg: `(max-width: ${BREAKPOINTS.lg}px)`,
  xl: `(max-width: ${BREAKPOINTS.xl}px)`,
  mobile: `(max-width: ${BREAKPOINTS.md}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md + 1}px) and (max-width: ${BREAKPOINTS.lg}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg + 1}px)`,
  wide: `(min-width: ${BREAKPOINTS.xl + 1}px)`,
} as const;