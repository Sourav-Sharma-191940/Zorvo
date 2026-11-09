/**
 * Design-system constants for TypeScript. Visual tokens (colours, fonts, sizes)
 * live in src/styles/tokens.css; this file holds the values JS code needs.
 */

/** Max-width breakpoints in px. Mirrors the @media values documented in tokens.css. */
export const BREAKPOINTS = {
  xs: 380, // small phones
  sm: 680, // phones: mobile layout + mobile type scale
  md: 920, // tablets: collapsed sidebar
  lg: 1180, // small laptops: stacked toolbars
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Media query string for "at or below" a breakpoint, for use with matchMedia. */
export const below = (breakpoint: Breakpoint) => `(max-width: ${BREAKPOINTS[breakpoint]}px)`;

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];
export type ThemePreference = Theme | "system";

export const THEME_STORAGE_KEY = "pcc-theme";
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

/**
 * Browser UI colour (mobile address bar, PWA title bar). Must match --bg in
 * tokens.css; Next.js metadata cannot read CSS variables, so it lives here.
 */
export const THEME_BROWSER_COLOR: Record<Theme, string> = {
  light: "#f7f8fb",
  dark: "#0c0f15",
};
