"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { DEFAULT_THEME_PREFERENCE, type ThemePreference } from "@/shared/theme/constants";
import {
  applyTheme,
  readSystemPrefersDark,
  readThemePreference,
  resolveTheme,
  subscribeTheme,
  writeThemePreference,
} from "./runtime";

/**
 * Keeps <html data-theme> in sync with the stored preference and the OS
 * setting. Mount once in the root layout. Reads the real values on mount (not a
 * server snapshot), so there is never a wrong-theme flash after hydration.
 */
export function ThemeSync() {
  useEffect(() => {
    const sync = () => applyTheme(resolveTheme(readThemePreference(), readSystemPrefersDark()));
    sync();
    return subscribeTheme(sync);
  }, []);
  return null;
}

/** Current theme preference + resolved theme, and a setter. Use in any client component. */
export function useTheme() {
  const preference = useSyncExternalStore(
    subscribeTheme,
    readThemePreference,
    () => DEFAULT_THEME_PREFERENCE,
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeTheme,
    readSystemPrefersDark,
    () => false,
  );
  const setPreference = useCallback((next: ThemePreference) => writeThemePreference(next), []);
  return { preference, theme: resolveTheme(preference, systemPrefersDark), setPreference };
}
