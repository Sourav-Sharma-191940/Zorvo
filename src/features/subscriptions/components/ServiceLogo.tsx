import { cn } from "@/shared/lib/utils";
import type { Subscription } from "../data";

/** Real third-party brand colours; the one place literal colours are allowed. */
const brandColors: Record<string, { bg: string; fg?: string }> = {
  netflix: { bg: "#e50914" },
  spotify: { bg: "#1db954" },
  youtube: { bg: "#ff0000" },
  google: { bg: "#4285f4" },
  microsoft: { bg: "#0f6cbd" },
  amazon: { bg: "#ff9900", fg: "#111111" },
  cult: { bg: "#0e0e0e" },
};

type LogoSize = "sm" | "md" | "lg";

const sizeClass: Record<LogoSize, string> = {
  sm: "size-7.5 rounded-sm text-sm",
  md: "size-9.5 rounded-md text-lg",
  lg: "size-11.5 rounded-lg text-2xl",
};

/** Smaller lettering for the long "YT"-style wordmark brand. */
const compactText: Record<LogoSize, string> = {
  sm: "text-2xs",
  md: "text-xs",
  lg: "text-xs",
};

export function ServiceLogo({
  item,
  small = false,
  large = false,
}: {
  item: Subscription;
  small?: boolean;
  large?: boolean;
}) {
  const size: LogoSize = small ? "sm" : large ? "lg" : "md";
  const brand = brandColors[item.brand];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center self-center leading-none font-bold tracking-tight",
        sizeClass[size],
        brand ? !brand.fg && "text-primary-foreground" : "bg-primary text-primary-foreground",
        item.brand === "youtube" && compactText[size],
        item.brand === "amazon" ? "normal-case" : "uppercase",
      )}
      style={brand ? { backgroundColor: brand.bg, color: brand.fg } : undefined}
    >
      {item.initials}
    </span>
  );
}
