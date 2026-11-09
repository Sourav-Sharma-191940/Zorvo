import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Inline script for <head>. Runs before first paint so the correct theme is
 * applied immediately (no light flash for dark-mode users). Kept dependency-free.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})||${JSON.stringify(DEFAULT_THEME_PREFERENCE)};var d=p==="dark"||(p!=="light"&&window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches);var t=d?"dark":"light";var e=document.documentElement;e.dataset.theme=t;e.style.colorScheme=t;}catch(_){}})();`;

const listeners = new Set<() => void>();

/** Subscribe to preference changes (this tab + other tabs) and OS theme changes. */
export function subscribeTheme(callback: () => void): () => void {
  listeners.add(callback);
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    media.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function readThemePreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") return value;
  } catch {
    // Storage can be unavailable (privacy mode); fall back to the default.
  }
  return DEFAULT_THEME_PREFERENCE;
}

export const readSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): Theme {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore storage failures; the in-memory notify below still updates the UI.
  }
  listeners.forEach((listener) => listener());
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
