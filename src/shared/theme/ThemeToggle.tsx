"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import type { ThemePreference } from "@/shared/theme/constants";
import { useTheme } from "./ThemeProvider";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABEL: Record<ThemePreference, string> = { system: "System", light: "Light", dark: "Dark" };
const ICON = { system: Monitor, light: Sun, dark: Moon } as const;

/** Cycles System → Light → Dark. The choice persists across visits and tabs. */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
  const Icon = ICON[preference];
  return (
    <Button
      variant="icon"
      onClick={() => setPreference(next)}
      ariaLabel={`Theme: ${LABEL[preference]}. Switch to ${LABEL[next]}`}
      className="theme-toggle"
    >
      <Icon size="1.125rem" />
    </Button>
  );
}
