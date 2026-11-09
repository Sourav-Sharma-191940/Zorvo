/**
 * Theme constants for TypeScript. Visual values (colours, fonts, sizes) live in
 * src/styles/theme.css; this file holds only what JavaScript needs.
 */

/**
 * Screen sizes in px, mobile-first: each is the minimum width for that size.
 * Must match --breakpoint-* in src/app/globals.css (CSS can't share variables
 * with media queries or JS).
 */
export const BREAKPOINTS = {
  xs: 380, // large phones
  sm: 680, // tablets (below this = phone layout + phone type scale)
  md: 920, // small laptops
  lg: 1180, // laptops
  xl: 1440, // desktops
  "2xl": 1920, // large monitors
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** matchMedia query for "this size and up", same as Tailwind's `md:` etc. */
export const up = (breakpoint: Breakpoint) => `(min-width: ${BREAKPOINTS[breakpoint] / 16}rem)`;

/** matchMedia query for "smaller than this size", same as Tailwind's `max-md:` etc. */
export const below = (breakpoint: Breakpoint) => `(width < ${BREAKPOINTS[breakpoint] / 16}rem)`;

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export type ThemePreference = Theme | "system";

export const THEME_STORAGE_KEY = "pcc-theme";
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

/**
 * Browser UI colour (mobile address bar). Must match --background in
 * theme.css; Next.js metadata cannot read CSS variables.
 */
export const THEME_BROWSER_COLOR: Record<Theme, string> = {
  light: "#f7f8fb",
  dark: "#0c0f15",
};
